from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import SessionLocal, engine
from sqlalchemy import text
from fastapi.staticfiles import StaticFiles

app = FastAPI()

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR.parent / "dataset"

if DATASET_DIR.exists():
    app.mount("/dataset", StaticFiles(directory=str(DATASET_DIR)), name="dataset")

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

class ParticipantCreate(BaseModel):
    age: str | None = None
    gender: str | None = None
    country: str | None = None
    education: str | None = None
    aiUsage: str | None = None
    consent: bool | None = None


@app.post("/participants")
def create_participant(participant: ParticipantCreate):
    with engine.connect() as conn:
        result = conn.execute(text("""
            INSERT INTO participants (age, gender, country, education, ai_usage, consent)
            VALUES (:age, :gender, :country, :education, :ai_usage, :consent)
            RETURNING participant_id
         """), {
            "age": participant.age,
            "gender": participant.gender,
            "country": participant.country,
            "education": participant.education,
            "ai_usage": participant.aiUsage,
            "consent": participant.consent
        })

        participant_id = result.fetchone().participant_id
        conn.commit()

        return {"participant_id": participant_id}

@app.get("/images/random")
def get_random_images(exclude: str = ""):

    exclude_ids = []

    if exclude:
        exclude_ids = [
            int(x)
            for x in exclude.split(",")
            if x.strip().isdigit()
        ]

    images = []

    with engine.connect() as conn:

        categories = [
            ("peoples", 3),
            ("animals", 3),
            ("views", 2),
            ("flowers", 2)
        ]

        fake_needed = 5
        real_needed = 5

        for category, amount in categories:

            fake_amount = round(amount / 2)
            real_amount = amount - fake_amount

            fake_result = conn.execute(text("""
                SELECT image_id, image_path, category, image_type
                FROM images
                WHERE category = :category
                AND image_type = 'fake'
                AND image_id NOT IN :exclude_ids
                ORDER BY RANDOM()
                LIMIT :amount
            """), {
                "category": category,
                "exclude_ids": tuple(exclude_ids) if exclude_ids else (-1,),
                "amount": fake_amount
            })

            real_result = conn.execute(text("""
                SELECT image_id, image_path, category, image_type
                FROM images
                WHERE category = :category
                AND image_type = 'real'
                AND image_id NOT IN :exclude_ids
                ORDER BY RANDOM()
                LIMIT :amount
            """), {
                "category": category,
                "exclude_ids": tuple(exclude_ids) if exclude_ids else (-1,),
                "amount": real_amount
            })

            for row in fake_result:
                images.append({
                    "image_id": row.image_id,
                    "image_path": row.image_path,
                    "category": row.category,
                    "image_type": row.image_type
                })

            for row in real_result:
                images.append({
                    "image_id": row.image_id,
                    "image_path": row.image_path,
                    "category": row.category,
                    "image_type": row.image_type
                })

    import random
    random.shuffle(images)

    return images

class UserAnswer(BaseModel):
    participantId: int
    imageId: int
    selected: str
    reason: str
    confidence: int
    round: int
    responseTimeSeconds: float


@app.post("/answers/check")
def check_answer(answer: UserAnswer):
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT image_type
            FROM images
            WHERE image_id = :image_id
        """), {"image_id": answer.imageId}).fetchone()

        if result is None:
            return {"error": "Image not found"}

        correct_answer = result.image_type
        is_correct = answer.selected == correct_answer

        conn.execute(text("""
            INSERT INTO answers
            (
                participant_id,
                image_id,
                selected_answer,
                correct_answer,
                is_correct,
                confidence,
                reason,
                round_number,
                response_time_seconds
            )
            VALUES
            (
                :participant_id,
                :image_id,
                :selected_answer,
                :correct_answer,
                :is_correct,
                :confidence,
                :reason,
                :round_number,
                :response_time_seconds
            )
        """), {
            "participant_id": answer.participantId,
            "image_id": answer.imageId,
            "selected_answer": answer.selected,
            "correct_answer": correct_answer,
            "is_correct": is_correct,
            "confidence": answer.confidence,
            "reason": answer.reason,
            "round_number": answer.round,
            "response_time_seconds": answer.responseTimeSeconds
        })

        conn.commit()

        return {
            "imageId": answer.imageId,
            "selected": answer.selected,
            "correct": correct_answer,
            "isCorrect": is_correct,
            "reason": answer.reason,
            "confidence": answer.confidence,
            "round": answer.round
        }


@app.get("/test-db")
def test_db():
    db = SessionLocal()

    result = db.execute(text("SELECT * FROM images"))
    data = result.fetchall()
    db.close()

    return {"data": [dict(row._mapping) for row in data]}


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

@app.get("/admin/stats")
def get_admin_stats():
    with engine.connect() as conn:
        participants_count = conn.execute(text("""
            SELECT COUNT(*) FROM participants
        """)).scalar()

        answers_count = conn.execute(text("""
            SELECT COUNT(*) FROM answers
        """)).scalar()

        result = conn.execute(text("""
            SELECT 
                ROUND(AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100, 2) AS accuracy,
                ROUND(AVG(confidence), 2) AS avg_confidence,
                ROUND(AVG(response_time_seconds), 2) AS avg_response_time
            FROM answers
        """)).fetchone()

        accuracy_by_round = conn.execute(text("""
            SELECT 
                round_number,
                ROUND(AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100, 2) AS accuracy
            FROM answers
            GROUP BY round_number
            ORDER BY round_number
        """)).fetchall()

    return {
        "participants_count": participants_count,
        "answers_count": answers_count,
        "accuracy": float(result.accuracy) if result.accuracy is not None else 0,
        "avg_confidence": float(result.avg_confidence) if result.avg_confidence is not None else 0,
        "avg_response_time": float(result.avg_response_time) if result.avg_response_time is not None else 0,
        "accuracy_by_round": [
            {
                "round": row.round_number,
                "accuracy": float(row.accuracy)
            }
            for row in accuracy_by_round
        ]
    }