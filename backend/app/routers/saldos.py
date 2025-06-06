# Aquí irán los endpoints de saldos bancarios 

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import SaldoBancarioCreate, SaldoBancarioOut
from app.crud.saldos import (
    get_saldos, get_saldo_by_fecha, create_saldo, update_saldo, delete_saldo
)
from app.database import SessionLocal
from typing import List

router = APIRouter(prefix="/saldos", tags=["Saldos Bancarios"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[SaldoBancarioOut])
def listar_saldos(db: Session = Depends(get_db)):
    return get_saldos(db)

@router.get("/{fecha}", response_model=SaldoBancarioOut)
def obtener_saldo(fecha: str, db: Session = Depends(get_db)):
    saldo = get_saldo_by_fecha(db, fecha)
    if not saldo:
        raise HTTPException(status_code=404, detail="Saldo no encontrado")
    return saldo

@router.post("/", response_model=SaldoBancarioOut)
def crear_saldo(saldo: SaldoBancarioCreate, db: Session = Depends(get_db)):
    db_saldo = create_saldo(db, saldo)
    if not db_saldo:
        raise HTTPException(status_code=400, detail="Ya existe un saldo para esa fecha")
    return db_saldo

@router.put("/{fecha}", response_model=SaldoBancarioOut)
def actualizar_saldo(fecha: str, saldo: SaldoBancarioCreate, db: Session = Depends(get_db)):
    db_saldo = update_saldo(db, fecha, saldo)
    if not db_saldo:
        raise HTTPException(status_code=404, detail="Saldo no encontrado")
    return db_saldo

@router.delete("/{fecha}", response_model=SaldoBancarioOut)
def eliminar_saldo(fecha: str, db: Session = Depends(get_db)):
    db_saldo = delete_saldo(db, fecha)
    if not db_saldo:
        raise HTTPException(status_code=404, detail="Saldo no encontrado")
    return db_saldo 