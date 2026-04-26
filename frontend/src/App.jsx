import { useState } from "react";
import StartScreen from "./components/StartScreen";
import RegistrationForm from "./components/RegistrationForm";
import RoundIntro from "./components/RoundIntro";
import ExperimentScreen from "./components/ExperimentScreen";
import SummaryScreen from "./components/SummaryScreen";

function App() {
    const [screen, setScreen] = useState("start");
    const [round, setRound] = useState(1);
    const [allAnswers, setAllAnswers] = useState([]);

    function startRound() {
        setScreen("experiment");
    }

    function sendAnswersToServer(answers) {
        fetch("http://127.0.0.1:8000/answers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(answers),
        })
            .then((res) => res.json())
            .then((data) => console.log("Server response:", data))
            .catch((error) => console.error("Error sending answers:", error));
    }

    function finishRound(roundAnswers) {
        console.log("🔥 finishRound called", round);
        const updatedAnswers = [...allAnswers, ...roundAnswers];
        setAllAnswers(updatedAnswers);

        if (round === 1) {
            setRound(2);
            setScreen("roundIntro");
        } else {
            sendAnswersToServer(updatedAnswers);
            console.log("🔥 sending to server", updatedAnswers);
            setScreen("summary");
        }
    }

    return (
        <>
            {screen === "start" && (
                <StartScreen onContinue={() => setScreen("form")} />
            )}

            {screen === "form" && (
                <RegistrationForm
                    onBack={() => setScreen("start")}
                    onStart={() => {
                        setRound(1);
                        setAllAnswers([]);
                        setScreen("roundIntro");
                    }}
                />
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