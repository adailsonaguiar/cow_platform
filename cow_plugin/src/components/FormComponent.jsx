import React from 'react'

export default function FormComponent({ questions, step, answers, onAnswer }) {
  if (step > questions.length) {
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
          <h2 className="dexx-form-title">Obrigado por participar!</h2>
          <p className="dexx-form-subtitle">Suas respostas foram registradas com sucesso.</p>
          
          {/* <div className="dexx-answers-card">
            <div className="dexx-answers-header">
              <span className="dexx-answers-label">Resumo das respostas</span>
            </div>
            <div className="dexx-answers-list">
              {questions.map((q, i) => (
                <div key={q.id} className="dexx-answer-item">
                  <span className="dexx-answer-question">{q.title}</span>
                  <span className="dexx-answer-value">{answers[`step${i + 1}`]}</span>
                </div>
              ))}
            </div>
          </div> */}
          
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
    )
  }

  const currentQuestion = questions[step - 1]
  const options = currentQuestion.options || ['Sim', 'Não']
  const progress = (step / questions.length) * 100

  return (
    <div className="dexx-form-container">
      {/* Progress Header */}
      <div className="dexx-progress-header">
        <div className="dexx-step-info">
          <span className="dexx-step-label">Etapa {step} de {questions.length}</span>
        </div>
        <div className="dexx-progress-bar">
          <div className="dexx-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      {/* Question Content */}
      <div className="dexx-question-content">
        <h2 className="dexx-form-title">{currentQuestion.title || 'Responda para participar'}</h2>
        <p className="dexx-form-question">{currentQuestion.question}</p>
      </div>
      
      {/* Options Grid */}
      <div className="dexx-options-grid">
        {options.map((option, index) => (
          <button 
            key={index}
            className="dexx-option-button"
            onClick={() => onAnswer(option)}
          >
            <span className="dexx-option-text">{option}</span>
            <svg className="dexx-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
