from fastapi import FastAPI
from .database import engine
from .models import Base
from .routers import saldos, calorias

app = FastAPI()

app.include_router(saldos.router)
app.include_router(calorias.router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"mensaje": "¡Bienvenido a Lifehub!"}
