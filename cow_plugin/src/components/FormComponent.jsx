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

  const currentQuestion = questions[step - 1]
  const options = currentQuestion.options || ['Sim', 'Não']

  return (
    <>
      <div className="dexx-modal-step-indicator">
        Etapa <span className="step-active">{step}</span> de {questions.length}
      </div>
      <h2 className="dexx-modal-title">{currentQuestion.title || 'Responda para participar'}</h2>
      <p className="dexx-modal-question">{currentQuestion.question}</p>
      <div className="dexx-modal-buttons">
        {options.map((option, index) => (
          <button 
            key={index}
            className={`dexx-modal-button ${index === options.length - 1 ? 'dexx-modal-button-yes' : 'dexx-modal-button-no'}`}
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  )
}
