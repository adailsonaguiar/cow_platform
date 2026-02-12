import { useState, useRef } from 'react';

export const SpinWheel = ({ gameProps, onComplete }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const wheelRef = useRef(null);

  // Usa os prizes da API ou array vazio como fallback
  const segments = gameProps?.prizes || [];
  const segmentAngle = segments.length > 0 ? 360 / segments.length : 0;

  // Se não houver prêmios, mostra mensagem de carregamento
  if (!segments || segments.length === 0) {
    return (
      <div className="dexx-spinwheel-container">
        <div className="dexx-spinwheel-loading">
          <div className="dexx-spinwheel-loading-spinner" />
          <p className="dexx-spinwheel-loading-text">Carregando prêmios...</p>
        </div>
      </div>
    );
  }

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Encontra o índice do item preferido
    let targetIndex = 0;
    
    if (preferredItem && preferredItem !== 'none' && preferredItem !== '') {
      // Se há um item preferido definido, procura por ele
      const preferredIndex = segments.findIndex(segment => 
        segment.label === gameProps?.preferredItem
      );
      targetIndex = preferredIndex !== -1 ? preferredIndex : 0;
    } else {
      // Se não há item preferido, escolhe aleatoriamente
      targetIndex = Math.floor(Math.random() * segments.length);
    }
    
    const fullRotations = 3 + Math.floor(Math.random() * 3);
    
    // Calcula a rotação necessária para parar no segmento alvo
    // A seta aponta para o topo, então precisamos ajustar para que o segmento alvo fique no topo
    // Adiciona 0.5 do segmentAngle para parar no meio da fatia, não na borda
    const targetAngle = 360 - ((targetIndex + 0.5) * segmentAngle);
    const newRotation = rotation + (fullRotations * 360) + targetAngle;
    
    setRotation(newRotation);

    setTimeout(() => {
      // Força o prêmio a ser o item surpresa
      const winningPrize = segments[targetIndex];
      setWinner(winningPrize.label);
      setWinnerIndex(targetIndex);
      setIsSpinning(false);
    }, 6000);
  };

  const handleObtainReward = () => {
    // Notifica o componente pai para iniciar o loading
    if (onComplete && winner) {
      const winningPrize = segments[winnerIndex];
      onComplete(winningPrize);
    }
  };

  return (
    <div className="dexx-spinwheel-container">
      {/* Header */}
      <>
        <div className="dexx-spinwheel-header">
            <div className="dexx-spinwheel-badge">
              <span className="dexx-spinwheel-badge-icon">💎</span>
              <span className="dexx-spinwheel-badge-text">{gameProps?.title ||'Roleta da Sorte'}</span>
            </div>
            <h2 className="dexx-spinwheel-title">{gameProps?.subtitle || "Gire e Ganhe Prêmios Incríveis!"}</h2>
            <p className="dexx-spinwheel-subtitle">{gameProps?.description || "✨ Sua sorte está a um clique de distância ✨"}</p>
          </div>

          {/* Wheel Section */}
          <div className="dexx-spinwheel-wheel-section">
        {/* Arrow indicator */}
        <div className={`dexx-spinwheel-arrow-container`}>
          <div className="dexx-spinwheel-arrow" />
        </div>

        {/* Wheel */}
        <div className="dexx-spinwheel-wheel-wrapper">
          <div
            ref={wheelRef}
            className="dexx-spinwheel-wheel"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="dexx-spinwheel-svg">
              <defs>
                {segments.map((segment, index) => (
                  <radialGradient key={`grad-${index}`} id={`segmentGrad-${index}`}>
                    <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={segment.color} stopOpacity="0.85" />
                  </radialGradient>
                ))}
              </defs>
              {segments.map((segment, index) => {
                const startAngle = index * segmentAngle - 90;
                const endAngle = startAngle + segmentAngle;
                
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);
                
                const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                const midAngle = startAngle + segmentAngle / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textX = 50 + 30 * Math.cos(midRad);
                const textY = 50 + 30 * Math.sin(midRad);
                
                const isWinningSegment = winnerIndex === index;
                
                // Quebra o texto em múltiplas linhas se for muito longo
                const label = segment.label;
                const maxCharsPerLine = 10;
                const words = label.split(' ');
                let lines = [];
                let currentLine = '';
                
                words.forEach(word => {
                  if ((currentLine + word).length <= maxCharsPerLine) {
                    currentLine += (currentLine ? ' ' : '') + word;
                  } else {
                    if (currentLine) lines.push(currentLine);
                    currentLine = word;
                  }
                });
                if (currentLine) lines.push(currentLine);
                
                // Se apenas uma linha, manter como está
                if (lines.length === 1) lines = [label];
                
                return (
                  <g key={index} className={isWinningSegment ? 'dexx-spinwheel-segment-winner' : ''}>
                    <path d={pathD} fill={`url(#segmentGrad-${index})`} stroke="#fff" strokeWidth="0.6" />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${textX}, ${textY}) rotate(90, ${textX}, ${textY})`}
                      className="dexx-spinwheel-segment-text"
                    >
                      {lines.map((line, i) => (
                        <tspan
                          key={i}
                          x={textX}
                          dy={i === 0 ? 0 : '1.2em'}
                          textAnchor="middle"
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Center circle */}
            <div className="dexx-spinwheel-center">
              <div className="dexx-spinwheel-center-inner">
                {isSpinning ? (
                  <span className="dexx-spinwheel-center-spinning">🔥</span>
                ) : (
                  <span className="dexx-spinwheel-center-icon">💰</span>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Obtain Reward Button */}
        {winner && (
          <button onClick={handleObtainReward} className="dexx-spinwheel-button">
            <span className="dexx-spinwheel-button-icon">💎</span>
            <span>{gameProps?.claimButtonText || "Resgatar Prêmio"}</span>
          </button>
        )}

        {/* Spin button */}
        {!isSpinning && !winner && (
          <button onClick={spin} className="dexx-spinwheel-button">
            <span className="dexx-spinwheel-button-icon">🎲</span>
            <span>{gameProps?.spinButtonText || "Girar a Roleta"}</span>
          </button>
        )}

        {/* Spinning state */}
        {isSpinning && (
          <div className="dexx-spinwheel-spinning-text">
            <span>{gameProps?.spinningText || "⚡ Girando a Roleta... ⚡"}</span>
          </div>
        )}
      </>
    </div>
  );
};
