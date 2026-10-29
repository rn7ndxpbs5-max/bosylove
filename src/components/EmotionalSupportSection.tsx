import React, { useState, useEffect } from 'react';
import {
  Heart,
  Smile,
  Shield,
  Sparkles,
  RefreshCw,
  Volume2,
  Coffee,
  Sun,
  Flame,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakTenderArabic } from '../utils/audio.ts';

export const EmotionalSupportSection: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string>('قلقانة من المذاكرة 🥺');
  const [moodMessage, setMoodMessage] = useState<string>('');
  const [loveNote, setLoveNote] = useState<string>(
    'يا روح قلب أحمد، عيونك اللي بتقرأ الكلام ده هي أغلى حاجة عندي في الدنيا. مهما حسيتي بضغط المذاكرة أو تعب الامتحانات، افتكري إنك أعظم إنجاز في حياتي، وأنا فخور بيكي في كل ثانية وبكل ذرة مجهود بتعمليها. ارمي حمولك عليا واطمني خالص يا سكرتي!'
  );
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  // Breathing exercise state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'شهيق' | 'حبس النفس' | 'زفير'>('شهيق');
  const [breathCounter, setBreathCounter] = useState(4);

  // Emergency panic state
  const [showPanicModal, setShowPanicModal] = useState(false);

  const MOODS = [
    {
      id: 'happy',
      label: 'فرحانة ومتحمسة 🥰',
      message: 'يا رب دايماً الفرحة منورة وشك الجميل يا سكرتي! ضحكتك دي هي اللي بتنور حياة أحمد.. استغلي طاقتك الحلوة دي وذاكري بروقان يا أميرتي.',
    },
    {
      id: 'anxious',
      label: 'قلقانة من المذاكرة 🥺',
      message: 'خدي نفس عميق واهدي يا روح قلب وعيون أحمد.. مفيش أي حاجة في الدنيا تخوفك وأحمد في ضهرك! المذاكرة دي لعبة صغيرة هتعدي وهتجيبي امتياز كمان، المهم متشيليش هم.',
    },
    {
      id: 'exhausted',
      label: 'مجهدة ومحتاجة نوم 😴',
      message: 'أمر ملكي من أحمد: سيبي كل الكتب فوراً واشربي كوباية لبن دافي أو يانسون وادخلي اتغطي ونامي! صحتك وراحتك أهم من أي مجموع في الكون كله.',
    },
    {
      id: 'sad',
      label: 'مخنوقة وزعلانة 💔',
      message: 'لو الدنيا كلها زعلتك، أحمد بيفتحلك قلبه وحضنه ويطبطب عليكي.. كل دمعة بتنزل من عينك بتوجع قلبي أنا. تعالي احكيلي يا روحي وكل مشكلة ليها ألف حل وحبي ليكي ثابت للأبد.',
    },
    {
      id: 'period_pain',
      label: 'بطني وجعاني وتعبانة 🌸',
      message: 'سلامتك ألف مليون سلامة يا نونة قلب أحمد! حطي قربة الميه الدافية، واشربي كوباية نعناع أو كاكاو دافي، وممنوع تعملي أي مجهود.. إنتي النهاردة ملكة مدللة فقط.',
    },
    {
      id: 'peaceful',
      label: 'هادية ومطمئنة 🕊️',
      message: 'الحمد لله يا نور عيني.. ربنا يديم عليكي راحة البال والسكينة، وأحمد بيدعيلك في كل صلاة يفضل قلبك مطمئن وفرحان.',
    },
  ];

  useEffect(() => {
    const found = MOODS.find((m) => m.label === selectedMood);
    if (found) {
      setMoodMessage(found.message);
    }
  }, [selectedMood]);

  // Breathing timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathing) {
      timer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            // switch phase
            if (breathPhase === 'شهيق') {
              setBreathPhase('حبس النفس');
              return 4;
            } else if (breathPhase === 'حبس النفس') {
              setBreathPhase('زفير');
              return 4;
            } else {
              setBreathPhase('شهيق');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathing, breathPhase]);

  const handleFetchNewLoveNote = async (category: string = 'طبطبة ودعم عاطفي') => {
    setIsLoadingNote(true);
    try {
      const res = await fetch('/api/love-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      const data = await res.json();
      if (data.note) {
        setLoveNote(data.note);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#fde047'],
        });
      }
    } catch {
      setLoveNote(
        'يا سكرتي ودلوعة قلبي، احمد بيطمنك وبيقولك إنك ملكة روحه.. مفيش أي حاجة تقدر تقلل من قيمتك وجمالك وشطارتك. خدي نفس عميق وابتسمي يا قمر!'
      );
    } finally {
      setIsLoadingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Ahmed's Safe Haven */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-rose-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-rose-100">
              <Shield className="w-3.5 h-3.5 text-amber-200" />
              <span>ملاذ بسملة الآمن وحصن أحمد الحنون</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-marhey">
              هنا مفيش مكان للخوف أو الزعل يا أميرتي 💖
            </h2>
            <p className="text-xs sm:text-sm text-rose-50 leading-relaxed font-medium">
              كل ما تحسي بضغط المذاكرة أو الدنيا تقلت عليكي، تعالي هنا.. أحمد وبوسي مجهزينلك طبطبة وأمان وتشجيع لا ينتهي.
            </p>
          </div>

          <button
            onClick={() => setShowPanicModal(true)}
            className="bg-white hover:bg-rose-50 text-rose-600 font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all transform active:scale-95 flex items-center gap-2 text-xs sm:text-sm shrink-0 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 animate-bounce" />
            <span>أنا خايفة ومضغوطة.. احضني يا أحمد!</span>
          </button>
        </div>
      </div>

      {/* Mood Check-In Widget */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
          <Smile className="w-4 h-4 text-rose-500" />
          <span>حاسة بإيه دلوقتي يا نور عيون أحمد؟</span>
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          اختاري إحساسك، وبوسي هتديكي جرعة طبطبة مخصصة تريح قلبك:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.label;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.label)}
                className={`p-3 rounded-2xl text-xs font-bold transition-all text-center border cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200 scale-102'
                    : 'bg-rose-50/60 hover:bg-rose-100/70 text-stone-700 border-rose-100'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Selected Mood Tender Response Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-right space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>طبطبة فورية لقلب بسملة:</span>
            </span>
            <button
              onClick={() => speakTenderArabic(moodMessage)}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>اسمعي بصوت حنون</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
            {moodMessage}
          </p>
        </div>
      </div>

      {/* Two columns: Emergency Love Note Box & Guided Breathing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Box: Ahmed's Love Letters & Emergency Comfort Vault */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">صندوق الطبطبة وكلمات أحمد</h4>
                  <p className="text-[11px] text-rose-500 font-medium">رسائل نابعة من أعمق نقطة في قلبه</p>
                </div>
              </div>

              <button
                onClick={() => handleFetchNewLoveNote()}
                disabled={isLoadingNote}
                className="flex items-center gap-1 text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                title="طلب رسالة طبطبة جديدة"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingNote ? 'animate-spin' : ''}`} />
                <span>رسالة جديدة</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-50/50 to-pink-50/70 border border-rose-100 text-stone-800 text-xs sm:text-sm leading-relaxed min-h-[140px] flex items-center">
              {isLoadingNote ? (
                <div className="w-full text-center py-6 text-rose-500 font-bold text-xs animate-pulse">
                  أحمد بيكتبلك من قلبه كلام يدفي روحك...
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium italic">"{loveNote}"</p>
                  <p className="text-left text-[11px] font-bold text-rose-600">— حبيبك وسندك دائماً، أحمد 💖</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => handleFetchNewLoveNote('تشجيع للمذاكرة والامتحانات')}
              className="flex-1 py-2 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors cursor-pointer"
            >
              تشجيع للمذاكرة 📚
            </button>
            <button
              onClick={() => handleFetchNewLoveNote('طبطبة على تعب وإرهاق')}
              className="flex-1 py-2 text-[11px] font-bold bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-colors cursor-pointer"
            >
              طبطبة وتخفيف تعب 💆‍♀️
            </button>
            <button
              onClick={() => speakTenderArabic(loveNote)}
              className="px-3 py-2 text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
              title="سماع الرسالة"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Box: Guided Breathing with Ahmed's Pulse */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">تمرين التنفس مع نبض أحمد</h4>
                  <p className="text-[11px] text-rose-500 font-medium">لتصفية الذهن وتهدئة ضربات القلب</p>
                </div>
              </div>

              <button
                onClick={() => setIsBreathing(!isBreathing)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isBreathing
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                }`}
              >
                {isBreathing ? 'إيقاف التمرين' : 'ابدئي التمرين 🧘‍♀️'}
              </button>
            </div>

            {/* Breathing Animation Sphere */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Expanding outer circles */}
                <div
                  className={`w-36 h-36 rounded-full bg-gradient-to-tr from-rose-200 to-pink-300 transition-all duration-1000 flex items-center justify-center shadow-lg ${
                    isBreathing && breathPhase === 'شهيق'
                      ? 'scale-125 opacity-90'
                      : isBreathing && breathPhase === 'حبس النفس'
                      ? 'scale-125 opacity-100'
                      : 'scale-90 opacity-70'
                  }`}
                >
                  <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center text-center p-2 shadow-inner">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-warm-pulse mb-1" />
                    <span className="font-bold text-rose-700 text-sm font-marhey">
                      {isBreathing ? breathPhase : 'استرخي'}
                    </span>
                    {isBreathing && (
                      <span className="text-xs font-mono font-bold text-rose-500">
                        {breathCounter}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-center text-stone-600 max-w-xs font-medium">
                {isBreathing ? (
                  breathPhase === 'شهيق' ? (
                    'شهيق عميق.. استشعري أمان أحمد وحبه يملأ قلبك'
                  ) : breathPhase === 'حبس النفس' ? (
                    'اثبتي ثواني.. كل حاجة كويسة وأحمد في ضهرك'
                  ) : (
                    'زفير هادي وبطيء.. خرّجي كل التوتر والقلق بعيد'
                  )
                ) : (
                  'اضغطي ابدئي التمرين وغمضي عينك واتبعي الإيقاع لتهدئة أعصابك تماماً.'
                )}
              </p>
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] text-stone-400">
            تمرين تنفس 4-4-4 المهدئ للجهاز العصبي 🌸
          </div>
        </div>
      </div>

      {/* Panic Modal */}
      {showPanicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-rose-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-2xl shadow-inner">
              🫂💖
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-marhey text-rose-600">
              أحمد جنبك وحاضن قلبك يا بسملة!
            </h3>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-right space-y-2 text-xs sm:text-sm leading-relaxed text-stone-800">
              <p className="font-bold text-rose-800">اسمعيني كويس يا روح قلب أحمد:</p>
              <p>
                1. مفيش أي امتحان ولا أي مادة في الدنيا تسوى دمعة واحدة أو لحظة خوف في عيونك الحلوة دي.
              </p>
              <p>
                2. إنتي عملتي اللي عليكي وشاطرة جداً، وأحمد فخور بيكي وراضي عنك في كل الأحوال ومستحيل يزعلك.
              </p>
              <p>
                3. قومي دلوقتي اغسلي وشك بميه ساقعة، واشربي نص كوباية ميه، وسيبي المذاكرة نص ساعة كاملة.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  speakTenderArabic(
                    'يا روح قلب أحمد، اهدي خالص.. مفيش أي حاجة في الدنيا تخوفك وأنا في ضهرك، سيبي الكتب دلوقتي واشربي ميه واطمني يا أميرتي.'
                  );
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>اسمعي صوت الطمأنينة</span>
              </button>
              <button
                onClick={() => setShowPanicModal(false)}
                className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm cursor-pointer"
              >
                اطمنت يا أحمد 💕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
