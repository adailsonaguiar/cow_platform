import React from 'react'

export default function PrizeSuccessScreen({ componentType, prize }) {
  const isQuiz = componentType === 'quiz'
  const isMysteryBox = componentType === 'mysterybox'

  return (
    <div className="dexx-prize-success-container">
      <div className="dexx-prize-success-sparkles">
        <div className="dexx-prize-success-sparkle">✨</div>
        <div className="dexx-prize-success-sparkle">⭐</div>
        <div className="dexx-prize-success-sparkle">💫</div>
        <div className="dexx-prize-success-sparkle">✨</div>
      </div>
      
      <div className="dexx-prize-success-trophy">🏆</div>
      
      <h2 className="dexx-prize-success-title">
        {isQuiz ? "🎉 Obrigado! 🎉" : isMysteryBox ? "🎊 Parabéns! 🎊" : "🎉 Você Ganhou! 🎉"}
      </h2>
      
      <p className="dexx-prize-success-subtitle">
        {isQuiz 
          ? "Suas respostas foram registradas com sucesso!" 
          : isMysteryBox 
          ? "Você escolheu a caixa certa!" 
          : "A sorte está ao seu lado!"}
      </p>
      
      <div className="dexx-prize-success-card">
        <p className="dexx-prize-success-label">
          {isQuiz 
            ? "Prêmio Desbloqueado" 
            : isMysteryBox 
            ? "Seu Prêmio" 
            : "Você Sorteou"}
        </p>
        <p className="dexx-prize-success-value">
          {prize?.label || "Aguardando..."}
        </p>
      </div>
            
      <div className="dexx-prize-success-message">
        <div className="dexx-prize-success-message-icon">🎁</div>
        <div className="dexx-prize-success-message-content">
          <p className="dexx-prize-success-message-title">Prêmio Desbloqueado!</p>
          <p className="dexx-prize-success-message-text">
            Como agradecimento, preparamos algo especial para você.
          </p>
        </div>
      </div>
      
      <div className="dexx-prize-success-footer">
        <span className="dexx-prize-success-footer-icon">📺</span>
        <span className="dexx-prize-success-footer-text">
          Veja a recomendação patrocinada para continuar
        </span>
      </div>
    </div>
  )
}
