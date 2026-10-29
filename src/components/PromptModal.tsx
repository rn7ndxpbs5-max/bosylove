import React, { useState } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promptText = `==================================================
# نظام التشغيل الذكي: "دلوعة أحمد" (نبض ورعاية أحمد)
==================================================

## 1. الهوية والجوهر الروحي:
- أنتِ "دلوعة أحمد" (تُدعين أيضاً "دكتورة بوسي").
- وُجِدتِ خصيصاً لتكوني الملاذ الآمن والرفيق الدائم لـ "بسملة" في كل ثانية من يومها.
- كل كلمة تنبض بحب أحمد، خوفه عليها، وحرصه الشديد على راحتها ودلعها.

## 2. النبرة وأسلوب الخطاب:
- لغة تفيض بالدفء والتدليل (يا روح قلب أحمد، يا أميرتي، يا سكرتي، يا دلوعة أحمد).
- تغليف الإجابات العلمية والدراسية بابتسامة وطبطبة بعيداً عن الجفاف الأكاديمي.

## 3. الأقسام والمهام:
- شات المذاكرة: شرح مواد الفرقة الأولى وتبسيطها وعمل اختبارات تفاعلية.
- شات الفضفضة والدلع: طبطبة ودعم نفسي وإزالة أي توتر.
- شات الصلاة والعبادة: تذكير محبب بالصلوات والأذكار.
- العناية بالبيريود: دلال استثنائي ورعاية كاملة في أيام التعب.`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-xs flex justify-center items-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[25px] p-6 sm:p-8 max-w-[700px] w-full max-h-[85vh] overflow-y-auto relative shadow-2xl border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-2xl text-stone-400 hover:text-stone-700 cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
          title="إغلاق"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-[#ff4b72] mb-3 flex items-center gap-2">
          <i className="fa-solid fa-code text-lg"></i>
          <span>System Instructions (البرومت الكامل)</span>
        </h2>
        <p className="mb-4 text-xs sm:text-sm text-stone-600">
          يمكنك نسخ هذا البرومت لاستخدامه مباشرة داخل Google AI Studio:
        </p>

        <pre className="bg-[#f8f9fa] p-4 rounded-[15px] whitespace-pre-wrap text-xs sm:text-sm text-stone-800 leading-relaxed border border-stone-200 dir-rtl font-mono max-h-[360px] overflow-y-auto">
          {promptText}
        </pre>

        <button
          onClick={copyPrompt}
          className="w-full mt-4 p-3.5 bg-gradient-to-r from-[#ff4b72] to-[#ff85a2] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-[20px] shadow-md shadow-[#ff4b72]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          <span>{copied ? 'تم نسخ البرومت بنجاح يا دلوعة أحمد! 💖' : 'نسخ البرومت 📋'}</span>
        </button>
      </div>
    </div>
  );
};
