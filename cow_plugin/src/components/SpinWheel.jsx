import { useState, useRef } from 'react';

export const SpinWheel = ({ prizes, onComplete }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const wheelRef = useRef(null);

  console.log("🎡 SpinWheel prêmios recebidos:", prizes);

  // Usa os prizes da API ou array vazio como fallback
  const segments = prizes || [];
  const segmentAngle = segments.length > 0 ? 360 / segments.length : 0;

  // Se não houver prêmios, mostra mensagem de carregamento
  if (!segments || segments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p>Carregando prêmios...</p>
      </div>
    );
  }

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Encontra o índice do "Item surpresa" - busca flexível
    const surpriseIndex = segments.findIndex(segment => 
      segment.label.toLowerCase().includes('surpresa')
    );
    
    // Se não encontrar, usa o primeiro segmento
    const targetIndex = surpriseIndex !== -1 ? surpriseIndex : 0;
    
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
    <div className="spin-wheel-container">
      {/* Title */}
      <h2 className="spin-wheel-title">Gire a roleta e ganhe prêmios!!</h2>
      
      {/* Arrow indicator */}
      <div className="arrow-container">
        <div className="arrow-wrapper">
          <div className="arrow" />
        </div>
      </div>

      {/* Wheel container */}
      <div className="wheel-wrapper">
        <div
          ref={wheelRef}
          className="wheel"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="wheel-svg">
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
                  <path d={pathD} fill={segment.color} stroke="#1a1a2e" strokeWidth="0.5" />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                    className="segment-text"
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center circle */}
          <div className="center-circle">
            <div className="center-circle-inner" />
          </div>
        </div>
      </div>

      {/* Winner display */}
      {winner && (
        <div className="winner-display">
          <p className="winner-label">Você ganhou:</p>
          <p className="winner-prize">{winner}</p>
        </div>
      )}

      {/* Spin button */}
      {!isSpinning && !winner && (
        <button
          onClick={spin}
          className="spin-button"
        >
          Girar Roleta
        </button>
      )}
    </div>
  );
};
