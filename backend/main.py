from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import SessionLocal
from sqlalchemy import text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Answer(BaseModel):
    imageId: int
    selected: str
    correct: str
    isCorrect: bool
    reason: str
    confidence: int
    round: int

@app.get("/")
def home():
    return {"message": "Backend is working"}

@app.post("/answers")
def receive_answers(answers: List[Answer]):
    print("Received answers:", answers)
    return {
        "status": "ok",
        "count": len(answers)
    }
@app.get("/test-db")
def test_db():
    db = SessionLocal()
    result = db.execute(text("SELECT * FROM images"))
    data = result.fetchall()
    db.close()
    return {"data": [dict(row._mapping) for row in data]}

@app.get("/images")
def get_images():
    db = SessionLocal()
    result = db.execute(text("SELECT * FROM images"))
    data = result.fetchall()
    db.close()
    return [dict(row._mapping) for row in data]

class Participant(BaseModel):
    age: int
    gender: str
    country: str

@app.post("/participants")
def create_participant(participant: Participant):
    db = SessionLocal()

    result = db.execute(
        text("""
            INSERT INTO participants (age, gender, country)
            VALUES (:age, :gender, :country)
            RETURNING participant_id
        """),
        {
            "age": participant.age,
            "gender": participant.gender,
            "country": participant.country
        }
    )

    participant_id = result.fetchone()[0]
    db.commit()
    db.close()

    return {"participant_id": participant_id}