import { useState } from "react";
import StartScreen from "./components/StartScreen";
import RegistrationForm from "./components/RegistrationForm";
import RoundIntro from "./components/RoundIntro";
import ExperimentScreen from "./components/ExperimentScreen";
import SummaryScreen from "./components/SummaryScreen";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
    const [screen, setScreen] = useState("start");
    const [round, setRound] = useState(1);
    const [allAnswers, setAllAnswers] = useState([]);
    const [participantId, setParticipantId] = useState(null);

    function startRound() {
        setScreen("experiment");
    }

    function sendAnswersToServer(answers) {
        console.log("participantId:", participantId);
        console.log("answers sent:", answers);
        fetch("http://127.0.0.1:8000/answers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                participantId: participantId,
                answers: answers,
            }),
        })
            .then((res) => res.json())
            .then((data) => console.log("Server response:", data))
            .catch((error) => console.error("Error sending answers:", error));
    }

    function finishRound(roundAnswers) {
        const updatedAnswers = [...allAnswers, ...roundAnswers];
        setAllAnswers(updatedAnswers);

        if (round === 1) {
            setRound(2);
            setScreen("roundIntro");
        } else {
            sendAnswersToServer(updatedAnswers);
            setScreen("summary");
        }
    }

    //מערך דמה
    const mockAnswers = [
        { round: 1, isCorrect: true },
        { round: 1, isCorrect: true },
        { round: 1, isCorrect: false },
        { round: 1, isCorrect: true },
        { round: 2, isCorrect: true },
        { round: 2, isCorrect: false },
        { round: 2, isCorrect: true },
        { round: 2, isCorrect: true },
    ];
    return (
        <>
            {screen === "start" && (
                <StartScreen
                    onContinue={() => setScreen("form")}
                    onAdminClick={() => setScreen("adminLogin")}
                />
            )}

            {screen === "form" && (
                <RegistrationForm
                    onBack={() => setScreen("start")}
                    onParticipantCreated={(id) => {
                        setParticipantId(id);
                        setRound(1);
                        setAllAnswers([]);
                        setScreen("roundIntro");
                    }}
                />
            )}

            {screen === "adminLogin" && (
                <AdminLogin
                    onLoginSuccess={() => setScreen("adminDashboard")}
                    onBack={() => setScreen("start")}
                />
            )}

            {screen === "adminDashboard" && (
                <AdminDashboard onLogout={() => setScreen("start")} />
            )}

            {screen === "roundIntro" && (
                <RoundIntro round={round} onNext={startRound} />
            )}

            {screen === "experiment" && (
                <ExperimentScreen round={round} onFinishRound={finishRound} />
            )}

            {screen === "summary" && <SummaryScreen answers={allAnswers} />}
        </>
    );
}

export default App;

