import React, { useEffect, useState, useRef } from "react";
import { fetchPluginConfig } from "./mockApi";
import FormComponent from "./components/FormComponent";
import QuizSubmitScreen from "./components/QuizSubmitScreen";
import PrizeSuccessScreen from "./components/PrizeSuccessScreen";
import gptManager from "./GPTRewardedManager";
import { SpinWheel } from "./components/SpinWheel";
import { MysteryBox } from "./components/MysteryBox";
import LoadingComponent from "./components/LoadingComponent";

export default function PluginModal({ open, onClose }) {
  const [visible, setVisible] = useState(open);
  const [componentType, setComponentType] = useState(null);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [preferredItem, setPreferredItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [isLoadingReward, setIsLoadingReward] = useState(false);
  const [currentPrize, setCurrentPrize] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const prizeRef = useRef(null);

  useEffect(() => {
    if (window.location.hash.includes("goog_rewarded")) {
      return;
    }
    setVisible(open);
    if (open) {
      setStep(1);
      setAnswers({});
      setLoading(true);
      setCompleted(false);
      setQuizCompleted(false);
      setComponentType(null);
      setQuestions([]);
      setPrizes([]);
      // Bloquear scroll da página
      document.body.style.overflow = "hidden";

      // 🔑 CRÍTICO: Inicializa GPT Listeners IMEDIATAMENTE ao abrir modal
      // (igual plugin-funcional.js linha ~698)
      gptManager.init(() => {
        handleClose();
      });

      // Buscar configuração do plugin da API
      fetchPluginConfig()
        .then((config) => {
          console.log("📦 Configuração recebida no PluginModal:", config);
          setComponentType(config.type);
          if (config.type === "quiz") {
            console.log("📋 Quiz recebido com", config.questions?.length || 0, "perguntas");
            setQuestions(config.questions || []);
          } else if (config.type === "spinwheel") {
            console.log("🎡 Spinwheel recebido com", config.prizes?.length || 0, "prêmios");
            setPrizes(config.prizes || []);
            setPreferredItem(config.preferredItem || "");
          } else if (config.type === "mysterybox") {
            console.log("🎁 MysteryBox recebido com", config.prizes?.length || 0, "prêmios");
            console.log("   Prêmios:", config.prizes);
            console.log("   Item preferido:", config.preferredItem || "nenhum");
            setPrizes(config.prizes || []);
            setPreferredItem(config.preferredItem || "");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Erro ao carregar configuração:", err);
          onClose();
        });
    } else {
      // Restaurar scroll da página e limpar recursos GPT
      document.body.style.overflow = "initial";
      gptManager.cleanup();
    }
  }, [open]);

  function dispatchResponse(response) {
    const next = { ...answers, [`step${step}`]: response };
    setAnswers(next);

    window.dispatchEvent(
      new CustomEvent("dexxPluginResponse", {
        detail: { step, response, allAnswers: next },
      }),
    );

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      setQuizCompleted(true);
    }
  }

  function handleFormSubmit() {
    console.log("📋 Formulário enviado");
    setCompleted(true);
    setIsLoadingReward(true);
    window.dispatchEvent(
      new CustomEvent("dexxPluginResponse", {
        detail: { type: "quiz", answers },
      }),
    );
  }

  function handleFormComplete() {
    // Formulário completou, já mostrando loading
    // Aguarda a conclusão do loading para mostrar link do prêmio
  }

  function handleLoadingComplete() {
    setIsLoadingReward(false);
    // Mostra o link do prêmio após o loading
    setTimeout(() => showRewardedLink(), 400);
  }

  function handleRouletteComplete(prize) {
    console.log("🎡 Roleta completada:", prize);
    setCompleted(true);
    setCurrentPrize(prize);
    // Inicia loading ao finalizar roleta
    setIsLoadingReward(true);
    window.dispatchEvent(
      new CustomEvent("dexxPluginResponse", {
        detail: { type: "roulette", prize },
      }),
    );
  }

  function handleMysteryBoxComplete(prize) {
    console.log("🎁 Caixa surpresa completada:", prize);
    setCompleted(true);
    setCurrentPrize(prize);
    // Inicia loading ao finalizar caixa surpresa
    setIsLoadingReward(true);
    window.dispatchEvent(
      new CustomEvent("dexxPluginResponse", {
        detail: { type: "mysterybox", prize },
      }),
    );
  }

  function showRewardedLink() {
    const el = prizeRef.current;
    if (!el) return;
    el.classList.remove("hidden");
    el.querySelector("a")?.setAttribute("tabindex", "0");
  }

  function handlePrizeClick(e) {
    // Previne comportamento padrão
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    // stopImmediatePropagation pode não existir em eventos sintéticos do React
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }
    // Tenta parar também no evento nativo se existir
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }

    // Armazena no localStorage
    try {
      localStorage.setItem("dexx_prize_clicked", String(Date.now()));
      localStorage.setItem("dexx_once", "1");
    } catch (_) {}

    // Dispara evento customizado (igual plugin-funcional.js linha ~389)
    window.dispatchEvent(
      new CustomEvent("dexxPrizeClick", {
        detail: {
          componentType,
          answers,
          timestamp: new Date().toISOString(),
        },
      }),
    );

    gptManager.showRewarded();

    return false;
  }

  function handleClose() {
    setVisible(false);
    document.body.style.overflow = "initial";
    onClose && onClose();
  }

  if (!visible) return null;

  const content = loading ? (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
      <p>Carregando...</p>
    </div>
  ) : isLoadingReward ? (
    <LoadingComponent onComplete={handleLoadingComplete} />
  ) : quizCompleted && !completed && componentType === "quiz" ? (
    <QuizSubmitScreen onSubmit={handleFormSubmit} />
  ) : currentPrize && (componentType === "spinwheel" || componentType === "mysterybox") ? (
    <PrizeSuccessScreen componentType={componentType} prize={currentPrize} />
  ) : completed && componentType === "quiz" ? (
    <PrizeSuccessScreen componentType="quiz" prize={null} />
  ) : componentType === "quiz" ? (
    <FormComponent
      questions={questions}
      step={step}
      answers={answers}
      onAnswer={dispatchResponse}
      onComplete={handleFormComplete}
    />
  ) : componentType === "spinwheel" ? (
    <SpinWheel
      onComplete={handleRouletteComplete}
      prizes={prizes}
      preferredItem={preferredItem}
    />
  ) : componentType === "mysterybox" ? (
    <MysteryBox
      onComplete={handleMysteryBoxComplete}
      prizes={prizes}
      preferredItem={preferredItem}
    />
  ) : null;

  return (
    <div className="dexx-modal-overlay">
      <div className="dexx-modal-content-wrapper">
        <div className="dexx-modal-content">
          <div className="dexx-modal-dynamic-content">{content}</div>
          {completed && (
            <div id="dexx-rewarded-container" ref={prizeRef} className="hidden">
              <a
                href="#"
                className="dexx-modal-prize-link av-rewarded"
                data-av-rewarded="true"
                data-google-rewarded="true"
                data-google-interstitial="false"
                role="button"
                tabIndex={-1}
                onClick={handlePrizeClick}
              >
                <span className="dexx-spinwheel-button-icon">💎</span>
                <span>Ver Prêmio Agora</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
