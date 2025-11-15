from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

def get_saldos(db: Session):
    return db.query(models.SaldoBancario).order_by(models.SaldoBancario.fecha).all()

def get_saldos_desc(db: Session):
    return db.query(models.SaldoBancario).order_by(models.SaldoBancario.fecha.desc()).all()

def get_saldo_by_fecha(db: Session, fecha):
    return db.query(models.SaldoBancario).filter(models.SaldoBancario.fecha == fecha).first()

def create_saldo(db: Session, saldo: schemas.SaldoBancarioCreate):
    db_saldo = models.SaldoBancario(**saldo.dict())
    db.add(db_saldo)
    try:
        db.commit()
        db.refresh(db_saldo)
        return db_saldo
    except IntegrityError:
        db.rollback()
        return None

def update_saldo(db: Session, fecha, saldo: schemas.SaldoBancarioCreate):
    db_saldo = get_saldo_by_fecha(db, fecha)
    if db_saldo:
        db_saldo.monto = saldo.monto
        db.commit()
        db.refresh(db_saldo)
    return db_saldo

def delete_saldo(db: Session, fecha):
    db_saldo = get_saldo_by_fecha(db, fecha)
    if db_saldo:
        db.delete(db_saldo)
        db.commit()
    return db_saldo

def get_promedio_saldos(db: Session):
    return db.query(func.avg(models.SaldoBancario.monto)).scalar() or 0

def get_ultimo_registro_saldos(db: Session):
    return db.query(models.SaldoBancario).order_by(models.SaldoBancario.fecha.desc()).first() 