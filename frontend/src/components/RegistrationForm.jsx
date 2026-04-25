function RegistrationForm({ onBack, onStart }) {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Experiment Registration</h2>

            <p>
                The experiment is anonymous. The details are used only for research purposes.
            </p>

            <div style={{ marginTop: "20px" }}>

                <div>
                    <label>Age:</label><br />
                    <select>
                        <option>18-21</option>
                        <option>22-25</option>
                        <option>26-30</option>
                    </select>
                </div>

                <div>
                    <label>Gender:</label><br />
                    <select>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>

                <div>
                    <label>Country:</label><br />
                    <input type="text" />
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

            <button style={{ marginTop: "20px" }} onClick={onStart}>
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