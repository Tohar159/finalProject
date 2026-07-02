import "./SummaryScreen.css";

function SummaryScreen() {

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.origin);
            alert("קישור הניסוי הועתק ללוח.");
        } catch (error) {
            alert("לא ניתן היה להעתיק את הקישור.");
        }
    };

    return (
        <div className="summary-page">

            <div className="summary-content">

                <h1 className="summary-title">
                    תודה רבה על השתתפותכם!
                </h1>

                <p className="summary-description">
                    השתתפותכם חשובה ותורמת לקידום המחקר בנושא זיהוי תמונות
                    שנוצרו באמצעות בינה מלאכותית
                </p>

                <p className="summary-description">
                    אם נהניתם מהניסוי, נשמח אם תשתפו אותו עם חברים או בני משפחה

                </p>

                <button
                    className="primary-btn"
                    onClick={copyLink}
                >
                    📋 העתק קישור לניסוי
                </button>

            </div>

        </div>
    );
}

export default SummaryScreen;