import React from 'react'

export default function FormComponent({ questions, step, answers, onAnswer }) {
  if (step > questions.length) {
    return (
      <>
        <div className="dexx-modal-success-icon">🎉</div>
        <h2 className="dexx-modal-title">Obrigado por participar!</h2>
        <div className="dexx-modal-answers-summary">
          {questions.map((q, i) => (
            <p key={q.id}><strong>{q.title}:</strong> {answers[`step${i + 1}`]}</p>
          ))}
        </div>
        <p className="dexx-modal-question">Como agradecimento, preparamos um prêmio especial para você!</p>
        <div className="dexx-modal-footer">Veja a recomendação patrocinada para continuar</div>
      </>
    )
  }

  return (
    <>
      <div className="dexx-modal-step-indicator">
        Etapa <span className="step-active">{step}</span> de {questions.length}
      </div>
      <h2 className="dexx-modal-title">Responda as perguntas para participar</h2>
      <p className="dexx-modal-question">{questions[step - 1].question}</p>
      <div className="dexx-modal-buttons">
        <button 
          className="dexx-modal-button dexx-modal-button-no" 
          onClick={() => onAnswer('não')}
        >
          Não
        </button>
        <button 
          className="dexx-modal-button dexx-modal-button-yes" 
          onClick={() => onAnswer('sim')}
        >
          Sim
        </button>
      </div>
    </>
  )
}
