# src/infrastructure/database/db_cvd_paef.py

from sqlalchemy import Column, Integer, String, BigInteger, Float, TIMESTAMP, Numeric, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

Base = declarative_base()

class Company(Base):
    __tablename__ = 'tb_cvd_paef_company'
    company_name = Column(String, primary_key=True)
    company_description = Column(String)
    company_seized_amount = Column(Numeric)
    up_time = Column(TIMESTAMP)

class Customer(Base):
    __tablename__ = 'tb_cvd_paef_customer'
    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_name = Column(String)
    customer_document = Column(BigInteger)
    group_name = Column(String)
    company_name = Column(String)
    customer_invested_value = Column(Numeric)
    customer_comproved_invested_brl_value = Column(Numeric)
    customer_comproved_invested_usd_value = Column(Numeric)
    customer_comproved_invested_btc_value = Column(Numeric)
    latest_investment_date = Column(TIMESTAMP)
    up_time = Column(TIMESTAMP)

class CompanyAggregate(Base):
    __tablename__ = 'tb_cvd_paef_company_aggregate'
    id = Column(Integer, primary_key=True, autoincrement=True)
    company_name = Column(String)
    company_seized_amount = Column(Numeric)
    external_customers_invested_value = Column(Numeric)
    internal_customers_invested_value = Column(Numeric)
    contract_count = Column(Integer)
    seized_restitution_ratio = Column(Float)
    up_time = Column(TIMESTAMP)

# Configuração do banco de dados PostgreSQL
DATABASE_URL = os.getenv('DATABASE_URL')

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Cria as tabelas no banco de dados (se ainda não existirem)
Base.metadata.create_all(engine)
