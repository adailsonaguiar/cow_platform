import React, { useEffect, useState } from 'react'

export default function LoadingComponent({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const duration = 5000 // 5 segundos
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''))
    }, 500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 100))
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          clearInterval(interval)
          setTimeout(() => onComplete(), 300)
          return 100
        }
        return newProgress
      })
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <div className="dexx-loading-container">
      <div className="dexx-loading-content">
        {/* Animated Icon */}
        <div className="dexx-loading-icon-wrapper">
          <div className="dexx-loading-spinner">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" opacity="0.1" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="44 176"
                strokeLinecap="round"
                className="dexx-spinner-ring"
              />
            </svg>
            <div className="dexx-loading-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="dexx-loading-text">
          <h2 className="dexx-loading-title">Processando suas respostas{dots}</h2>
          <p className="dexx-loading-subtitle">Estamos preparando algo especial para você</p>
        </div>

        {/* Progress Bar */}
        <div className="dexx-loading-progress-bar">
          <div
            className="dexx-loading-progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Countdown */}
        <div className="dexx-loading-countdown">
          {Math.ceil((5000 - progress * 50) / 1000)}s
        </div>

        {/* Decorative Elements */}
        <div className="dexx-loading-particles">
          <div className="dexx-particle dexx-particle-1"></div>
          <div className="dexx-particle dexx-particle-2"></div>
          <div className="dexx-particle dexx-particle-3"></div>
        </div>
      </div>
    </div>
  )
}
