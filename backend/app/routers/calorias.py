# Aquí irán los endpoints de calorías 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import CaloriaCreate, CaloriaOut
from app.crud.calorias import (
    get_calorias, get_caloria_by_fecha, create_caloria, update_caloria, delete_caloria
)
from app.database import SessionLocal
from typing import List

router = APIRouter(prefix="/calorias", tags=["Calorías"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[CaloriaOut])
def listar_calorias(db: Session = Depends(get_db)):
    return get_calorias(db)

@router.get("/{fecha}", response_model=CaloriaOut)
def obtener_caloria(fecha: str, db: Session = Depends(get_db)):
    caloria = get_caloria_by_fecha(db, fecha)
    if not caloria:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return caloria

@router.post("/", response_model=CaloriaOut)
def crear_caloria(caloria: CaloriaCreate, db: Session = Depends(get_db)):
    db_caloria = create_caloria(db, caloria)
    if not db_caloria:
        raise HTTPException(status_code=400, detail="Ya existe un registro para esa fecha")
    return db_caloria

@router.put("/{fecha}", response_model=CaloriaOut)
def actualizar_caloria(fecha: str, caloria: CaloriaCreate, db: Session = Depends(get_db)):
    db_caloria = update_caloria(db, fecha, caloria)
    if not db_caloria:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return db_caloria

@router.delete("/{fecha}", response_model=CaloriaOut)
def eliminar_caloria(fecha: str, db: Session = Depends(get_db)):
    db_caloria = delete_caloria(db, fecha)
    if not db_caloria:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return db_caloria 