import { useState } from "react";
import "./Questionnaire.css";

const questions = [
    "נוטה להיות שקט/ה.",
    "בעל/ת לב רך, מלא/ת חמלה.",
    "נוטה להיות לא מאורגן/ת.",
    "דואג/ת הרבה.",
    "מרותק/ת מאמנות, מוזיקה או ספרות.",
    "דומיננטי/ת, פועל/ת כמנהיג/ה.",
    "נוטה למצוא פגמים באחרים.",
    "מתקשה להתחיל במשימות.",
    "בעל/ת מצבי רוח משתנים, נכנס/ת ויוצא/ת מדיכאון.",
    "בעל/ת מעט עניין במחשבות מופשטות ופילוסופיות.",
    "מלא/ת מרץ ואנרגיה.",
    "נוטה לתת אמון באנשים, מאמין/ה בטוב ליבם של אחרים.",
    "אמין/ה, אפשר לסמוך עליו/ה.",
    "שומר/ת על קור רוח גם במצבי לחץ.",
    "בעל/ת דמיון עשיר.",
    "ביישן/ית, חסר/ת ביטחון חברתי.",
    "מועיל/ה ומתחשב/ת באחרים.",
    "שומר/ת על דברים נקיים ומסודרים.",
    "מרגיש/ה מתוח/ה לעיתים קרובות.",
    "בעל/ת עניין מועט בנושאים אמנותיים.",
    "דעתן/ית, לא חושש/ת להביע את דעתי.",
    "יכול/ה להיות קר/ה ולא מתחשב/ת.",
    "משאיר/ה דברים עד לרגע האחרון.",
    "נשאר/ת אופטימי/ת גם כשדברים משתבשים.",
    "בעל/ת מחשבות מקוריות, מביא/ה רעיונות חדשים.",
    "חברותי/ת, מוחצן/ת.",
    "סלחן/ית מטבעי.",
    "עובד/ת ביסודיות.",
    "חווה רגשות חזקים.",
    "מעריך/ה חוויות אינטלקטואליות מורכבות."
];

function Questionnaire({ participantId, onFinish }) {

    const QUESTIONS_PER_PAGE = 5;

    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState({});

    const start = page * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;

    const currentQuestions = questions.slice(start, end);

    function handleChange(questionNumber, value) {
        setAnswers({
            ...answers,
            [questionNumber]: Number(value)
        });
    }

    async function handleNext() {

        const pageAnswers = [];

        for (let i = start; i < end; i++) {

            if (!answers[i + 1]) {
                alert("יש לענות על כל השאלות לפני שממשיכים");
                return;
            }

            pageAnswers.push({
                participant_id: participantId,
                question_number: i + 1,
                answer: answers[i + 1]
            });
        }

        try {

            const response = await fetch(
                "https://deepfake-backend-ki3i.onrender.com/personality",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        answers: pageAnswers,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save personality answers");
            }

        } catch (error) {

            console.error(error);

            alert("אירעה שגיאה בשמירת התשובות.");

            return;

        }

        if (page === Math.ceil(questions.length / QUESTIONS_PER_PAGE) - 1) {
            onFinish();
        } else {
            setPage(page + 1);
        }
    }

    return (

        <div className="questionnaire-page">

            <div className="questionnaire-card">

                <h1 className="questionnaire-title">
                    שאלון מסכם
                </h1>

                <p className="questionnaire-description">
                    בחלק זה תתבקשו לענות על מספר היגדים המתארים תכונות והתנהגויות שונות.
                    <br />
                    אנא סמנו את מידת ההסכמה שלכם עם כל אחד מההיגדים.
                    <br />
                    אין תשובות נכונות או לא נכונות.
                </p>

                <div className="progress-info">

    <span>
        שאלות {start + 1}–{Math.min(end, questions.length)}
    </span>

                    <span>
        עמוד {page + 1} מתוך {Math.ceil(questions.length / QUESTIONS_PER_PAGE)}
    </span>

                </div>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${((page + 1) / Math.ceil(questions.length / QUESTIONS_PER_PAGE)) * 100}%`
                        }}
                    />

                </div>

                <div className="scale-title">
                    עד כמה אתם מסכימים עם כל אחד מההיגדים?
                </div>

                <div className="scale-guide">

                    <div className="scale-end">

        <span className="scale-number">
            1
        </span>

                        <span className="scale-text">
            לא מסכים בכלל
        </span>

                    </div>

                    <div className="scale-end">

        <span className="scale-number">
            5
        </span>

                        <span className="scale-text">
            מסכים בהחלט
        </span>

                    </div>

                </div>

                <div className="scale-divider"></div>
                {currentQuestions.map((question, index) => {

                    const questionNumber = start + index + 1;

                    return (

                        <div
                            key={questionNumber}
                            className="question-card"
                        >

                            <div className="question-text">

                                {questionNumber}. {question}

                            </div>

                            <div className="answers-row">

                                {[1,2,3,4,5].map((value)=>(
                                    <label
                                        key={value}
                                        className={`answer-option ${
                                            answers[questionNumber] === value ? "selected" : ""
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name={`question-${questionNumber}`}
                                            value={value}
                                            checked={answers[questionNumber] === value}
                                            onChange={(e) =>
                                                handleChange(questionNumber, e.target.value)
                                            }
                                        />

                                        <span className="answer-circle">
        {value}
    </span>

                                    </label>
                                ))}

                            </div>

                        </div>

                    )

                })}

                <div className="questionnaire-buttons">

                    <button
                        className="secondary-btn"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                    >
                        חזור
                    </button>

                    <button
                        className="primary-btn"
                        onClick={handleNext}
                    >
                        {page === Math.ceil(questions.length / QUESTIONS_PER_PAGE) - 1
                            ? "סיום השאלון"
                            : "המשך"}
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Questionnaire;