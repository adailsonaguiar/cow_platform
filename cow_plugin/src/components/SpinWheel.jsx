import { useState, useRef } from 'react';

export const SpinWheel = ({ prizes, preferredItem, onComplete }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const wheelRef = useRef(null);

  // Usa os prizes da API ou array vazio como fallback
  const segments = prizes || [];
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
        segment.label === preferredItem
      );
      targetIndex = preferredIndex !== -1 ? preferredIndex : 0;
    } else {
      // Se não há item preferido, escolhe aleatoriamente
      targetIndex = Math.floor(Math.random() * segments.length);
    }
    
    const fullRotations = 3 + Math.floor(Math.random() * 3);
    
    // Calcula a rotação necessária para parar no segmento alvo
    // A seta aponta para o topo, então precisamos ajustar para que o segmento alvo fique no topo
    const targetAngle = 360 - (targetIndex * segmentAngle);
    const newRotation = rotation + (fullRotations * 360) + targetAngle;
    
    setRotation(newRotation);

    setTimeout(() => {
      // Força o prêmio a ser o item surpresa
      const winningPrize = segments[targetIndex];
      setWinner(winningPrize.label);
      setIsSpinning(false);
      
      // Notifica o componente pai sobre a conclusão
      if (onComplete) {
        setTimeout(() => {
          onComplete(winningPrize);
        }, 1000);
      }
    }, 6000);
  };

  return (
    <div className="dexx-spinwheel-container">
      {/* Header */}
      <div className="dexx-spinwheel-header">
        <div className="dexx-spinwheel-badge">
          <span className="dexx-spinwheel-badge-icon">🎰</span>
          <span className="dexx-spinwheel-badge-text">Roleta de Prêmios</span>
        </div>
        <h2 className="dexx-spinwheel-title">Gire e ganhe prêmios!</h2>
        <p className="dexx-spinwheel-subtitle">Tente a sorte e descubra seu prêmio</p>
      </div>

      {/* Wheel Section */}
      <div className="dexx-spinwheel-wheel-section">
        {/* Arrow indicator */}
        <div className="dexx-spinwheel-arrow-container">
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
                
                return (
                  <g key={index}>
                    <path d={pathD} fill={segment.color} stroke="var(--dexx-gray-200)" strokeWidth="0.3" />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                      className="dexx-spinwheel-segment-text"
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Center circle */}
            <div className="dexx-spinwheel-center">
              <div className="dexx-spinwheel-center-inner">
                {isSpinning ? (
                  <span className="dexx-spinwheel-center-spinning">⏳</span>
                ) : (
                  <span className="dexx-spinwheel-center-icon">🎯</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner display */}
      {winner && (
        <div className="dexx-spinwheel-winner">
          <div className="dexx-spinwheel-winner-icon">🎉</div>
          <p className="dexx-spinwheel-winner-label">Parabéns! Você ganhou:</p>
          <p className="dexx-spinwheel-winner-prize">{winner}</p>
        </div>
      )}

      {/* Spin button */}
      {!isSpinning && !winner && (
        <button onClick={spin} className="dexx-spinwheel-button">
          <span className="dexx-spinwheel-button-icon">🎲</span>
          <span>Girar Roleta</span>
        </button>
      )}

      {/* Spinning state */}
      {isSpinning && (
        <div className="dexx-spinwheel-spinning-text">
          <span>Girando...</span>
        </div>
      )}
    </div>
  );
};
