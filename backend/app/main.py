from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import stripe
import json
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize Stripe
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
SITE_URL = os.getenv("SITE_URL", os.getenv("NEXT_PUBLIC_SITE_URL", "http://localhost:5173"))

if not STRIPE_SECRET_KEY:
    print("WARNING: STRIPE_SECRET_KEY is not set. Stripe payments will not work.")
else:
    stripe.api_key = STRIPE_SECRET_KEY

# Load templates from JSON file
TEMPLATES_FILE = Path(__file__).parent / "templates.json"
PURCHASES_FILE = Path(__file__).parent / "purchases.json"

def load_templates():
    with open(TEMPLATES_FILE, "r") as f:
        data = json.load(f)
    return {t["id"]: t for t in data["templates"]}

def get_template_by_id(template_id: str):
    templates = load_templates()
    return templates.get(template_id)

# In-memory purchases store (also persisted to JSON file)
def load_purchases():
    if PURCHASES_FILE.exists():
        with open(PURCHASES_FILE, "r") as f:
            return json.load(f)
    return {}

def save_purchase(session_id: str, purchase_data: dict):
    purchases = load_purchases()
    purchases[session_id] = purchase_data
    with open(PURCHASES_FILE, "w") as f:
        json.dump(purchases, f, indent=2)

def get_purchase(session_id: str):
    purchases = load_purchases()
    return purchases.get(session_id)

# Request/Response models
class CheckoutRequest(BaseModel):
    templateId: str

class CheckoutResponse(BaseModel):
    url: str

class PurchaseResponse(BaseModel):
    templateId: str
    templateName: str
    email: str
    downloadUrl: str
    purchasedAt: str

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/api/checkout", response_model=CheckoutResponse)
async def create_checkout_session(request: CheckoutRequest):
    """Create a Stripe Checkout Session for a template purchase."""
    
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe is not configured. Please set STRIPE_SECRET_KEY.")
    
    template = get_template_by_id(request.templateId)
    
    if not template:
        raise HTTPException(status_code=400, detail=f"Template not found: {request.templateId}")
    
    if template.get("comingSoon"):
        raise HTTPException(status_code=400, detail="This template is not yet available for purchase.")
    
    price_cents = template.get("priceCents")
    if not price_cents:
        raise HTTPException(status_code=400, detail="This template does not have a price set.")
    
    try:
        # Create Stripe Checkout Session with dynamic price_data
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": template["name"],
                            "description": template["shortDescription"],
                        },
                        "unit_amount": price_cents,
                    },
                    "quantity": 1,
                }
            ],
            metadata={
                "templateId": template["id"],
            },
            success_url=f"{SITE_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{SITE_URL}/templates/{template['id']}?canceled=1",
        )
        
        return CheckoutResponse(url=session.url)
    
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")

@app.post("/api/stripe-webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events."""
    
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Stripe webhook secret is not configured.")
    
    # Get raw body for signature verification
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature header.")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload.")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature.")
    
    # Handle the checkout.session.completed event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        
        template_id = session.get("metadata", {}).get("templateId")
        customer_email = session.get("customer_details", {}).get("email")
        session_id = session.get("id")
        
        if template_id and customer_email and session_id:
            template = get_template_by_id(template_id)
            
            if template:
                # Store the purchase
                purchase_data = {
                    "sessionId": session_id,
                    "templateId": template_id,
                    "templateName": template["name"],
                    "email": customer_email,
                    "downloadUrl": template.get("downloadUrl", ""),
                    "purchasedAt": datetime.utcnow().isoformat() + "Z",
                    "amountPaid": session.get("amount_total", 0),
                }
                save_purchase(session_id, purchase_data)
                print(f"Purchase recorded: {customer_email} bought {template['name']}")
    
    return {"status": "success"}

@app.get("/api/purchase", response_model=PurchaseResponse)
async def get_purchase_info(session_id: str):
    """Get purchase information by Stripe session ID."""
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required.")
    
    purchase = get_purchase(session_id)
    
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found.")
    
    return PurchaseResponse(
        templateId=purchase["templateId"],
        templateName=purchase["templateName"],
        email=purchase["email"],
        downloadUrl=purchase["downloadUrl"],
        purchasedAt=purchase["purchasedAt"],
    )

@app.get("/api/templates")
async def list_templates():
    """List all available templates."""
    templates = load_templates()
    return {"templates": list(templates.values())}

@app.get("/api/templates/{template_id}")
async def get_template(template_id: str):
    """Get a specific template by ID."""
    template = get_template_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found.")
    return template
