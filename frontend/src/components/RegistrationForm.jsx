import { useState } from "react";
import "./RegistrationForm.css";

function RegistrationForm({ onBack, onParticipantCreated }) {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [country, setCountry] = useState("");
    const [education, setEducation] = useState("");
    const [aiUsage, setAiUsage] = useState("");
    const [consent, setConsent] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const countries = [
        { value: "Argentina", label: "ארגנטינה" },
        { value: "United States", label: "ארצות הברית" },
        { value: "Australia", label: "אוסטרליה" },
        { value: "Italy", label: "איטליה" },
        { value: "Other", label: "אחר" },
        { value: "United Kingdom", label: "בריטניה" },
        { value: "Brazil", label: "ברזיל" },
        { value: "Germany", label: "גרמניה" },
        { value: "Netherlands", label: "הולנד" },
        { value: "India", label: "הודו" },
        { value: "Thailand", label: "תאילנד" },
        { value: "Turkey", label: "טורקיה" },
        { value: "Japan", label: "יפן" },
        { value: "Israel", label: "ישראל⭐" },
        { value: "Canada", label: "קנדה" },
        { value: "Mexico", label: "מקסיקו" },
        { value: "China", label: "סין" },
        { value: "Spain", label: "ספרד" },
        { value: "Sweden", label: "שוודיה" },
        { value: "France", label: "צרפת" },
        { value: "South Africa", label: "דרום אפריקה" },
        { value: "Other", label: "אחר" }
    ];

    const isFormValid =
        age !== "" &&
        gender !== "" &&
        country.trim() !== "" &&
        education !== "" &&
        aiUsage !== "";

    async function handleStart() {
        if (!isFormValid) {
            setShowValidationError(true);
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await fetch("https://deepfake-backend-ki3i.onrender.com/participants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    age,
                    gender,
                    country,
                    education,
                    aiUsage,
                    consent,
                }),
            });

            const data = await response.json();
            console.log("created participant:", data);
            onParticipantCreated(data.participant_id);

        } catch (err) {
            console.error("Error creating participant:", err);
            alert("There was a problem creating participant.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="registration-page">
            <div className="registration-container">
                <button className="back-link" onClick={onBack}>
                    → חזרה
                </button>

                <h2 className="registration-title">טופס הרשמה לניסוי</h2>

                <p className="registration-subtitle">
                     המידע שתמסרו ישמש לצורכי מחקר בלבד ויישמר באופן אנונימי
                </p>


                {showValidationError && !isFormValid && (
                    <p className="validation-error">
                        *אנא מלאו את כל השדות הנדרשים
                    </p>
                )}

                <div className="registration-form">
                    <div className="form-row">
                        <label>גיל</label>
                        <select value={age} onChange={(e) => setAge(e.target.value)}>
                            <option value="">בחרו טווח גילאים</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55-64">55-64</option>
                            <option value="65+">65+</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label>מגדר</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">בחרו מגדר</option>
                            <option value="Male">זכר</option>
                            <option value="Female">נקבה</option>
                        </select>
                    </div>

                    <div className="form-row full-width">
                        <label>מדינת מגורים</label>
                        <select value={country} onChange={(e) => setCountry(e.target.value)}>
                            <option value="">בחרו מדינה</option>
                            {countries.map((country) => (
                                <option key={country.value} value={country.value}>
                                    {country.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>השכלה</label>
                        <select value={education} onChange={(e) => setEducation(e.target.value)}>
                            <option value="">בחרו רמת השכלה</option>
                            <option value="High School">תיכון</option>
                            <option value="Bachelor's Degree">תואר ראשון</option>
                            <option value="Master's Degree">תואר שני</option>
                            <option value="Doctorate (PhD)">דוקטורט</option>
                            <option value="No Formal Education">ללא השכלה פורמלית</option>
                            <option value="Other">אחר</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label>שימוש בכלי בינה מלאכותית</label>
                        <select value={aiUsage} onChange={(e) => setAiUsage(e.target.value)}>
                            <option value="">בחרו תדירות שימוש</option>
                            <option value="Daily">כל יום</option>
                            <option value="Sometimes">מספר פעמים בשבוע</option>
                            <option value="Rarely">לעיתים רחוקות</option>
                            <option value="Never">אף פעם</option>
                        </select>
                    </div>
                </div>

                <label className="consent-box">
                    <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>אני מסכים/ה להשתתף בניסוי</span>
                </label>

                <button
                    className="registration-submit"
                    onClick={handleStart}
                    disabled={!consent || isSubmitting}
                >
                    {isSubmitting ? "טוען..." : "התחל בניסוי"}
                </button>

                {isSubmitting && (
                    <p className="loading-note">
                        אנא המתינו בזמן שהניסוי נטען
                    </p>
                )}
            </div>
        </div>
    );
}

export default RegistrationForm;