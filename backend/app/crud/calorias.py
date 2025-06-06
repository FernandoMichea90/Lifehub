from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy.exc import IntegrityError

def get_calorias(db: Session):
    return db.query(models.Caloria).order_by(models.Caloria.fecha).all()

def get_caloria_by_fecha(db: Session, fecha):
    return db.query(models.Caloria).filter(models.Caloria.fecha == fecha).first()

def create_caloria(db: Session, caloria: schemas.CaloriaCreate):
    db_caloria = models.Caloria(**caloria.dict())
    db.add(db_caloria)
    try:
        db.commit()
        db.refresh(db_caloria)
        return db_caloria
    except IntegrityError:
        db.rollback()
        return None

def update_caloria(db: Session, fecha, caloria: schemas.CaloriaCreate):
    db_caloria = get_caloria_by_fecha(db, fecha)
    if db_caloria:
        db_caloria.calorias = caloria.calorias
        db.commit()
        db.refresh(db_caloria)
    return db_caloria

def delete_caloria(db: Session, fecha):
    db_caloria = get_caloria_by_fecha(db, fecha)
    if db_caloria:
        db.delete(db_caloria)
        db.commit()
    return db_caloria 