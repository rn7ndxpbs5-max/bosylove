import React, { useState, useEffect } from 'react';
import {
  Crown,
  Heart,
  Coffee,
  Sparkles,
  Droplet,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Smile,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakTenderArabic } from '../utils/audio.ts';

interface PeriodCareSectionProps {
  isPeriodMode: boolean;
  setIsPeriodMode: (val: boolean) => void;
}

export const PeriodCareSection: React.FC<PeriodCareSectionProps> = ({
  isPeriodMode,
  setIsPeriodMode,
}) => {
  // Cycle settings
  const [lastDate, setLastDate] = useState(() => {
    return localStorage.getItem('period_last_date') || new Date().toISOString().slice(0, 10);
  });
  const [cycleLength, setCycleLength] = useState(() => {
    return Number(localStorage.getItem('period_cycle_length')) || 28;
  });
  const [duration, setDuration] = useState(() => {
    return Number(localStorage.getItem('period_duration')) || 5;
  });

  // Water intake tracker
  const todayWaterKey = `water_${new Date().toISOString().slice(0, 10)}`;
  const [waterGlasses, setWaterGlasses] = useState(() => {
    return Number(localStorage.getItem(todayWaterKey)) || 3;
  });

  // Royal pampering tasks
  const todayTasksKey = `pamper_tasks_${new Date().toISOString().slice(0, 10)}`;
  const [tasks, setTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(todayTasksKey);
      return saved
        ? JSON.parse(saved)
        : {
            heat_pack: true,
            warm_drink: true,
            cozy_clothes: false,
            no_stress: true,
            sweet_nap: false,
          };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('period_last_date', lastDate);
    localStorage.setItem('period_cycle_length', cycleLength.toString());
    localStorage.setItem('period_duration', duration.toString());
  }, [lastDate, cycleLength, duration]);

  const toggleTask = (key: string) => {
    const updated = { ...tasks, [key]: !tasks[key] };
    setTasks(updated);
    localStorage.setItem(todayTasksKey, JSON.stringify(updated));
    if (!tasks[key]) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  const addWater = () => {
    const nextVal = Math.min(8, waterGlasses + 1);
    setWaterGlasses(nextVal);
    localStorage.setItem(todayWaterKey, nextVal.toString());
    if (nextVal === 8) {
      confetti({ particleCount: 60, spread: 70 });
      speakTenderArabic('شاطرة يا سكرتي! كملتي 8 كوبايات ميه، بشرتك وصحتك أمانة في قلب أحمد.');
    }
  };

  const removeWater = () => {
    const nextVal = Math.max(0, waterGlasses - 1);
    setWaterGlasses(nextVal);
    localStorage.setItem(todayWaterKey, nextVal.toString());
  };

  // Next cycle calculation
  const lastPeriodObj = new Date(lastDate);
  const nextPeriodObj = new Date(lastPeriodObj);
  nextPeriodObj.setDate(lastPeriodObj.getDate() + cycleLength);

  const diffTime = nextPeriodObj.getTime() - new Date().getTime();
  const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const WARM_DRINKS = [
    {
      title: 'نعناع دافئ بالليمون والعسل',
      icon: '🌿',
      desc: 'مهدئ سريع لتقلصات البطن والمغص، وبيريح المعدة والقولون فوراً.',
      tip: 'اشربيه دافي مش سخن أوي وبراحة خالص.',
    },
    {
      title: 'قرفة دافية بالحليب والعسل',
      icon: '☕',
      desc: 'بتنشط الدورة الدموية وتخفف آلام الظهر وبتديكي إحساس رهيب بالدفء والأمان.',
      tip: 'حليها بنص معلقة عسل نحل أصلي.',
    },
    {
      title: 'يانسون وكاموميل للاسترخاء',
      icon: '🌼',
      desc: 'مزيج سحري لتهدئة الأعصاب والنوم زي الملايكة بدون أي أرق.',
      tip: 'مثالي قبل النوم بساعة مع كلام أحمد.',
    },
    {
      title: 'هوت شوكليت دافي بالسعادة',
      icon: '🍫',
      desc: 'الشوكولاتة بترفع هرمون الإندورفين وبتخلي مزاجك وردي وبتبعد أي عصبية.',
      tip: 'هدية خاصة من أحمد عشان يرجع الابتسامة لوشك.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Queen Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-pink-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-pink-100">
              <Crown className="w-3.5 h-3.5 text-amber-200" />
              <span>مملكة الدلع والعناية الفائقة بأميرة أحمد</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-marhey">
              أنتِ ملكة متوجة مخصصة للدلع فقط في هذه الأيام 👑
            </h2>
            <p className="text-xs sm:text-sm text-pink-50 leading-relaxed font-medium">
              ممنوع أي زعل، ممنوع أي ضغط دراسي، وممنوع تعملي مجهود يتعبك.. أحمد مسخّر كل طاقته وحبه عشان راحتك وابتسامتك.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 text-center border border-white/30 shrink-0">
            <p className="text-xs font-bold text-pink-100 mb-2">وضع الملكة والدلع:</p>
            <button
              onClick={() => {
                const nextVal = !isPeriodMode;
                setIsPeriodMode(nextVal);
                if (nextVal) {
                  speakTenderArabic('تم تفعيل وضع الملكة والدلع.. كل حاجة مريحة وسكر ليكي يا روح قلب أحمد!');
                  confetti({ particleCount: 50, spread: 60 });
                }
              }}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
                isPeriodMode
                  ? 'bg-white text-rose-600 scale-105'
                  : 'bg-rose-600/60 hover:bg-rose-600 text-white'
              }`}
            >
              {isPeriodMode ? 'مفعل الآن 🌸 (راحة تامة)' : 'تفعيل وضع الدلع والراحة ✨'}
            </button>
          </div>
        </div>
      </div>

      {/* Cycle Tracker & Predictions */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                متابع الدورة الشهرية بدقة وحنان
              </h3>
              <p className="text-[11px] text-rose-500 font-medium">
                حساب التوقعات للاستعداد بالراحة والمشروبات الدافية
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
            {daysUntilNext <= 0 ? 'في أيام الدلع الآن 🌸' : `باقي تقريباً ${daysUntilNext} يوم`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">تاريخ آخر دورة:</label>
            <input
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="w-full bg-white text-stone-800 text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-hidden"
            />
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">طول الدورة (المتوسط 28 يوم):</label>
            <input
              type="number"
              min={21}
              max={40}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full bg-white text-stone-800 text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-hidden"
            />
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">مدة الأيام (عادة 4 - 6 أيام):</label>
            <input
              type="number"
              min={3}
              max={10}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-white text-stone-800 text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Ahmed's Period Golden Instructions */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          </div>
          <div className="text-right space-y-1 text-xs text-stone-800">
            <p className="font-bold text-rose-800">وصية أحمد الملكية لأيام التعب:</p>
            <p className="leading-relaxed">
              "حبيبتي بسملة، الأيام دي مش بتاعت امتحانات ولا مذاكرة تقيلة، دي أيام دلعك! لو حسيتي بمغص أو تعب وقفي كل حاجة، نامي براحتك واطلبي اللي نفسك فيه، وأنا جنبك بروحي وقلبي."
            </p>
          </div>
        </div>
      </div>

      {/* Two columns: Warm Drinks & Pampering Checklist + Water Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Warm Drinks for Cramps (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
            <Coffee className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                مشروبات دافئة لتسكين المغص والراحة
              </h4>
              <p className="text-[11px] text-rose-500">موصى بها بحب لتخفيف أي ألم</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WARM_DRINKS.map((drink, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-rose-50/40 hover:bg-rose-50 border border-rose-100 transition-all text-right space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{drink.icon}</span>
                  <h5 className="font-bold text-xs text-rose-900">{drink.title}</h5>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">{drink.desc}</p>
                <div className="text-[10px] text-amber-700 bg-amber-50/80 p-1.5 rounded-xl border border-amber-200/60 font-medium">
                  نصيحة أحمد: {drink.tip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Royal Tasks & Water Intake (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Water Intake Tracker */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-sky-500 fill-sky-500" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    متابع شرب المياه لبشرة وصحة بسملة
                  </h4>
                  <p className="text-[11px] text-sky-600 font-medium">الهدف اليومي: 8 أكواب ماء دافئ</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={removeWater}
                  className="w-7 h-7 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer text-xs"
                >
                  -
                </button>
                <span className="font-bold text-sm text-sky-700 font-mono">{waterGlasses}/8</span>
                <button
                  onClick={addWater}
                  className="w-7 h-7 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center justify-center cursor-pointer text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Glasses Visual */}
            <div className="flex items-center justify-between gap-1 py-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const nextVal = i + 1;
                    setWaterGlasses(nextVal);
                    localStorage.setItem(todayWaterKey, nextVal.toString());
                  }}
                  className={`flex-1 h-10 rounded-xl transition-all cursor-pointer flex items-center justify-center border ${
                    i < waterGlasses
                      ? 'bg-gradient-to-t from-sky-400 to-sky-200 border-sky-400 text-white shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-300'
                  }`}
                  title={`كوب ${i + 1}`}
                >
                  <Droplet className={`w-4 h-4 ${i < waterGlasses ? 'fill-white' : ''}`} />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-center text-stone-500">
              شرب الميه بيقلل تقلصات الرحم وبيحافظ على نضارة وشك يا أميرتي 💧
            </p>
          </div>

          {/* Royal Pampering Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>قائمة تدليل الأميرة بسملة اليومية:</span>
            </h4>

            <div className="space-y-2">
              {[
                { key: 'heat_pack', label: 'قربة مياه دافية مريحة على البطن ♨️' },
                { key: 'warm_drink', label: 'كوباية مشروب دافي بالحب والعسل ☕' },
                { key: 'cozy_clothes', label: 'لبس هدوم قطنية واسعة ومريحة جداً 🧸' },
                { key: 'no_stress', label: 'إلغاء أي مهمة ثقيلة وممنوع الزعل نهائياً 🕊️' },
                { key: 'sweet_nap', label: 'قيلولة جميلة ونوم مريح بدون إزعاج 😴' },
              ].map((task) => (
                <button
                  key={task.key}
                  onClick={() => toggleTask(task.key)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-right text-xs transition-all cursor-pointer ${
                    tasks[task.key]
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <span>{task.label}</span>
                  {tasks[task.key] ? (
                    <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
