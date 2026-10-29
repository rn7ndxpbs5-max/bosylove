import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const checkPin = () => {
    const cleanPin = pin.trim().replace(/\s+/g, ' ');
    // Accepts "بحب احمد" or "بحب أحمد"
    if (cleanPin === 'بحب احمد' || cleanPin === 'بحب أحمد') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4b72', '#ff85a2', '#ffd1dc', '#fde047'],
      });
      setErrorMsg('');
      // No localStorage persistence - PIN is strictly required on every refresh/visit
      onLoginSuccess();
    } else {
      setErrorMsg('الرمز خاطئ! اكتبي "بحب احمد" 💕');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkPin();
    }
  };

  return (
    <div id="login-screen" className="fixed inset-0 bg-[var(--bg-gradient)] z-[9999] flex justify-center items-center p-5">
      <div className="login-card bg-[var(--glass-bg)] backdrop-blur-[20px] border-2 border-[var(--glass-border)] rounded-[35px] p-[45px_30px] sm:p-[45px_35px] w-full max-w-[440px] text-center shadow-[var(--shadow)] login-card-glow transition-all">
        <i
          className="fa-solid fa-heart-circle-bolt text-5xl sm:text-6xl text-[var(--primary)] mb-4 inline-block drop-shadow-xs"
        ></i>
        
        <h1 className="love-title text-[2.1rem] sm:text-[2.3rem] font-[900] text-[var(--primary)] mb-2 font-marhey drop-shadow-xs">
          بحب احمد 💖
        </h1>
        <p className="love-subtitle text-base sm:text-lg text-[#7a4253] mb-6 font-semibold">
          ادخلي الرمز السري لفتح برنامجكِ الخاص
        </p>

        <div className="relative mb-5">
          <input
            type={showPassword ? 'text' : 'password'}
            id="pin-code"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            onKeyDown={handleKeyDown}
            className="pin-input w-full p-[16px_20px] pl-12 border-2 border-[var(--secondary)] rounded-[20px] text-[1.2rem] text-center outline-hidden bg-white text-[var(--primary)] font-bold transition-all focus:border-[var(--primary)] focus:shadow-[0_0_15px_rgba(255,51,102,0.2)] placeholder:text-[#ff7597]/60 placeholder:font-normal"
            placeholder="اكتبي: بحب احمد"
            autoComplete="off"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            title={showPassword ? 'إخفاء الرمز' : 'إظهار الرمز'}
          >
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        <button
          onClick={checkPin}
          className="login-btn w-full p-[16px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] border-none rounded-[20px] text-white text-[1.2rem] font-bold cursor-pointer shadow-[0_6px_20px_rgba(255,51,102,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,51,102,0.4)] transition-all active:scale-98"
        >
          دخول لقلب أحمد 🔑
        </button>

        {errorMsg && (
          <p
            id="error-msg"
            className="text-[#d9534f] mt-3 font-bold text-xs sm:text-sm animate-in fade-in"
          >
            {errorMsg}
          </p>
        )}

        <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-center gap-1.5 text-xs text-[#7a4253]">
          <i className="fa-solid fa-crown text-amber-400"></i>
          <span>البرنامج مُهدى خصيصاً لعيون بسملة (دلوعة أحمد)</span>
        </div>
      </div>
    </div>
  );
};
