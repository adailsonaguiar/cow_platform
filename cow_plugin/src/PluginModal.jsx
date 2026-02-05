import React, { useEffect, useState, useRef } from "react";
import { fetchPluginConfig } from "./mockApi";
import FormComponent from "./components/FormComponent";
import gptManager from "./GPTRewardedManager";
import { SpinWheel } from "./components/SpinWheel";
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
          setComponentType(config.type);
          if (config.type === "quiz") {
            setQuestions(config.questions || []);
          } else if (config.type === "spinwheel") {
            setPrizes(config.prizes || []);
            setPreferredItem(config.preferredItem || "");
          }
          setLoading(false);
        })
        .catch((err) => {
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
      setCompleted(true);
      // Inicia loading ao finalizar formulário
      setIsLoadingReward(true);
    }
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
  ) : currentPrize && componentType === "spinwheel" ? (
    <div className="dexx-form-container">
      <div className="dexx-success-state">
        <div className="dexx-success-icon-wrapper">
          <div className="dexx-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="dexx-form-title">🏆 Parabéns! 🏆</h2>
        <p className="dexx-form-subtitle">Você sorteou:</p>
        <p style={{ fontSize: '24px', fontWeight: '800', color: '#7c3aed', marginTop: '16px' }}>{currentPrize.label}</p>
        
        <div className="dexx-reward-notice">
          <div className="dexx-reward-icon">🎁</div>
          <div className="dexx-reward-text">
            <span className="dexx-reward-title">Prêmio desbloqueado!</span>
            <span className="dexx-reward-description">Como agradecimento, preparamos algo especial para você.</span>
          </div>
        </div>
      </div>
      <div className="dexx-form-footer">
        <span className="dexx-footer-text">Veja a recomendação patrocinada para continuar</span>
      </div>
    </div>
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
