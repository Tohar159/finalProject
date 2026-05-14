import { useState } from "react";

function RegistrationForm({ onBack, onParticipantCreated }) {

    const [age, setAge] = useState("18-21");
    const [gender, setGender] = useState("Male");
    const [country, setCountry] = useState("");

    function handleStart() {

        fetch("http://127.0.0.1:8000/participants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                age: 18,
                gender: gender,
                country: country,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Participant created:", data);
                onParticipantCreated(data.participant_id);
            })
            .catch((err) => {
                console.error("Error creating participant:", err);
            });
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Experiment Registration</h2>

            <p>
                The experiment is anonymous. The details are used only for research purposes.
            </p>

            <div style={{ marginTop: "20px" }}>

                <div>
                    <label>Age:</label><br />

                    <select
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    >
                        <option>18-21</option>
                        <option>22-25</option>
                        <option>26-30</option>
                    </select>
                </div>

                <div>
                    <label>Gender:</label><br />

                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>

                <div>
                    <label>Country:</label><br />

                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>

                <div>
                    <label>Education:</label><br />

                    <select>
                        <option>High School</option>
                        <option>Bachelor</option>
                        <option>Master</option>
                    </select>
                </div>

                <div>
                    <label>AI Usage:</label><br />

                    <select>
                        <option>Daily</option>
                        <option>Sometimes</option>
                        <option>Rarely</option>
                    </select>
                </div>

                <div style={{ marginTop: "10px" }}>
                    <input type="checkbox" /> I agree to participate
                </div>

            </div>

            <button
                style={{ marginTop: "20px" }}
                onClick={handleStart}
            >
                Start Experiment
            </button>

            <br /><br />

            <button onClick={onBack}>
                Back
            </button>
        </div>
    );
}

export default RegistrationForm;