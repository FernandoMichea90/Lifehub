# Aquí irán los esquemas de Pydantic 
from pydantic import BaseModel
from datetime import date

class SaldoBancarioBase(BaseModel):
    fecha: date
    monto: float

class SaldoBancarioCreate(SaldoBancarioBase):
    pass

class SaldoBancarioOut(SaldoBancarioBase):
    id: int
    class Config:
        orm_mode = True

class CaloriaBase(BaseModel):
    fecha: date
    calorias: int

class CaloriaCreate(CaloriaBase):
    pass

class CaloriaOut(CaloriaBase):
    id: int
    class Config:
        orm_mode = True 