from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import Base
from .routers import saldos, calorias, general

app = FastAPI()

# Middleware CORS para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir cualquier origen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(saldos.router)
app.include_router(calorias.router)
app.include_router(general.router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"mensaje": "¡Bienvenido a Lifehub!"}
