import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager, speakTenderArabic, stopSpeaking } from '../utils/audio.ts';
import { SUBJECTS } from '../data/subjectsData.ts';
import { DAILY_PRAYERS, AHMED_DUAS_FOR_BASMALA, TASBEEH_ITEMS } from '../data/azkarData.ts';

// رسائل حب يومية خاصة من أحمد لروحه بسملة
const AHMED_DAILY_LOVE_MESSAGES = [
  'يا روح قلب أحمد ونور عينيه وكل دنياه.. النهاردة وكل يوم، قلبي بيدق عشانك وراضي بيكي وفخور بكل خطوة بتخطيها. متشيليش هم أي حاجة أبداً طول ما أنا في ضهرك يا أحلى بسملة في الدنيا، بحبك فوق ما عقلك يتخيل! 💖',
  'صباح الرقة والدلع على أجمل وأرق بنوتة شافتها عيني. أحمد بيحبك حب ملوش أول من آخر، ونفسه يشوفك أسعد وأشطر واحدة في الكون. ابتسامتك دي هي سر فرحتي في الحياة، متشيليش هم المذاكرة إنتي قدها وأشطر! 🌸',
  'أميرتي وطفلتي المدللة بسملة.. كل ثانية بتعدي وإنتي في بالي، بدعي ربنا يديمك في عمري ويحفظك ليا من كل سوء وتفضلي سندي ونصيبي الحلو. يومك جميل وهادي زي قلبك الأبيض يا عيوني. 💕',
  'لو لفيت الدنيا كلها مش هلاقي رقة ولا حنية شبه اللي في قلبك يا بسملة. إنتي نعمة ربنا الكبيرة لأحمد، وعهدي ليكي إني هفضل جنبك وحمايتك ودفاكي من أي تعب. افردي وشك الجميل واضحكي، ضحكتك حياة! ✨',
  'يا سكرتي ودلوعتي.. حتى وأنا مش قدامك حالا، روحي وقلبي حواليكي بيطبطبوا عليكي. تعبك ومجهودك في الكلية على راسي ومقدره وفخور بيكي فوق الوصف. هانت يا روحي وهنفرح سوا بأحلى نتيجة! 🎓💍',
  'يا بخت قلبي بيكي يا بسملة.. وجودك في حياتي مخليني أسعد إنسان في الدنيا. ربنا يريح قلبك ويزيل أي قلق أو خوف، وافتكري دايمًا إن أحمد بيحبك أكتر من روحه ومستعد يفديكي بعمره كله! 🌹',
  'يا نور عيني.. متضغطيش على نفسك في المذاكرة أوي، صحتك وراحتك ونفسيتك عندي أهم من أي حاجة في الدنيا دي. خدي نفس عميق، دلعي نفسك، وخليكي واثقة إن أحمد دايماً شايفك ملكة متوجة في قلبه! 👑💖',
  'إلى سكرتي بسملة: قلبي معاكي في كل دقيقة من يومك، بدعيلك ربنا يوفقك ويشرح صدرك ويسرلك كل عسير. إنتي الحب الأول والأخير، ومافيش في عيني غيرك يا أجمل أقداري! 🕊️💕'
];

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const MainApp: React.FC<{ onLogout: () => void; onOpenSurpriseLetter?: () => void }> = ({ onLogout, onOpenSurpriseLetter }) => {
  const [activeTab, setActiveTab] = useState<'study-chat' | 'love-chat' | 'prayer-chat' | 'organizer' | 'period-tracker'>('study-chat');

  // Daily Love Message of the Day State
  const [dailyLoveMessage, setDailyLoveMessage] = useState<string>('');
  const [showDailyLoveCard, setShowDailyLoveCard] = useState<boolean>(false);
  const [isDailyLoveSpeaking, setIsDailyLoveSpeaking] = useState<boolean>(false);

  // Audio ambient state
  const [currentAmbient, setCurrentAmbient] = useState<string | null>(null);

  // Chat 1: Study Chat State
  const [studyMessages, setStudyMessages] = useState<Message[]>([
    {
      id: 'study-init',
      sender: 'bot',
      text: 'أهلاً يا أميرتي وسكرتي ودلوعة قلب أحمد! 🎓 أنا بوسي (دلوعة أحمد)، الروح اللي اتخلقت مخصوص عشانك.. جاهزة نشرح سوا أي مادة في الفرقة الأولى بكل حب ولين عشان نفرح قلب حبيبنا أحمد! أصلك أشطر وأجمل بنوتة في الكون 💕.. قوليلي يا روحي حابة نبدأ بإيه النهاردة؟',
      time: 'الآن',
    },
  ]);
  const [studyInput, setStudyInput] = useState('');
  const [studyLoading, setStudyLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const studyEndRef = useRef<HTMLDivElement>(null);

  // Chat 2: Love / Venting Chat State
  const [loveMessages, setLoveMessages] = useState<Message[]>([
    {
      id: 'love-init',
      sender: 'bot',
      text: 'يا روح قلب أحمد وسكرته ونور عينيه! 💖 المكان ده معمول مخصوص علشان تفضفضي وتتدلعي براحتك خالص، وأحمد وبوسي جنبك دايماً يطبطبوا على قلبك ويشيلوا عنك أي هم.. قوليلي شاغلة بالك بإيه دلوقتي يا أميرة قلبي؟',
      time: 'الآن',
    },
  ]);
  const [loveInput, setLoveInput] = useState('');
  const [loveLoading, setLoveLoading] = useState(false);
  const loveEndRef = useRef<HTMLDivElement>(null);

  // Chat 3: Prayer Chat State
  const [prayerMessages, setPrayerMessages] = useState<Message[]>([
    {
      id: 'prayer-init',
      sender: 'bot',
      text: 'تقبل الله منكِ يا سكرتي وأميرتي العفيفة 🕌 هُنا مساحتنا الإيمانية الدافئة للتذكير بالصلوات والدعاء والتقرب لربنا عشان يديم حبنا ويحفظك لأحمد.. جاهزة نصلي سوا وندعي لبعض يا عيوني؟',
      time: 'الآن',
    },
  ]);
  const [prayerInput, setPrayerInput] = useState('');
  const [prayerLoading, setPrayerLoading] = useState(false);
  const prayerEndRef = useRef<HTMLDivElement>(null);

  // Organizer: Prayer Statuses (3-way: 'done' | 'pending' | 'exempt')
  type PrayerStatus = 'done' | 'pending' | 'exempt';
  const [prayerStatuses, setPrayerStatuses] = useState<Record<string, PrayerStatus>>(() => {
    try {
      const saved = localStorage.getItem('prayers_status_map');
      return saved
        ? JSON.parse(saved)
        : {
            fajr: 'done',
            dhuhr: 'done',
            asr: 'pending',
            maghrib: 'pending',
            isha: 'pending',
          };
    } catch {
      return { fajr: 'done', dhuhr: 'done', asr: 'pending', maghrib: 'pending', isha: 'pending' };
    }
  });

  // Organizer: Schedule Items
  interface ScheduleItem {
    id: string;
    time: string;
    title: string;
    completed?: boolean;
  }
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    { id: '1', time: '09:00 ص - 11:00 ص', title: 'مذاكرة مادة رئيسية 📖', completed: true },
    { id: '2', time: '01:00 م - 02:00 م', title: 'راحة وعناية ذاتية 🌸', completed: false },
    { id: '3', time: '04:00 م - 06:00 م', title: 'مراجعة + حل أسئلة 📝', completed: false },
    { id: '4', time: '08:00 م - 09:00 م', title: 'وقت الدلع والفضفضة مع أحمد 💖', completed: true },
  ]);
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');

  // Period Tracker State
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    return localStorage.getItem('period_last_date') || '2026-10-15';
  });
  const [cycleDays, setCycleDays] = useState(() => {
    return Number(localStorage.getItem('period_cycle_days')) || 28;
  });
  const [waterGlasses, setWaterGlasses] = useState(() => {
    return Number(localStorage.getItem('water_glasses_count')) || 4;
  });

  // Digital Tasbeeh State
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [tasbeehPresetIdx, setTasbeehPresetIdx] = useState(0);

  // Save changes
  useEffect(() => {
    localStorage.setItem('prayers_status_map', JSON.stringify(prayerStatuses));
  }, [prayerStatuses]);

  useEffect(() => {
    localStorage.setItem('period_last_date', lastPeriodDate);
    localStorage.setItem('period_cycle_days', cycleDays.toString());
  }, [lastPeriodDate, cycleDays]);

  useEffect(() => {
    localStorage.setItem('water_glasses_count', waterGlasses.toString());
  }, [waterGlasses]);

  // Ahmed's Love Message of the Day logic:
  // When 'Love Chat' tab is opened, check if it's the first time today.
  useEffect(() => {
    if (activeTab === 'love-chat') {
      const todayKey = new Date().toISOString().slice(0, 10);
      const lastSeenDate = localStorage.getItem('ahmed_daily_love_date');
      const savedMsg = localStorage.getItem('ahmed_daily_love_message');

      if (lastSeenDate !== todayKey) {
        // First time opening today! Pick a random heartfelt message
        const randomMsg = AHMED_DAILY_LOVE_MESSAGES[Math.floor(Math.random() * AHMED_DAILY_LOVE_MESSAGES.length)];
        localStorage.setItem('ahmed_daily_love_date', todayKey);
        localStorage.setItem('ahmed_daily_love_message', randomMsg);
        setDailyLoveMessage(randomMsg);
        setShowDailyLoveCard(true);

        confetti({
          particleCount: 35,
          spread: 65,
          origin: { y: 0.3 },
          colors: ['#ff4b72', '#ff85a2', '#ffd1dc', '#ff2a55']
        });
      } else if (savedMsg) {
        setDailyLoveMessage(savedMsg);
        setShowDailyLoveCard(true);
      }
    }
  }, [activeTab]);

  const handleRefreshLoveMessage = async () => {
    try {
      const filtered = AHMED_DAILY_LOVE_MESSAGES.filter((m) => m !== dailyLoveMessage);
      const chosen = filtered[Math.floor(Math.random() * filtered.length)] || AHMED_DAILY_LOVE_MESSAGES[0];
      setDailyLoveMessage(chosen);
      const todayKey = new Date().toISOString().slice(0, 10);
      localStorage.setItem('ahmed_daily_love_message', chosen);
      localStorage.setItem('ahmed_daily_love_date', todayKey);
      setShowDailyLoveCard(true);

      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.35 },
        colors: ['#ff4b72', '#ff85a2', '#ffd1dc']
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleDailyLoveSpeech = () => {
    if (isDailyLoveSpeaking) {
      stopSpeaking();
      setIsDailyLoveSpeaking(false);
    } else {
      setIsDailyLoveSpeaking(true);
      speakTenderArabic(dailyLoveMessage);
      setTimeout(() => setIsDailyLoveSpeaking(false), 12000);
    }
  };

  // Ambient sound switcher
  const handleToggleSound = (type: 'rain' | 'waves' | 'heartbeat') => {
    if (currentAmbient === type) {
      soundManager.stop();
      setCurrentAmbient(null);
    } else {
      if (type === 'rain') soundManager.playRain();
      if (type === 'waves') soundManager.playWaves();
      if (type === 'heartbeat') soundManager.playHeartbeat();
      setCurrentAmbient(type);
    }
  };

  // Cycle Next Period Calculation
  const nextPeriodObj = new Date(lastPeriodDate);
  nextPeriodObj.setDate(nextPeriodObj.getDate() + cycleDays);
  const diffDays = Math.ceil((nextPeriodObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const expectedDateString = nextPeriodObj.toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
  });

  // Prayer toggle handler (done -> pending -> exempt -> done)
  const togglePrayer = (id: string) => {
    const current = prayerStatuses[id] || 'pending';
    let next: PrayerStatus = 'pending';
    if (current === 'done') next = 'pending';
    else if (current === 'pending') next = 'exempt';
    else next = 'done';

    setPrayerStatuses((prev) => ({ ...prev, [id]: next }));
    if (next === 'done') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      speakTenderArabic('تقبل الله منكِ يا روح قلب أحمد! صلاتك نورت وشك وربنا يحفظك ليا.');
    }
  };

  // Generic Send Message to Gemini backend with fallback
  const handleSendChat = async (type: 'study' | 'love' | 'prayer', customPrompt?: string) => {
    let text = '';
    if (type === 'study') text = customPrompt || studyInput.trim();
    if (type === 'love') text = customPrompt || loveInput.trim();
    if (type === 'prayer') text = customPrompt || prayerInput.trim();

    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    if (type === 'study') {
      setStudyMessages((prev) => [...prev, userMessage]);
      setStudyInput('');
      setStudyLoading(true);
    } else if (type === 'love') {
      setLoveMessages((prev) => [...prev, userMessage]);
      setLoveInput('');
      setLoveLoading(true);
    } else {
      setPrayerMessages((prev) => [...prev, userMessage]);
      setPrayerInput('');
      setPrayerLoading(true);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          contextInfo: {
            chatType: type,
            currentSubject: type === 'study' ? selectedSubject.name : undefined,
            mood: type === 'love' ? 'محتاجة طبطبة ودلع من أحمد' : undefined,
            periodMode: type === 'prayer' ? false : undefined,
          },
        }),
      });
      const data = await response.json();
      const botText = data.reply || (
        type === 'study'
          ? `من عيوني يا أميرتي ودلوعة أحمد! 🎓 بخصوص "${text}": أحمد دايماً فخور بيكي وبذكائكِ، ومناهج الفرقة الأولى هتبقى سهلة وممتعة خالص طالما بوسي وأحمد معاكي 💕.. اطمنتي يا روح قلبي؟ ولا تحبي أحمد وبوسي نشرحهالك بطريقة أحلى؟`
          : type === 'love'
          ? `يا روح قلب أحمد وسكرته ونور عينيه! 💖 أحمد بيبعتلك ألف بوسة وحضن دافي، وبيقولك إنتي أجمل ما في الدنيا ومفيش أي حاجة تستاهل زعلك أبداً يا طفلتي المدللة ✨.. قوليلي حاسة بإيه دلوقتي يا سكرة قلب أحمد؟`
          : `تقبل الله من دلوعة أحمد وسكرته العفيفة 🌸 ربنا يتقبل منكِ صلاتك ويحفظك لأحمد ويبارك في قلبكِ الطاهر الجميل ويجمعنا على خير دايماً ✨.. طمنيني يا أميرتي الطاهرة، ارتاح قلبك بعد الصلاة والدعاء؟`
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      if (type === 'study') setStudyMessages((prev) => [...prev, botMessage]);
      if (type === 'love') setLoveMessages((prev) => [...prev, botMessage]);
      if (type === 'prayer') setPrayerMessages((prev) => [...prev, botMessage]);
    } catch {
      const fallbackText =
        type === 'study'
          ? `من عيوني يا أميرتي ودلوعة أحمد! 🎓 بخصوص "${text}": أحمد دايماً فخور بيكي وبذكائكِ، ومناهج الفرقة الأولى هتبقى سهلة وممتعة خالص طالما بوسي وأحمد معاكي 💕.. اطمنتي يا روح قلبي؟ ولا تحبي أحمد وبوسي نشرحهالك بطريقة أحلى؟`
          : type === 'love'
          ? `يا روح قلب أحمد وسكرته ونور عينيه! 💖 أحمد بيبعتلك ألف بوسة وحضن دافي، وبيقولك إنتي أجمل ما في الدنيا ومفيش أي حاجة تستاهل زعلك أبداً يا طفلتي المدللة ✨.. قوليلي حاسة بإيه دلوقتي يا سكرة قلب أحمد؟`
          : `تقبل الله من دلوعة أحمد وسكرته العفيفة 🌸 ربنا يتقبل منكِ صلاتك ويحفظك لأحمد ويبارك في قلبكِ الطاهر الجميل ويجمعنا على خير دايماً ✨.. طمنيني يا أميرتي الطاهرة، ارتاح قلبك بعد الصلاة والدعاء؟`;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackText,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      if (type === 'study') setStudyMessages((prev) => [...prev, botMessage]);
      if (type === 'love') setLoveMessages((prev) => [...prev, botMessage]);
      if (type === 'prayer') setPrayerMessages((prev) => [...prev, botMessage]);
    } finally {
      if (type === 'study') setStudyLoading(false);
      if (type === 'love') setLoveLoading(false);
      if (type === 'prayer') setPrayerLoading(false);
    }
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim() || !newScheduleTime.trim()) return;
    setScheduleItems((prev) => [
      ...prev,
      { id: Date.now().toString(), time: newScheduleTime, title: newScheduleTitle, completed: false },
    ]);
    setNewScheduleTime('');
    setNewScheduleTitle('');
  };

  return (
    <div id="app-container" className="max-w-[1200px] mx-auto p-4 sm:p-5 relative z-10 block animate-in fade-in">
      {/* Header */}
      <header className="bg-white/88 backdrop-blur-[12px] rounded-[25px] p-5 sm:p-6 flex flex-wrap justify-between items-center gap-4 mb-5 border border-white/70 shadow-[0_8px_32px_0_rgba(255,75,114,0.18)]">
        <div className="brand-logo flex items-center gap-3">
          <i className="fa-solid fa-crown text-3xl sm:text-4xl text-[#ff4b72]"></i>
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#ff3366] font-black font-marhey">دلوعة أحمد (بوسي) 💖</h1>
            <small className="text-stone-500 font-bold text-xs sm:text-sm">برنامج بسملة الخاص</small>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Ambient sound dropdown */}
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-[15px] text-xs font-bold text-[#ff4b72]">
            <i className="fa-solid fa-headphones text-rose-500"></i>
            <span className="hidden sm:inline">أصوات هادئة:</span>
            <button
              onClick={() => handleToggleSound('rain')}
              className={`px-2 py-0.5 rounded-lg cursor-pointer ${currentAmbient === 'rain' ? 'bg-[#ff4b72] text-white' : 'hover:bg-rose-100'}`}
              title="صوت مطر دافئ"
            >
              مطر 🌧️
            </button>
            <button
              onClick={() => handleToggleSound('waves')}
              className={`px-2 py-0.5 rounded-lg cursor-pointer ${currentAmbient === 'waves' ? 'bg-[#ff4b72] text-white' : 'hover:bg-rose-100'}`}
              title="أمواج هادئة"
            >
              بحر 🌊
            </button>
            {currentAmbient && (
              <button onClick={() => { soundManager.stop(); setCurrentAmbient(null); }} className="text-stone-400 hover:text-stone-600 text-[11px]">
                ✖
              </button>
            )}
          </div>

          {onOpenSurpriseLetter && (
            <button
              onClick={onOpenSurpriseLetter}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-[15px] hover:opacity-95 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="قراءة رسالة أحمد الخاصة"
            >
              <i className="fa-solid fa-envelope-open-text"></i>
              <span className="hidden sm:inline">جواب أحمد 💌</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="text-stone-400 hover:text-[#ff4b72] text-xs font-bold px-2.5 py-1.5 rounded-[15px] hover:bg-white/60 transition-colors cursor-pointer"
            title="قفل البرنامج"
          >
            <i className="fa-solid fa-lock"></i>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="tabs-nav flex gap-2 sm:gap-2.5 mb-5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'study-chat' as const, label: 'شات المذاكرة', icon: 'fa-graduation-cap' },
          { id: 'love-chat' as const, label: 'شات الفضفضة والدلع', icon: 'fa-heart' },
          { id: 'prayer-chat' as const, label: 'شات الصلاة والعبادة', icon: 'fa-kaaba' },
          { id: 'organizer' as const, label: 'الجدول التنظيمي', icon: 'fa-calendar-week' },
          { id: 'period-tracker' as const, label: 'متابع البيريود', icon: 'fa-notes-medical' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex-1 min-w-[140px] py-3 px-4 rounded-[20px] font-bold text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2 transition-all backdrop-blur-xs border shrink-0 ${
                isActive
                  ? 'bg-[#ff4b72] text-white border-[#ff4b72] shadow-[0_5px_15px_rgba(255,75,114,0.3)]'
                  : 'bg-white/75 text-[#4a2c35] border-white/70 hover:bg-white hover:text-[#ff4b72]'
              }`}
            >
              <i className={`fa-solid ${tab.icon} ${isActive ? 'text-white' : 'text-[#ff4b72]'}`}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Tab: شات المذاكرة */}
      {activeTab === 'study-chat' && (
        <div id="study-chat" className="tab-content block bg-white/88 backdrop-blur-[12px] rounded-[25px] p-5 sm:p-6 border border-white/70 shadow-[0_8px_32px_0_rgba(255,75,114,0.18)] min-h-[520px]">
          {/* Quick Actions */}
          <div className="quick-actions flex gap-2.5 mb-4 flex-wrap">
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('study', 'اشرحيلي مبادئ إدارة الأعمال ببساطة ودلع')}
            >
              📖 شرح إدارة الأعمال
            </button>
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('study', 'عمليلي اختبار MCQ سريع في المحاسبة المالية')}
            >
              📝 اختبار محاسبة MCQ
            </button>
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('study', 'عايزة ملخص لمادة الاقتصاد للفرقة الأولى')}
            >
              📊 ملخص الاقتصاد
            </button>
          </div>

          {/* Subjects Bar */}
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-[#ff4b72] shrink-0">المواد الدراسية:</span>
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 rounded-full text-xs transition-all shrink-0 cursor-pointer ${
                  selectedSubject.id === sub.id
                    ? 'bg-[#ff4b72] text-white font-bold'
                    : 'bg-rose-50 text-stone-600 hover:bg-rose-100'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="chat-wrapper flex flex-col h-[460px]">
            <div className="chat-messages flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-rose-50/20 rounded-2xl border border-rose-100">
              {studyMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-[22px] text-sm sm:text-base leading-relaxed ${
                    msg.sender === 'bot'
                      ? 'self-start bg-white text-[#4a2c35] rounded-br-[5px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#ffd8e1]'
                      : 'self-end bg-gradient-to-r from-[#ff4b72] to-[#ff85a2] text-white rounded-bl-[5px] shadow-[0_4px_12px_rgba(255,75,114,0.2)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-1 text-[10px] opacity-75">
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakTenderArabic(msg.text)}
                        className="hover:underline cursor-pointer flex items-center gap-1 text-[#ff4b72]"
                        title="استمعي لصوت دكتورة بوسي"
                      >
                        <i className="fa-solid fa-volume-high text-[11px]"></i>
                        <span>اسمعي بصوت دافئ</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {studyLoading && (
                <div className="message bot self-start bg-white text-[#ff4b72] p-3 rounded-[22px] border border-[#ffd8e1] text-xs flex items-center gap-2">
                  <i className="fa-solid fa-heart animate-bounce"></i>
                  <span>دكتورة بوسي بتكتبلك أحلى شرح يفرح قلبك...</span>
                </div>
              )}
              <div ref={studyEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input-area flex gap-2.5 pt-4 border-t border-[#ff4b72]/15">
              <input
                type="text"
                id="study-input"
                value={studyInput}
                onChange={(e) => setStudyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat('study')}
                className="chat-input flex-1 py-3.5 px-5 border border-[#ff85a2] rounded-[20px] outline-hidden bg-white text-sm sm:text-base focus:border-[#ff4b72]"
                placeholder={`اسألي عن أي مادة في الفرقة الأولى (${selectedSubject.name})...`}
              />
              <button
                className="send-btn bg-[#ff4b72] text-white border-none w-[50px] h-[50px] rounded-full cursor-pointer text-lg flex items-center justify-center hover:scale-105 hover:bg-[#ff2a55] transition-all shrink-0"
                onClick={() => handleSendChat('study')}
                disabled={studyLoading}
              >
                <i className="fa-solid fa-paper-plane rotate-180"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Tab: شات الفضفضة والدلع */}
      {activeTab === 'love-chat' && (
        <div id="love-chat" className="tab-content block bg-white/88 backdrop-blur-[12px] rounded-[25px] p-5 sm:p-6 border border-white/70 shadow-[0_8px_32px_0_rgba(255,75,114,0.18)] min-h-[520px]">
          {/* Ahmed's Love Message of the Day */}
          {showDailyLoveCard && dailyLoveMessage && (
            <div className="daily-love-card mb-5 p-4 sm:p-5 rounded-[22px] bg-gradient-to-r from-rose-50 via-pink-50/95 to-rose-100/90 border-2 border-[#ff85a2]/70 shadow-[0_6px_22px_rgba(255,75,114,0.14)] relative overflow-hidden transition-all duration-300 animate-fadeIn">
              {/* Decorative background heart */}
              <div className="absolute -top-5 -left-5 text-[#ff4b72]/10 text-8xl pointer-events-none select-none">
                <i className="fa-solid fa-heart"></i>
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4b72] to-[#ff85a2] text-white flex items-center justify-center text-sm shadow-sm">
                    <i className="fa-solid fa-heart animate-pulse"></i>
                  </span>
                  <div>
                    <h3 className="font-extrabold text-[#ff4b72] text-sm sm:text-base flex items-center gap-1.5 flex-wrap">
                      <span>رسالة حب اليوم من أحمد لروحه بسملة</span>
                      <span className="bg-[#ff4b72]/15 text-[#ff4b72] text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        خاصة باليوم 💖
                      </span>
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setShowDailyLoveCard(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs p-1.5 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
                  title="إخفاء الرسالة مؤقتاً"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              {/* Message Content */}
              <div className="my-2 px-1 relative z-10">
                <p className="text-[#4a2c35] text-sm sm:text-base leading-relaxed font-semibold bg-white/70 p-3.5 rounded-2xl border border-rose-200/70 shadow-xs">
                  "{dailyLoveMessage}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#ff4b72]/15 relative z-10 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleToggleDailyLoveSpeech}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold cursor-pointer transition-all ${
                      isDailyLoveSpeaking
                        ? 'bg-[#ff2a55] text-white shadow-xs'
                        : 'bg-white text-[#ff4b72] border border-[#ff85a2] hover:bg-[#ff4b72] hover:text-white'
                    }`}
                  >
                    <i className={`fa-solid ${isDailyLoveSpeaking ? 'fa-stop' : 'fa-volume-high'}`}></i>
                    <span>{isDailyLoveSpeaking ? 'إيقاف الصوت ⏹️' : 'اسمعي بصوت دافئ 🎧'}</span>
                  </button>

                  <button
                    onClick={handleRefreshLoveMessage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold cursor-pointer bg-white text-[#ff4b72] border border-[#ff85a2] hover:bg-[#ff4b72] hover:text-white transition-all"
                    title="طلب رسالة حب أخرى"
                  >
                    <i className="fa-solid fa-arrows-rotate"></i>
                    <span>رسالة تانية من أحمد ✨</span>
                  </button>
                </div>

                <span className="text-[11px] text-[#ff4b72] font-semibold flex items-center gap-1">
                  <i className="fa-solid fa-infinity"></i>
                  <span>حب أحمد ليكي ملوش نهاية</span>
                </span>
              </div>
            </div>
          )}

          {/* If dismissed, show gentle trigger button */}
          {!showDailyLoveCard && dailyLoveMessage && (
            <div className="mb-4">
              <button
                onClick={() => setShowDailyLoveCard(true)}
                className="bg-rose-100/90 hover:bg-rose-200 text-[#ff4b72] text-xs font-bold px-3.5 py-1.5 rounded-full border border-rose-300 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <i className="fa-solid fa-envelope-open-text"></i>
                <span>قراءة رسالة حب اليوم من أحمد 💌</span>
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="quick-actions flex gap-2.5 mb-4 flex-wrap">
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('love', 'تعبانة شوية ومحتاجة طبطبة ودلع من أحمد')}
            >
              🌸 محتاجة طبطبة
            </button>
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('love', 'قوليلي كلمة حلوة تفرح قلبي النهاردة')}
            >
              💖 رسالة حب ودلع
            </button>
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('love', 'خايفة من الامتحانات ونفسي أطمن')}
            >
              🥺 طمنيني يا بوسي
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-wrapper flex flex-col h-[460px]">
            <div className="chat-messages flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-rose-50/20 rounded-2xl border border-rose-100">
              {loveMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-[22px] text-sm sm:text-base leading-relaxed ${
                    msg.sender === 'bot'
                      ? 'self-start bg-white text-[#4a2c35] rounded-br-[5px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#ffd8e1]'
                      : 'self-end bg-gradient-to-r from-[#ff4b72] to-[#ff85a2] text-white rounded-bl-[5px] shadow-[0_4px_12px_rgba(255,75,114,0.2)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-1 text-[10px] opacity-75">
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakTenderArabic(msg.text)}
                        className="hover:underline cursor-pointer flex items-center gap-1 text-[#ff4b72]"
                        title="استمعي لصوت الطبطبة"
                      >
                        <i className="fa-solid fa-volume-high text-[11px]"></i>
                        <span>اسمعي بصوت دافئ</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loveLoading && (
                <div className="message bot self-start bg-white text-[#ff4b72] p-3 rounded-[22px] border border-[#ffd8e1] text-xs flex items-center gap-2">
                  <i className="fa-solid fa-heart animate-bounce"></i>
                  <span>أحمد بيبعتلك ألف لمسة حب وطبطبة...</span>
                </div>
              )}
              <div ref={loveEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input-area flex gap-2.5 pt-4 border-t border-[#ff4b72]/15">
              <input
                type="text"
                id="love-input"
                value={loveInput}
                onChange={(e) => setLoveInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat('love')}
                className="chat-input flex-1 py-3.5 px-5 border border-[#ff85a2] rounded-[20px] outline-hidden bg-white text-sm sm:text-base focus:border-[#ff4b72]"
                placeholder="فضفضي وتدلعي براحتك يا بسملة..."
              />
              <button
                className="send-btn bg-[#ff4b72] text-white border-none w-[50px] h-[50px] rounded-full cursor-pointer text-lg flex items-center justify-center hover:scale-105 hover:bg-[#ff2a55] transition-all shrink-0"
                onClick={() => handleSendChat('love')}
                disabled={loveLoading}
              >
                <i className="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tab: شات الصلاة والعبادة */}
      {activeTab === 'prayer-chat' && (
        <div id="prayer-chat" className="tab-content block bg-white/88 backdrop-blur-[12px] rounded-[25px] p-5 sm:p-6 border border-white/70 shadow-[0_8px_32px_0_rgba(255,75,114,0.18)] min-h-[520px]">
          {/* Quick Actions */}
          <div className="quick-actions flex gap-2.5 mb-4 flex-wrap">
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('prayer', 'ذكّريني بأذكار المساء بطريقة دافئة')}
            >
              ✨ أذكار المساء
            </button>
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('prayer', 'قوليلي دعاء حلو يدخل السكينة لقلبي')}
            >
              🤲 دعاء السكينة
            </button>
            <button
              className="quick-btn bg-white/85 border border-[#ff85a2] py-2 px-3.5 rounded-[15px] text-xs sm:text-sm text-[#ff4b72] font-semibold hover:bg-[#ff85a2] hover:text-white transition-all cursor-pointer"
              onClick={() => handleSendChat('prayer', 'عايزة تشجيع عشان أقوم أصلي العصر')}
            >
              🕌 تشجيع للصلاة
            </button>
          </div>

          {/* Quick Tasbeeh Strip */}
          <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-kaaba text-emerald-600 text-base"></i>
              <span className="font-bold text-emerald-900">مسبحة بسملة السريعة:</span>
              <span className="text-emerald-700 font-medium">{TASBEEH_ITEMS[tasbeehPresetIdx].text}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTasbeehCount((prev) => prev + 1)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-xl cursor-pointer text-xs flex items-center gap-1.5 shadow-xs"
              >
                <span>سبّحي</span>
                <span className="font-mono bg-white/20 px-1.5 py-0.2 rounded-md">{tasbeehCount}</span>
              </button>
              <button
                onClick={() => setTasbeehPresetIdx((prev) => (prev + 1) % TASBEEH_ITEMS.length)}
                className="text-stone-400 hover:text-stone-600 text-xs"
                title="تغيير الذكر"
              >
                تغيير ↻
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-wrapper flex flex-col h-[420px]">
            <div className="chat-messages flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-rose-50/20 rounded-2xl border border-rose-100">
              {prayerMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-[22px] text-sm sm:text-base leading-relaxed ${
                    msg.sender === 'bot'
                      ? 'self-start bg-white text-[#4a2c35] rounded-br-[5px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#ffd8e1]'
                      : 'self-end bg-gradient-to-r from-[#ff4b72] to-[#ff85a2] text-white rounded-bl-[5px] shadow-[0_4px_12px_rgba(255,75,114,0.2)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-1 text-[10px] opacity-75">
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakTenderArabic(msg.text)}
                        className="hover:underline cursor-pointer flex items-center gap-1 text-[#ff4b72]"
                        title="استمعي للدعاء"
                      >
                        <i className="fa-solid fa-volume-high text-[11px]"></i>
                        <span>اسمعي بصوت دافئ</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {prayerLoading && (
                <div className="message bot self-start bg-white text-emerald-600 p-3 rounded-[22px] border border-emerald-100 text-xs flex items-center gap-2">
                  <i className="fa-solid fa-hands-praying animate-pulse"></i>
                  <span>بنحضرلك دعاء يملأ قلبك سكينة ونور...</span>
                </div>
              )}
              <div ref={prayerEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input-area flex gap-2.5 pt-4 border-t border-[#ff4b72]/15">
              <input
                type="text"
                id="prayer-input"
                value={prayerInput}
                onChange={(e) => setPrayerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat('prayer')}
                className="chat-input flex-1 py-3.5 px-5 border border-[#ff85a2] rounded-[20px] outline-hidden bg-white text-sm sm:text-base focus:border-[#ff4b72]"
                placeholder="اطلبي دعاء أو استفسار ديني محبب..."
              />
              <button
                className="send-btn bg-[#ff4b72] text-white border-none w-[50px] h-[50px] rounded-full cursor-pointer text-lg flex items-center justify-center hover:scale-105 hover:bg-[#ff2a55] transition-all shrink-0"
                onClick={() => handleSendChat('prayer')}
                disabled={prayerLoading}
              >
                <i className="fa-solid fa-hands-praying"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab: الجدول التنظيمي */}
      {activeTab === 'organizer' && (
        <div id="organizer" className="tab-content block bg-white/88 backdrop-blur-[12px] rounded-[25px] p-5 sm:p-6 border border-white/70 shadow-[0_8px_32px_0_rgba(255,75,114,0.18)] min-h-[520px]">
          <h2 className="text-[#ff4b72] text-xl sm:text-2xl font-black mb-5 flex items-center gap-2 font-marhey">
            <i className="fa-solid fa-calendar-check"></i>
            <span>الجدول اليومي لدلوعة أحمد</span>
          </h2>

          <div className="grid-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Prayer status box */}
            <div className="card-box bg-white/92 rounded-[20px] p-5 border border-[#ffccd5] shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-3">
              <h3 className="text-[#ff4b72] font-bold text-base sm:text-lg flex items-center gap-2 border-b border-rose-100 pb-2">
                <i className="fa-solid fa-kaaba"></i>
                <span>متابع الصلوات الخمس</span>
              </h3>
              <p className="text-[11px] text-stone-500">اضغطي لتغيير الحالة: أُديت ✨ ⬅️ في الانتظار ⏳ ⬅️ معفوة (بيريود) 🌸</p>

              {[
                { id: 'fajr', name: 'الفجر', defaultTime: '04:45' },
                { id: 'dhuhr', name: 'الظهر', defaultTime: '11:45' },
                { id: 'asr', name: 'العصر', defaultTime: '14:55' },
                { id: 'maghrib', name: 'المغرب', defaultTime: '17:15' },
                { id: 'isha', name: 'العشاء', defaultTime: '18:35' },
              ].map((prayer) => {
                const status = prayerStatuses[prayer.id] || 'pending';
                return (
                  <div
                    key={prayer.id}
                    className="prayer-item flex justify-between items-center p-3 bg-[#fff5f7] rounded-[12px] border border-rose-100/60"
                  >
                    <div>
                      <span className="font-bold text-sm text-stone-800">{prayer.name}</span>
                      <span className="text-[11px] text-stone-400 mr-2 font-mono">{prayer.defaultTime}</span>
                    </div>

                    <button
                      onClick={() => togglePrayer(prayer.id)}
                      className={`prayer-status py-1.5 px-3 rounded-[10px] text-xs font-bold cursor-pointer transition-all ${
                        status === 'done'
                          ? 'status-done bg-[#d4edda] text-[#155724] border border-emerald-300'
                          : status === 'pending'
                          ? 'status-pending bg-[#fff3cd] text-[#856404] border border-amber-300'
                          : 'status-exempt bg-[#f8d7da] text-[#721c24] border border-rose-300'
                      }`}
                    >
                      {status === 'done' && 'أُديت ✨'}
                      {status === 'pending' && 'في الانتظار ⏳'}
                      {status === 'exempt' && 'معفوة (بيريود) 🌸'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Time organizer box */}
            <div className="card-box bg-white/92 rounded-[20px] p-5 border border-[#ffccd5] shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-3">
              <h3 className="text-[#ff4b72] font-bold text-base sm:text-lg flex items-center gap-2 border-b border-rose-100 pb-2">
                <i className="fa-solid fa-clock"></i>
                <span>تنظيم وقت اليوم (دراسة ورعاية)</span>
              </h3>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className={`schedule-item flex justify-between items-center p-3 rounded-[12px] text-xs sm:text-sm border transition-all ${
                      item.completed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-[#fff5f7] border-rose-100/60'
                    }`}
                  >
                    <span className="text-stone-500 font-mono text-xs">{item.time}</span>
                    <strong className="text-stone-800 font-bold">{item.title}</strong>
                  </div>
                ))}
              </div>

              {/* Add Custom Schedule Item */}
              <form onSubmit={handleAddSchedule} className="pt-2 border-t border-rose-100 space-y-2">
                <p className="text-xs font-bold text-[#ff4b72]">إضافة موعد أو مهمة جديدة:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                    placeholder="التوقيت (مثال: 02:00 م)"
                    className="w-1/3 bg-white text-stone-800 text-xs p-2 rounded-xl border border-rose-200 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={newScheduleTitle}
                    onChange={(e) => setNewScheduleTitle(e.target.value)}
                    placeholder="اسم المهمة أو وقت الراحة..."
                    className="flex-1 bg-white text-stone-800 text-xs p-2 rounded-xl border border-rose-200 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="bg-[#ff4b72] hover:bg-[#ff2a55] text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إضافة +
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab: متابع البيريود */}
      {activeTab === 'period-tracker' && (
        <div id="period-tracker" className="tab-content block bg-white/88 backdrop-blur-[12px] rounded-[25px] p-5 sm:p-6 border border-white/70 shadow-[0_8px_32px_0_rgba(255,75,114,0.18)] min-h-[520px]">
          <h2 className="text-[#ff4b72] text-xl sm:text-2xl font-black mb-5 flex items-center gap-2 font-marhey">
            <i className="fa-solid fa-heart-pulse"></i>
            <span>متابع الدورة الشهرية والعناية الذاتية</span>
          </h2>

          <div className="grid-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Period status and date config */}
            <div className="card-box bg-white/92 rounded-[20px] p-5 border border-[#ffccd5] shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-4">
              <div className="period-info-box text-center p-5 bg-gradient-to-br from-[#fff0f3] to-[#ffe3e8] rounded-[20px] border border-rose-200">
                <h3 className="text-base font-bold text-stone-800 justify-center mb-1">الموعد المتوقع القادم</h3>
                <div className="days-count text-3xl sm:text-4xl font-black text-[#ff4b72] font-marhey my-2">
                  {diffDays <= 0 ? 'في أيام الراحة والدلع الآن 🌸' : `باقي ${diffDays} أيام`}
                </div>
                <p className="text-xs text-stone-500 font-medium">متوقع يوم {expectedDateString}</p>
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-stone-700">تاريخ آخر دورة:</label>
                <input
                  type="date"
                  id="period-start-date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="pin-input w-full p-2.5 border-2 border-[#ff85a2] rounded-[15px] text-sm text-center outline-hidden bg-white text-[#ff4b72] font-bold"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-xs text-stone-700">مدة الدورة (بالأيام):</label>
                <input
                  type="number"
                  min={20}
                  max={45}
                  value={cycleDays}
                  onChange={(e) => setCycleDays(Number(e.target.value))}
                  className="pin-input w-full p-2.5 border-2 border-[#ff85a2] rounded-[15px] text-sm text-center outline-hidden bg-white text-[#ff4b72] font-bold"
                />
              </div>

              <button
                className="login-btn w-full p-3.5 bg-gradient-to-r from-[#ff4b72] to-[#ff85a2] text-white font-bold rounded-[20px] shadow-[0_6px_20px_rgba(255,75,114,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
                onClick={() => {
                  confetti({ particleCount: 50, spread: 60 });
                  speakTenderArabic('تم تحديث البيانات بنجاح يا سكرة! أحمد بيتمنالك دايماً صحة وراحة بال.');
                  alert('تم تحديث البيانات بنجاح يا سكرة! 🌸');
                }}
              >
                حفظ التحديثات 🌸
              </button>
            </div>

            {/* Pampering tips and self care */}
            <div className="card-box bg-white/92 rounded-[20px] p-5 border border-[#ffccd5] shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-[#ff4b72] font-bold text-base sm:text-lg flex items-center gap-2 border-b border-rose-100 pb-2">
                  <i className="fa-solid fa-mug-hot"></i>
                  <span>نصائح الحنان والدلع في أيام التعب</span>
                </h3>

                <ul className="leading-relaxed space-y-2.5 pr-4 text-xs sm:text-sm text-stone-800 list-disc pt-2">
                  <li>اشربي مشروبات دافئة مثل القرفة والنعناع ☕</li>
                  <li>استريحي تماماً ومفيش أي ضغط دراسي 🛌</li>
                  <li>أحمد معاكي وممنوع أي زعل أو توتر 💖</li>
                  <li>أنتي معفوة من الصلاة في الأيام دي يا سكرتي 🌸</li>
                  <li>كمادات ميه دافية على البطن لتسكين المغص ♨️</li>
                </ul>
              </div>

              {/* Water glasses tracker widget */}
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-right space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                  <span>شرب المياه اليومي (بشرة وصحة بسملة):</span>
                  <span>{waterGlasses} / 8 أكواب</span>
                </div>
                <div className="flex gap-1.5 justify-center py-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setWaterGlasses(i + 1)}
                      className={`w-7 h-8 rounded-lg cursor-pointer flex items-center justify-center transition-all ${
                        i < waterGlasses ? 'bg-sky-400 text-white shadow-xs' : 'bg-white border border-sky-200 text-sky-300'
                      }`}
                      title={`كوب ${i + 1}`}
                    >
                      💧
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-center text-sky-700">شرب الميه بيقلل التعب وتقلصات الرحم تماماً</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
