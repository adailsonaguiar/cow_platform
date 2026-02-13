import React, { useEffect, useState, useRef } from "react";
import { fetchPluginConfig } from "./api";
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
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [isLoadingReward, setIsLoadingReward] = useState(false);
  const [currentPrize, setCurrentPrize] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const prizeRef = useRef(null);

  const [gameProps, setGamesProps] = useState({});

  useEffect(() => {
    if (window.location.hash.includes("goog_rewarded")) {
      return;
    }
    setVisible(open);
    if (open) {
      setLoading(true);
      setCompleted(false);
      setQuizCompleted(false);
      setComponentType(null);
      // Bloquear scroll da página
      // document.body.style.overflow = "hidden";

      // 🔑 CRÍTICO: Inicializa GPT Listeners IMEDIATAMENTE ao abrir modal
      // (igual plugin-funcional.js linha ~698)
      gptManager.init(() => {
        handleClose();
      });

      // Buscar configuração do plugin da API
      fetchPluginConfig()
        .then((config) => {
          setComponentType(config.type);
          setGamesProps(config);
        })
        .catch((err) => {
          console.error("❌ Erro ao carregar configuração:", err);
          onClose();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Restaurar scroll da página e limpar recursos GPT
      document.body.style.overflow = "initial";
      gptManager.cleanup();
    }
  }, [open]);

  function handleQuizComplete(answers) {
    setQuizCompleted(true);
  }

  function handleFormSubmit() {
    console.log("📋 Formulário enviado");
    setCompleted(true);
    setIsLoadingReward(true);
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

    gptManager.showRewarded();

    return false;
  }

  function handleClose() {
    setVisible(false);
    document.body.style.overflow = "initial";
    onClose && onClose();
  }

  if (!visible) return null;

  if(loading) return <></>

  console.log({componentType})

  const content = isLoadingReward ? (
    <LoadingComponent onComplete={handleLoadingComplete} />
  ) : quizCompleted && !completed && componentType === "quiz" ? (
    <QuizSubmitScreen onSubmit={handleFormSubmit} />
  ) : currentPrize && (componentType === "spinwheel" || componentType === "mysterybox") ? (
    <PrizeSuccessScreen componentType={componentType} prize={currentPrize} />
  ) : completed && componentType === "quiz" ? (
    <PrizeSuccessScreen componentType="quiz" prize={null} />
  ) : componentType === "quiz" ? (
    <FormComponent
      gameProps={gameProps}
      onComplete={handleQuizComplete}
    />
  ) : componentType === "spinwheel" ? (
    <SpinWheel
      onComplete={handleRouletteComplete}
      gameProps={gameProps}
    />
  ) : componentType === "mysterybox" ? (
    <MysteryBox
      onComplete={handleMysteryBoxComplete}
      gameProps={gameProps}
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
