import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  Smile,
  Moon,
  Crown,
  Mail,
  CloudRain,
  Waves,
} from 'lucide-react';
import { ActiveTab } from '../types/index.ts';
import { soundManager } from '../utils/audio.ts';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isPeriodMode: boolean;
  setIsPeriodMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPeriodMode,
  setIsPeriodMode,
}) => {
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);

  const toggleSound = (type: 'rain' | 'waves' | 'heartbeat') => {
    if (playingSound === type) {
      soundManager.stop();
      setPlayingSound(null);
    } else {
      if (type === 'rain') soundManager.playRain();
      if (type === 'waves') soundManager.playWaves();
      if (type === 'heartbeat') soundManager.playHeartbeat();
      setPlayingSound(type);
    }
  };

  const navItems = [
    {
      id: 'chat' as ActiveTab,
      label: 'شات ومذاكرة بوسي',
      sublabel: 'شرح مواد الفرقة الأولى',
      icon: BookOpen,
      badge: 'الذكاء الحنون',
    },
    {
      id: 'psychological' as ActiveTab,
      label: 'الناصح النفسي',
      sublabel: 'طبطبة ودعم عاطفي',
      icon: Smile,
      badge: 'أمان أحمد',
    },
    {
      id: 'prayers' as ActiveTab,
      label: 'متابع الصلوات',
      sublabel: 'القرب من الله والدعاء',
      icon: Moon,
      badge: 'سكينة',
    },
    {
      id: 'period' as ActiveTab,
      label: 'وضع الأميرة المتوجة',
      sublabel: 'متابع البريود والعناية',
      icon: Crown,
      badge: isPeriodMode ? 'مفعل 🌸' : 'دلع خاص',
    },
    {
      id: 'notes' as ActiveTab,
      label: 'نبض ورسائل أحمد',
      sublabel: 'كلام من القلب ليكي',
      icon: Mail,
      badge: 'حب أبدي',
    },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-rose-100/80 shadow-xs transition-colors duration-500">
      {/* Top micro-bar: Ahmed's pulse & Period Mode Toggle */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white px-3 sm:px-6 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2 truncate">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-200"></span>
          </span>
          <span className="font-marhey tracking-wide text-rose-50 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-rose-100 text-rose-100 animate-warm-pulse inline" />
            أحمد معكِ في كل نبضة وثانية.. أنتِ أميرتي وسر سعادتي
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Ambient Sound dropdown button */}
          <div className="relative">
            <button
              onClick={() => setSoundMenuOpen(!soundMenuOpen)}
              title="أصوات الاسترخاء والهدوء"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs text-white transition-all duration-200 cursor-pointer"
            >
              {playingSound ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-200" />
                  <span className="hidden sm:inline">صوت هادئ: {playingSound === 'rain' ? 'مطر' : playingSound === 'waves' ? 'أمواج' : 'نبض'}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-80" />
                  <span className="hidden sm:inline">أصوات استرخاء</span>
                </>
              )}
            </button>

            {soundMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-rose-100 p-2 text-stone-800 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[11px] font-bold text-rose-600 px-2 py-1 mb-1 border-b border-rose-50">أجواء استرخاء لبسملة 🎧</p>
                <button
                  onClick={() => { toggleSound('rain'); setSoundMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-right hover:bg-rose-50 transition-colors ${playingSound === 'rain' ? 'bg-rose-100 font-bold text-rose-700' : ''}`}
                >
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                  صوت مطر دافئ
                </button>
                <button
                  onClick={() => { toggleSound('waves'); setSoundMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-right hover:bg-rose-50 transition-colors ${playingSound === 'waves' ? 'bg-rose-100 font-bold text-rose-700' : ''}`}
                >
                  <Waves className="w-3.5 h-3.5 text-teal-500" />
                  أمواج هادئة ومريحة
                </button>
                <button
                  onClick={() => { toggleSound('heartbeat'); setSoundMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-right hover:bg-rose-50 transition-colors ${playingSound === 'heartbeat' ? 'bg-rose-100 font-bold text-rose-700' : ''}`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  نبضات أمان أحمد
                </button>
                {playingSound && (
                  <button
                    onClick={() => { soundManager.stop(); setPlayingSound(null); setSoundMenuOpen(false); }}
                    className="w-full text-center text-[11px] text-stone-400 hover:text-stone-600 pt-1 mt-1 border-t border-rose-50"
                  >
                    إيقاف الصوت
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Period Mode Toggle */}
          <button
            onClick={() => setIsPeriodMode(!isPeriodMode)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 shadow-xs cursor-pointer ${
              isPeriodMode
                ? 'bg-rose-100 text-rose-800 ring-2 ring-white ring-offset-1 ring-offset-rose-500 scale-105'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="تفعيل وضع الدلع والراحة في أيام الدورة والتعب"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden xs:inline">وضع الدلع والراحة</span>
            <span className="xs:hidden">دلع</span>
            {isPeriodMode && <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
          </button>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-0.5 shadow-md shadow-rose-200">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span className="text-2xl filter drop-shadow-xs">💖</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -left-1 bg-rose-500 text-white rounded-full p-0.5 text-[10px] font-bold shadow-xs">
              <Crown className="w-3 h-3 text-amber-200" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-marhey bg-gradient-to-l from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                بوسي بسملة
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                دلوعة قلب أحمد & دكتورة بوسي
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-0.5">
              <span>الملاذ الآمن والرفيق الذكي لبسملة في كل ثانية من يومها</span>
              <span className="inline-block text-rose-400">✨</span>
            </p>
          </div>
        </div>

        {/* Ahmed's tender status */}
        <div className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-2xl px-3.5 py-2">
          <div className="text-right">
            <p className="text-xs font-bold text-rose-900">أحمد يقول لكِ:</p>
            <p className="text-[11px] text-rose-700 font-medium">"يا روح قلبي، متشيليش هم المذاكرة.. إحنا قدّها وزيادة!"</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 shadow-xs shrink-0">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 space-x-reverse overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 font-bold scale-[1.02]'
                    : 'text-stone-600 hover:text-rose-600 hover:bg-rose-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-rose-400'}`} />
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
