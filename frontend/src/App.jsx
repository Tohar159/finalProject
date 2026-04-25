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

    function finishRound(roundAnswers) {
        setAllAnswers((prev) => [...prev, ...roundAnswers]);

        if (round === 1) {
            setRound(2);
            setScreen("roundIntro");
        } else {
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

            {screen === "summary" && (
                <SummaryScreen answers={allAnswers} />
            )}
        </>
    );
}

export default App;