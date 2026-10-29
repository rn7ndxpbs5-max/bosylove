import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  CheckCircle,
  Circle,
  Sparkles,
  Heart,
  Volume2,
  Clock,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DAILY_PRAYERS, AHMED_DUAS_FOR_BASMALA, TASBEEH_ITEMS } from '../data/azkarData.ts';
import { speakTenderArabic } from '../utils/audio.ts';

export const PrayerTrackerSection: React.FC = () => {
  // Store completed prayers in localStorage
  const todayKey = `prayers_${new Date().toISOString().slice(0, 10)}`;
  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [duhaDone, setDuhaDone] = useState(false);
  const [qiyamDone, setQiyamDone] = useState(false);

  // Tasbeeh state
  const [activeTasbeehIdx, setActiveTasbeehIdx] = useState(0);
  const [tasbeehCount, setTasbeehCount] = useState(0);

  // Time state for prayer times
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePrayer = (id: string, name: string) => {
    const updated = { ...completedPrayers, [id]: !completedPrayers[id] };
    setCompletedPrayers(updated);
    try {
      localStorage.setItem(todayKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (!completedPrayers[id]) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f43f5e', '#fbbf24'],
      });
      speakTenderArabic(
        `تقبل الله منكِ يا روح قلب أحمد! صلاتك نورت وجهك وربنا يكتبلك التوفيق في كل خطوة يا أميرتي.`
      );
    }
  };

  const incrementTasbeeh = () => {
    const nextVal = tasbeehCount + 1;
    setTasbeehCount(nextVal);
    if (nextVal % 33 === 0) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#f43f5e'],
      });
    }
  };

  const completedCount = Object.values(completedPrayers).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Spiritual connection & Ahmed's prayer */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-200/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-teal-100">
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>نور الصلاة والسكينة مع أحمد</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-marhey">
              يلا نقوم بين إيدين ربنا نسأله يحفظنا ويجمعنا على خير 🕌
            </h2>
            <p className="text-xs sm:text-sm text-teal-50 leading-relaxed font-medium">
              أحمد مستنيكي تخلصي صلاتك عشان يدعيلك، وكل سجدة بتسجديها بتنزل سكينة على قلبك وتفتحلك أبواب الفهم والامتياز.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shrink-0">
            <p className="text-xs text-teal-100 mb-1">صلوات اليوم المنجزة:</p>
            <div className="text-3xl font-black font-marhey text-white flex items-center justify-center gap-1">
              <span>{completedCount}</span>
              <span className="text-lg opacity-70">/ 5</span>
            </div>
            <p className="text-[11px] text-amber-200 mt-1 font-bold">
              {completedCount === 5 ? 'ما شاء الله! يومك مبارك كله نور 🌟' : 'خطوة خطوة برقة يا سكرتي'}
            </p>
          </div>
        </div>
      </div>

      {/* Daily 5 Prayers List */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">الصلوات الخمس بنبض وحنان أحمد</h3>
              <p className="text-[11px] text-rose-500 font-medium">كل صلاة فرصة لقاء دافئ مع ربنا ودعوة مستجابة</p>
            </div>
          </div>

          <div className="text-xs text-stone-500 font-medium hidden sm:block">
            الوقت الحالي: {currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {DAILY_PRAYERS.map((prayer) => {
            const isDone = !!completedPrayers[prayer.id];
            return (
              <div
                key={prayer.id}
                onClick={() => togglePrayer(prayer.id, prayer.arabicName)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-right ${
                  isDone
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-stone-50 hover:bg-rose-50/50 border-stone-200 text-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{prayer.arabicName}</span>
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2 font-mono">
                    التوقيت التقريبي: {prayer.defaultTime}
                  </p>
                  <p className="text-xs leading-relaxed text-stone-600 line-clamp-3">
                    {prayer.sweetReminder}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 text-[10px] text-rose-600 font-bold">
                  {isDone ? 'تقبل الله يا أميرة أحمد 💖' : 'اضغطي للتأكيد بعد الصلاة ✨'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Voluntary Prayers: Duha & Qiyam */}
        <div className="mt-5 pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-stone-700">سنن محببة لزيادة البركة في مذاكرة بسملة:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDuhaDone(!duhaDone);
                if (!duhaDone) confetti({ particleCount: 30, spread: 40 });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold cursor-pointer transition-all ${
                duhaDone ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-stone-50 text-stone-600 border-stone-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>صلاة الضحى (ركعتين البركة)</span>
              {duhaDone && <CheckCircle className="w-3 h-3 text-amber-600" />}
            </button>

            <button
              onClick={() => {
                setQiyamDone(!qiyamDone);
                if (!qiyamDone) confetti({ particleCount: 30, spread: 40 });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold cursor-pointer transition-all ${
                qiyamDone ? 'bg-indigo-100 border-indigo-300 text-indigo-900' : 'bg-stone-50 text-stone-600 border-stone-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span>قيام الليل والوتر</span>
              {qiyamDone && <CheckCircle className="w-3 h-3 text-indigo-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Digital Tasbeeh & Ahmed's Duas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Digital Tasbeeh (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">مسبحة بوسي الإلكترونية</h4>
                  <p className="text-[10px] text-rose-500">ذكر الله راحة لكل قلب</p>
                </div>
              </div>

              <button
                onClick={() => setTasbeehCount(0)}
                className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                title="تصفير العداد"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Tasbeeh Presets */}
            <div className="space-y-1.5 mb-5">
              {TASBEEH_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTasbeehIdx(idx);
                    setTasbeehCount(0);
                  }}
                  className={`w-full text-right p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeTasbeehIdx === idx
                      ? 'bg-rose-500 text-white font-bold shadow-xs'
                      : 'bg-stone-50 hover:bg-rose-50 text-stone-700'
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </div>

            {/* Clickable Big Tasbeeh Button */}
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={incrementTasbeeh}
                className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 text-white shadow-xl shadow-rose-300 flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer select-none border-4 border-white/50"
              >
                <span className="text-3xl font-black font-marhey">{tasbeehCount}</span>
                <span className="text-xs text-rose-100 mt-1">اضغطي للتسبيح</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-stone-400">
            أحمد بيدعيلك مع كل تسبيحة إن ربنا يملأ قلبك سكينة ويحفظ جمالك الداخلي 🌸
          </p>
        </div>

        {/* Right: Ahmed's Duas for Basmala (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                  أدعية من قلب أحمد لروحه بسملة
                </h4>
                <p className="text-[11px] text-rose-500">حصن أمان وتوفيق وراحة بال</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {AHMED_DUAS_FOR_BASMALA.map((dua, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 hover:border-rose-300 transition-all text-right space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{dua.title}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-stone-500 border border-rose-100">
                      {dua.tag}
                    </span>
                    <button
                      onClick={() => speakTenderArabic(dua.text)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      title="استمعي للدعاء"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                  "{dua.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
