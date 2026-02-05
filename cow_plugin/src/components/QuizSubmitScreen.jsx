import React from 'react'

export default function QuizSubmitScreen({ onSubmit }) {
  return (
    <div className="dexx-form-container">
      <div className="dexx-success-state">
        <div className="dexx-success-icon-wrapper">
          <div className="dexx-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="dexx-form-title">Formulário Preenchido!</h2>
        <p className="dexx-form-subtitle">Suas respostas estão prontas para serem enviadas.</p>
                    
        <div className="dexx-reward-notice">
          <div className="dexx-reward-icon">🎁</div>
          <div className="dexx-reward-text">
            <span className="dexx-reward-title">Prêmio à Espera!</span>
            <span className="dexx-reward-description">Clique em enviar para receber um prêmio especial.</span>
          </div>
        </div>

        <button onClick={onSubmit} className="dexx-spinwheel-button" style={{ marginTop: 'var(--dexx-space-6)' }}>
          <span className="dexx-spinwheel-button-icon">✅</span>
          <span>Enviar Respostas</span>
        </button>
      </div>
      <div className="dexx-form-footer">
        <span className="dexx-footer-text">Após enviar, confira seu prêmio</span>
      </div>
    </div>
  )
}
