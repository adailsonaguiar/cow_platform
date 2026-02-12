import { useState } from 'react';

export const MysteryBox = ({ prizes, preferredItem, onComplete }) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [winner, setWinner] = useState(null);

  // Usa os prizes da API ou array vazio como fallback
  const availablePrizes = prizes || [];
  
  // A quantidade de caixinhas é igual à quantidade de prêmios (mínimo 2, máximo 5)
  const numberOfBoxes = Math.min(Math.max(availablePrizes.length, 2), 6);

  // Se não houver prêmios, mostra mensagem de carregamento
  if (!availablePrizes || availablePrizes.length === 0) {
    return (
      <div className="dexx-mysterybox-container">
        <div className="dexx-mysterybox-loading">
          <div className="dexx-mysterybox-loading-spinner" />
          <p className="dexx-mysterybox-loading-text">Carregando prêmios...</p>
        </div>
      </div>
    );
  }

  const handleBoxClick = (boxIndex) => {
    if (isRevealing || winner) return;

    setSelectedBox(boxIndex);
    setIsRevealing(true);

    // Sorteia o prêmio
    setTimeout(() => {
      let selectedPrize;
      
      if (preferredItem && preferredItem !== 'none' && preferredItem !== '') {
        // Se há um item preferido definido, procura por ele
        const preferredPrize = availablePrizes.find(prize => prize.label === preferredItem);
        selectedPrize = preferredPrize || availablePrizes[0];
      } else {
        // Se não há item preferido, escolhe aleatoriamente
        const randomIndex = Math.floor(Math.random() * availablePrizes.length);
        selectedPrize = availablePrizes[randomIndex];
      }

      setWinner(selectedPrize);
      setIsRevealing(false);
    }, 2000);
  };

  const handleClaimReward = () => {
    if (onComplete && winner) {
      onComplete(winner);
    }
  };

  return (
    <div className="dexx-mysterybox-container">
      {/* Header */}
      <div className="dexx-mysterybox-header">
        <div className="dexx-mysterybox-badge">
          <span className="dexx-mysterybox-badge-icon">🎁</span>
          <span className="dexx-mysterybox-badge-text">Caixa Surpresa</span>
        </div>
        <h2 className="dexx-mysterybox-title">Escolha Sua Caixa da Sorte!</h2>
        <p className="dexx-mysterybox-subtitle">✨ Uma delas esconde um prêmio especial ✨</p>
      </div>

      {/* Boxes Section */}
      <div className="dexx-mysterybox-boxes-section">
        <div className={`dexx-mysterybox-boxes-grid dexx-mysterybox-boxes-${numberOfBoxes}`}>
          {Array.from({ length: numberOfBoxes }, (_, boxIndex) => (
            <div
              key={boxIndex}
              className={`dexx-mysterybox-box ${
                selectedBox === boxIndex ? 'selected' : ''
              } ${isRevealing && selectedBox === boxIndex ? 'revealing' : ''} ${
                winner && selectedBox === boxIndex ? 'revealed' : ''
              }`}
              onClick={() => handleBoxClick(boxIndex)}
            >
              <div className="dexx-mysterybox-box-inner">
                {winner && selectedBox === boxIndex ? (
                  <div className="dexx-mysterybox-prize-reveal">
                    <div className="dexx-mysterybox-prize-icon">🎉</div>
                    <div className="dexx-mysterybox-prize-label">{winner.label}</div>
                  </div>
                ) : (
                  <>
                    <div className="dexx-mysterybox-icon">🎁</div>
                    <div className="dexx-mysterybox-box-label">Caixa {boxIndex + 1}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Revealing Message */}
        {isRevealing && (
          <div className="dexx-mysterybox-revealing-text">
            <span>🔮 Revelando seu prêmio...</span>
          </div>
        )}

        {/* Winner Display */}
        {winner && !isRevealing && (
          <>
            <button onClick={handleClaimReward} className="dexx-mysterybox-button">
              <span className="dexx-mysterybox-button-icon">💎</span>
              <span>Resgatar Prêmio</span>
            </button>

            <div className="dexx-mysterybox-ad-notice">
              <span className="dexx-mysterybox-ad-icon">📺</span>
              <span>Para continuar, assista a um anúncio rápido</span>
            </div>
          </>
        )}

        {/* Instructions */}
        {!selectedBox && !isRevealing && (
          <div className="dexx-mysterybox-instructions">
            <p>👆 Escolha uma caixa para descobrir seu prêmio!</p>
          </div>
        )}
      </div>
    </div>
  );
};
