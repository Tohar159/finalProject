# DeepFake Detection – Final Project

מערכת מחקרית לבחינת היכולת של בני אדם לזהות תמונות אמיתיות
לעומת תמונות שנוצרו באמצעות AI, והשוואת הביצועים למודל למידת מכונה.

## Technologies
Frontend: React + Vite
Backend: FastAPI
Database: PostgreSQL
Machine Learning: EfficientNet-B0 (PyTorch)

## Project Structure
frontend/ - קוד ממשק המשתמש והניסוי
backend/ - API, שמירת תשובות וסטטיסטיקות
dataset/ - תמונות ששימשו במערכת

## Running
Frontend:
npm install
npm run dev

Backend:
pip install -r requirements.txt
uvicorn main:app --reload

Database connection requires environment variables that are not included
in the repository.
