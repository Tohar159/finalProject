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
    confidence: int
    round: int


class AnswersRequest(BaseModel):
    participantId: int
    answers: List[Answer]

class OpenFeedback(BaseModel):
    participant_id: int
    feedback_text: str

class PersonalityAnswer(BaseModel):
    participant_id: int
    question_number: int
    answer: int


class PersonalityAnswersRequest(BaseModel):
    answers: List[PersonalityAnswer]


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
            ("peoples", 2, 1),  # 2 fake, 1 real
            ("animals", 1, 2),  # 1 fake, 2 real
            ("views", 1, 1),
            ("flowers", 1, 1)
        ]

        for category, fake_amount, real_amount in categories:

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
                })

            for row in real_result:
                images.append({
                    "image_id": row.image_id,
                    "image_path": row.image_path,
                    "category": row.category,
                })

    import random
    random.shuffle(images)

    return images

class UserAnswer(BaseModel):
    participantId: int
    imageId: int
    selected: str
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
            "round_number": answer.round,
            "response_time_seconds": answer.responseTimeSeconds
        })

        conn.commit()

        return {
            "imageId": answer.imageId,
            "selected": answer.selected,
            "correct": correct_answer,
            "isCorrect": is_correct,
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

@app.post("/open-feedback")
def save_open_feedback(feedback: OpenFeedback):

    with engine.connect() as conn:

        conn.execute(
            text("""
                INSERT INTO open_feedback
                (
                    participant_id,
                    feedback_text
                )
                VALUES
                (
                    :participant_id,
                    :feedback_text
                )
            """),
            {
                "participant_id": feedback.participant_id,
                "feedback_text": feedback.feedback_text
            }
        )

        conn.commit()

    return {
        "message": "Feedback saved successfully"
    }

@app.post("/personality")
def save_personality_answers(request: PersonalityAnswersRequest):

    with engine.connect() as conn:

        for answer in request.answers:

            conn.execute(
                text("""
                    INSERT INTO personality_answers
                    (
                        participant_id,
                        question_number,
                        answer
                    )
                    VALUES
                    (
                        :participant_id,
                        :question_number,
                        :answer
                    )
                """),
                {
                    "participant_id": answer.participant_id,
                    "question_number": answer.question_number,
                    "answer": answer.answer
                }
            )

        conn.commit()

    return {
        "message": "Personality answers saved successfully"
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

        model_accuracy = conn.execute(text("""
            SELECT
                ROUND(AVG(CASE WHEN model_correct THEN 1 ELSE 0 END) * 100, 2)
            FROM images
        """)).scalar()

    return {
        "participants_count": participants_count,
        "answers_count": answers_count,
        "accuracy": float(result.accuracy) if result.accuracy is not None else 0,
        "avg_confidence": float(result.avg_confidence) if result.avg_confidence is not None else 0,
        "avg_response_time": float(result.avg_response_time) if result.avg_response_time is not None else 0,
        "model_accuracy": float(model_accuracy) if model_accuracy is not None else 0,
        "accuracy_by_round": [
            {
                "round": row.round_number,
                "accuracy": float(row.accuracy)
            }
            for row in accuracy_by_round
        ]
    }