from sqlalchemy import Column, Integer, String, Float
from db import Base


# ================= PRODUCT TABLE =================

class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    price = Column(Float, nullable=False)

    stock_quantity = Column(Integer)


# ================= CUSTOMER TABLE =================

class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    email = Column(String)

    phone = Column(String)


# ================= SERVICE TABLE =================

class Service(Base):

    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)

    service_name = Column(String)

    amount = Column(Integer)


# ================= USER TABLE =================

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True)

    password = Column(String)


# ================= SALES TABLE =================

class Sale(Base):

    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String)
    product_name = Column(String)

    quantity = Column(Integer)

    price = Column(Float)
    subtotal = Column(Float)
    gst = Column(Float)
    total = Column(Float)

    date = Column(String)