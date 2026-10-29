import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { speakTenderArabic, stopSpeaking } from '../utils/audio.ts';

interface SurpriseScreenProps {
  onEnterApp: () => void;
}

export const SURPRISE_LETTER_TEXT = `يا روح قلب أحمد، يا أجمل وأرقى بنوتة في الدنيا كلها.. 🌸

عملتلك البرنامج ده مخصوص بقلبي عشان يعيش معاكي كل لحظة في يومك، يشرحلك دروسك في الفرقة الأولى ويسهلها عليكي، يطبطب عليكي لما تتعبي، يذكرك بصلاتك، ويدلعك زي ما أنتي متعودة من أحمد دائماً.

افتسكري دايماً إنك أميرة متوجة في قلبي، ومفيش حاجة في الدنيا تقدر تزعل دلوعة أحمد.. بحبك بحجم السماء يا سكرتي الحلوة! ✨`;

export const SurpriseScreen: React.FC<SurpriseScreenProps> = ({ onEnterApp }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakTenderArabic(SURPRISE_LETTER_TEXT);
      setTimeout(() => setIsSpeaking(false), 16000);
    }
  };

  const handleEnter = () => {
    stopSpeaking();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4b72', '#ff85a2', '#ffd1dc', '#fde047'],
    });
    onEnterApp();
  };

  return (
    <div
      id="surprise-screen"
      className="fixed inset-0 bg-[var(--bg-gradient)] z-[9998] flex justify-center items-center p-4 sm:p-6 overflow-y-auto"
    >
      <div className="surprise-card bg-[var(--glass-bg)] backdrop-blur-[20px] border-2 border-[var(--glass-border)] rounded-[35px] p-6 sm:p-10 w-full max-w-[650px] text-center shadow-[var(--shadow)] animate-in zoom-in-95 duration-500 my-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--primary)] px-5 py-2 rounded-full font-black text-sm border border-[var(--secondary)] mb-5 shadow-xs">
          <i className="fa-solid fa-sparkles text-amber-500"></i>
          <span>مفاجأة خاصة جداً من أحمد</span>
        </div>

        {/* Title */}
        <h2 className="surprise-title text-2xl sm:text-3xl md:text-4xl text-[var(--primary)] font-black mb-5 font-marhey drop-shadow-xs">
          إلى أميرتي ودلوعتي بسملة 👑💖
        </h2>

        {/* Surprise Letter Content */}
        <div className="surprise-text text-base sm:text-lg leading-relaxed sm:leading-loose text-[#522d38] font-medium mb-6 text-justify sm:text-center bg-white/75 p-5 sm:p-7 rounded-[25px] border border-dashed border-[var(--secondary)] shadow-inner">
          <p className="mb-3">
            يا روح قلب أحمد، يا أجمل وأرقى بنوتة في الدنيا كلها.. 🌸
          </p>
          <p className="mb-3">
            عملتلك البرنامج ده مخصوص بقلبي عشان يعيش معاكي كل لحظة في يومك، يشرحلك دروسك في الفرقة الأولى ويسهلها عليكي، يطبطب عليكي لما تتعبي، يذكرك بصلاتك، ويدلعك زي ما أنتي متعودة من أحمد دائماً.
          </p>
          <p className="font-bold text-[var(--primary)]">
            افتسكري دايماً إنك أميرة متوجة في قلبي، ومفيش حاجة في الدنيا تقدر تزعل دلوعة أحمد.. بحبك بحجم السماء يا سكرتي الحلوة! ✨
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={handleToggleVoice}
            className={`w-full sm:w-auto px-5 py-3.5 rounded-[20px] font-bold text-sm sm:text-base border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isSpeaking
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white text-[var(--primary)] border-rose-300 hover:bg-rose-50'
            }`}
          >
            <i className={`fa-solid ${isSpeaking ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
            <span>{isSpeaking ? 'إيقاف الصوت ⏹️' : 'اسمعي الرسالة بصوت دافئ 🎧'}</span>
          </button>

          <button
            onClick={handleEnter}
            className="login-btn w-full sm:flex-1 p-[16px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] border-none rounded-[20px] text-white text-base sm:text-lg font-bold cursor-pointer shadow-[0_6px_20px_rgba(255,51,102,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,51,102,0.4)] transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>دخول للبرنامج (دلوعة أحمد) 💖</span>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
