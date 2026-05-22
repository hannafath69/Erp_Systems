from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from db import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# Pydantic Models
# =========================

class ProductCreate(BaseModel):
    name: str
    price: int
    stock_quantity: int

class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str

class ServiceCreate(BaseModel):
    service_name: str
    amount: int

class UserCreate(BaseModel):
    email: str
    password: str

class SaleCreate(BaseModel):
    customer_name: str
    product_name: str
    quantity: int
    price: float
    subtotal: float
    gst: float
    total: float
    date: str

# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {"message": "SmartERP Backend Running"}

# =========================
# PRODUCT APIs
# =========================
# ================= PRODUCTS API =================

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.post("/products")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):

    new_product = models.Product(
        name=product.name,
        price=product.price,
        stock_quantity=product.stock_quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {
        "message": "Product Added Successfully"
    }
    

@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not existing_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_product.name = product.name
    existing_product.price = product.price
    existing_product.stock_quantity = product.stock_quantity

    db.commit()
    return {
        "message": "Product Updated Successfully"
    }
    


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product Deleted Successfully"
    }

# =========================
# CUSTOMER APIs
# =========================

# GET ALL CUSTOMERS
@app.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

# ADD CUSTOMER
@app.post("/customers")
def add_customer(customer: CustomerCreate, db: Session = Depends(get_db)):

    new_customer = models.Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)
    db.commit()

    return {"message": "Customer Added"}

# UPDATE CUSTOMER
@app.put("/customers/{customer_id}")
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if not existing_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    existing_customer.name = customer.name
    existing_customer.email = customer.email
    existing_customer.phone = customer.phone

    db.commit()

    return {"message": "Customer Updated"}

# DELETE CUSTOMER
@app.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {"message": "Customer Deleted"}

# =========================
# SERVICE APIs
# =========================

@app.get("/services")
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@app.post("/services")
def add_service(service: ServiceCreate, db: Session = Depends(get_db)):

    new_service = models.Service(
        service_name=service.service_name,
        amount=service.amount
    )

    db.add(new_service)
    db.commit()

    return {"message": "Service Added"}

# =========================
# AUTHENTICATION
# =========================

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email,
        models.User.password == user.password
    ).first()

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return {
        "message": "Login Successful",
        "user": existing_user.email
    }



# ================= SALES SCHEMA =================
# ================= SALES =================
@app.post("/sales")
def add_sale(sale: SaleCreate, db: Session = Depends(get_db)):

    product = db.query(models.Product).filter(
        models.Product.name == sale.product_name
    ).first()

    if not product:
        return {"message": "Product not found"}

    if product.stock_quantity < sale.quantity:
        return {"message": "Not enough stock"}

    new_sale = models.Sale(
        customer_name=sale.customer_name,
        product_name=sale.product_name,
        quantity=sale.quantity,
        price=sale.price,
        subtotal=sale.subtotal,
        gst=sale.gst,
        total=sale.total,
        date=sale.date
    )

    db.add(new_sale)

    product.stock_quantity -= sale.quantity

    db.commit()

    db.refresh(new_sale)

    return new_sale


@app.get("/sales")
def get_sales(db: Session = Depends(get_db)):

    return db.query(models.Sale).all()