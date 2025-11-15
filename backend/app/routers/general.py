from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.crud import calorias, saldos

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/resumen")
def get_dashboard_resumen(db: Session = Depends(get_db)):
    # Obtener datos de calorías
    promedio_calorias = calorias.get_promedio_calorias(db)
    ultimo_registro_calorias = calorias.get_ultimo_registro_calorias(db)
    
    # Obtener datos de saldos
    promedio_saldos = saldos.get_promedio_saldos(db)
    ultimo_registro_saldos = saldos.get_ultimo_registro_saldos(db)
    
    return {
        "calorias": {
            "promedio": round(float(promedio_calorias), 2),
            "ultimo_registro": {
                "fecha": ultimo_registro_calorias.fecha if ultimo_registro_calorias else None,
                "calorias": ultimo_registro_calorias.calorias if ultimo_registro_calorias else None
            }
        },
        "saldos": {
            "promedio": round(float(promedio_saldos), 2),
            "ultimo_registro": {
                "fecha": ultimo_registro_saldos.fecha if ultimo_registro_saldos else None,
                "monto": ultimo_registro_saldos.monto if ultimo_registro_saldos else None
            }
        }
    }

