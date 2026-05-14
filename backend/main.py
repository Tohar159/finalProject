from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import SessionLocal
from sqlalchemy import text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Participant(BaseModel):
    age: int
    gender: str
    country: str


class Answer(BaseModel):
    imageId: int
    selected: str
    correct: str
    isCorrect: bool
    reason: str
    confidence: int
    round: int


class AnswersRequest(BaseModel):
    participantId: int
    answers: List[Answer]


@app.get("/")
def home():
    return {"message": "Backend is working"}


@app.get("/images")
def get_images():
    db = SessionLocal()

    result = db.execute(text("""
        SELECT
            image_id AS "imageId",
            image_url AS "imageUrl",
            image_type AS correct,
            category
        FROM images
    """))

    data = result.fetchall()
    db.close()

    return [dict(row._mapping) for row in data]


@app.get("/test-db")
def test_db():
    db = SessionLocal()

    result = db.execute(text("SELECT * FROM images"))
    data = result.fetchall()
    db.close()

    return {"data": [dict(row._mapping) for row in data]}


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
            "country": participant.country,
        }
    )

    participant_id = result.fetchone()[0]

    db.commit()
    db.close()

    return {"participant_id": participant_id}


@app.post("/answers")
def receive_answers(request: AnswersRequest):
    db = SessionLocal()

    for answer in request.answers:
        db.execute(
            text("""
                INSERT INTO answers (
                    participant_id,
                    image_id,
                    selected_answer,
                    correct_answer,
                    is_correct,
                    confidence,
                    round_number
                )
                VALUES (
                    :participant_id,
                    :image_id,
                    :selected_answer,
                    :correct_answer,
                    :is_correct,
                    :confidence,
                    :round_number
                )
            """),
            {
                "participant_id": request.participantId,
                "image_id": answer.imageId,
                "selected_answer": answer.selected,
                "correct_answer": answer.correct,
                "is_correct": answer.isCorrect,
                "confidence": answer.confidence,
                "round_number": answer.round,
            }
        )

    db.commit()
    db.close()

    return {
        "status": "ok",
        "count": len(request.answers)
    }