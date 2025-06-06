# Aquí irán los modelos de SQLAlchemy 
from sqlalchemy import Column, Integer, Date, DECIMAL
from .database import Base

class SaldoBancario(Base):
    __tablename__ = "saldos_bancarios"
    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False, unique=True)
    monto = Column(DECIMAL(10, 3), nullable=False)

class Caloria(Base):
    __tablename__ = "calorias"
    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False, unique=True)
    calorias = Column(Integer, nullable=False) 