import React, { useState } from 'react'

export default function FormComponent({ gameProps, onComplete }) {
  const questions = gameProps.questions || [];
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  // Se não há perguntas, retorna null
  if (questions.length === 0) {
    return null;
  }

  function handleAnswer(response) {
    const nextAnswers = { ...answers, [`step${step}`]: response };
    setAnswers(nextAnswers);

    // Dispara evento de resposta
    window.dispatchEvent(
      new CustomEvent("dexxPluginResponse", {
        detail: { step, response, allAnswers: nextAnswers },
      }),
    );

    if (step < questions.length) {
      // Avança para próxima pergunta
      setStep(step + 1);
    } else {
      // Quiz completado - notifica o pai com todas as respostas
      onComplete && onComplete(nextAnswers);
    }
  }

  const currentQuestion = questions[step - 1];
  const options = currentQuestion?.options || ['Sim', 'Não'];
  const progress = (step / questions.length) * 100;

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
            onClick={() => handleAnswer(option)}
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
