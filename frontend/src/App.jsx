import { useState } from "react";
import StartScreen from "./components/StartScreen";
import RegistrationForm from "./components/RegistrationForm";
import RoundIntro from "./components/RoundIntro";
import ExperimentScreen from "./components/ExperimentScreen";
import OpenQuestion from "./components/OpenQuestion";
import Questionnaire from "./components/Questionnaire";
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

    function finishRound(roundAnswers) {
        const updatedAnswers = [...allAnswers, ...roundAnswers];
        setAllAnswers(updatedAnswers);

        if (round === 1) {
            setRound(2);
            setScreen("roundIntro");
        } else {
            setScreen("openQuestion");
        }
    }

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
                        localStorage.removeItem("usedImageIds");
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
                <RoundIntro
                    round={round}
                    onNext={startRound}
                />
            )}

            {screen === "experiment" && (
                <ExperimentScreen
                    round={round}
                    participantId={participantId}
                    onFinishRound={finishRound}
                />
            )}

            {screen === "openQuestion" && (
                <OpenQuestion
                    participantId={participantId}
                    answers={allAnswers}
                    onContinue={() => setScreen("questionnaire")}
                />
            )}

            {screen === "questionnaire" && (
                <Questionnaire
                    participantId={participantId}
                    onFinish={() => setScreen("summary")}
                />
            )}

            {screen === "summary" && (
                <SummaryScreen />
            )}
        </>
    );
}

export default App;