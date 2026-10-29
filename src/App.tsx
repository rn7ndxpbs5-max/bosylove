import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen.tsx';
import { SurpriseScreen } from './components/SurpriseScreen.tsx';
import { MainApp } from './components/MainApp.tsx';

export default function App() {
  // Always require secret PIN upon every visit or page refresh
  const [stage, setStage] = useState<'login' | 'surprise' | 'app'>('login');

  useEffect(() => {
    localStorage.removeItem('daloaa_logged_in');
  }, []);

  // Floating background hearts
  const [hearts, setHearts] = useState<{ id: number; left: number; duration: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 25; i++) {
      list.push({
        id: i,
        left: Math.random() * 95,
        duration: Math.random() * 5 + 6,
        delay: Math.random() * 5,
        size: Math.random() * 18 + 14,
      });
    }
    setHearts(list);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Floating hearts background */}
      <div className="hearts-bg" id="hearts-container">
        {hearts.map((h) => (
          <i
            key={h.id}
            className="fa-solid fa-heart heart-particle select-none pointer-events-none"
            style={{
              left: `${h.left}vw`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              fontSize: `${h.size}px`,
            }}
          />
        ))}
      </div>

      {/* Secret Login, Romantic Surprise Letter, or Main App */}
      {stage === 'login' && (
        <LoginScreen onLoginSuccess={() => setStage('surprise')} />
      )}

      {stage === 'surprise' && (
        <SurpriseScreen
          onEnterApp={() => {
            setStage('app');
          }}
        />
      )}

      {stage === 'app' && (
        <MainApp
          onOpenSurpriseLetter={() => setStage('surprise')}
          onLogout={() => {
            localStorage.removeItem('daloaa_logged_in');
            setStage('login');
          }}
        />
      )}
    </div>
  );
}
