import { useState } from "react";
import countryList from "country-list";
import "./RegistrationForm.css";

function RegistrationForm({ onBack, onParticipantCreated }) {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [country, setCountry] = useState("");
    const [education, setEducation] = useState("");
    const [aiUsage, setAiUsage] = useState("");
    const [consent, setConsent] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);

    const countries = [
        "Israel",
        ...countryList.getNames().filter((name) => name !== "Israel").sort()
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

        try {
            const response = await fetch("http://127.0.0.1:8000/participants", {
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
            onParticipantCreated(data.participant_id);
        } catch (err) {
            console.error("Error creating participant:", err);
            alert("There was a problem creating participant.");
        }
    }

    return (
        <div className="registration-page">
            <div className="registration-container">
                <button className="back-link" onClick={onBack}>
                    ← Back
                </button>

                <h2 className="registration-title">Experiment Registration</h2>

                <p className="registration-subtitle">
                    The experiment is anonymous. The details are used only for research purposes.
                </p>


                {showValidationError && !isFormValid && (
                    <p className="validation-error">
                        Please complete all required fields.
                    </p>
                )}

                <div className="registration-form">
                    <div className="form-row">
                        <label>Age</label>
                        <select value={age} onChange={(e) => setAge(e.target.value)}>
                            <option value="">Select age</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55-64">55-64</option>
                            <option value="65+">65+</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="form-row full-width">
                        <label>Country</label>
                        <select value={country} onChange={(e) => setCountry(e.target.value)}>
                            <option value="">Select country</option>
                            {countries.map((countryName) => (
                                <option key={countryName} value={countryName}>
                                    {countryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Education</label>
                        <select value={education} onChange={(e) => setEducation(e.target.value)}>
                            <option value="">Select education</option>
                            <option value="High School">High School</option>
                            <option value="Bachelor's Degree">Bachelor</option>
                            <option value="Master's Degree">Master</option>
                            <option value="Doctorate (PhD)">PhD</option>
                            <option value="No Formal Education">No Formal Education</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label>AI Usage</label>
                        <select value={aiUsage} onChange={(e) => setAiUsage(e.target.value)}>
                            <option value="">Select AI usage</option>
                            <option value="Daily">Daily</option>
                            <option value="Sometimes">Sometimes</option>
                            <option value="Rarely">Rarely</option>
                            <option value="Never">Never</option>
                        </select>
                    </div>
                </div>

                <label className="consent-box">
                    <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>I agree to participate in the experiment</span>
                </label>

                <button
                    className="registration-submit"
                    onClick={handleStart}
                    disabled={!consent}
                >
                    Start Experiment
                </button>
            </div>
        </div>
    );
}

export default RegistrationForm;