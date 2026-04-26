from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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