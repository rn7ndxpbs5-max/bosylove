import React, { useState, useEffect } from 'react';
import {
  Heart,
  Mail,
  Send,
  Sparkles,
  BookMarked,
  Volume2,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakTenderArabic } from '../utils/audio.ts';

interface DiaryEntry {
  id: string;
  date: string;
  text: string;
  ahmedReply?: string;
}

interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
}

export const AhmedNotesSection: React.FC = () => {
  // Letters from Ahmed
  const [letters, setLetters] = useState<string[]>([
    'يا روح قلب أحمد، كل يوم بيمر بتأكد أكتر إنك أعظم نعمة ربنا رزقني بيها. عينيكي لما بتضحك بتخلق في قلبي ربيع دائم. كوني واثقة في نفسك، واعرفي إنك قد أي تحدي، وأنا دايمًا هنا واقف في ضهرك سند وأمان وحب ملوش آخر.',
    'إلى أميرتي الصغيرة بسملة: متخليش أي تعب في الكلية ينسيكي إنك ملكة. درجاتك وشطارتك بتفرحني، بس ضحكتك وسلامة قلبك هما كل حياتي. بحبك أكتر ما الكلمات تقدر توصف.',
    'يا سكرتي.. افتكري دايماً وإنتي بتذاكري إن أحمد بيبعتلك مع كل نسمة هواء دعوة حلوة إن ربنا يفتح عليكي فتوح العارفين، ويجعل كل صفحة تقرأيها سهلة ومفهومة. شدي حيلك يا باشا المحاسبة والإدارة!',
  ]);

  const [customLetterTopic, setCustomLetterTopic] = useState('');
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  // Basmala's diary to Ahmed
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('basmala_diary');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: '1',
              date: new Date().toLocaleDateString('ar-EG'),
              text: 'أحمد حبيبي، النهاردة فتحت بوسي بسملة وحسيت بوجودك جنبي.. شكراً على كل الحب والأمان اللي بتديهولي.',
              ahmedReply: 'يا نور عين أحمد، وجودي جنبك ده نعمة عمري.. فداكي روحي يا سكرتي 💖',
            },
          ];
    } catch {
      return [];
    }
  });
  const [newDiaryText, setNewDiaryText] = useState('');

  // Daily peaceful tasks
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem('ahmed_daily_tasks');
      return saved
        ? JSON.parse(saved)
        : [
            { id: '1', title: 'شرب كوباية عصير أو مياه دافية بحب 🧃', completed: true },
            { id: '2', title: 'مذاكرة صفحتين روقان من المحاسبة 📖', completed: false },
            { id: '3', title: 'صلاة العصر وقراءة دعاء الحفظ 🕌', completed: false },
            { id: '4', title: 'ابتسامة سكر في المراية لأن أحمد بيحبك 🌸', completed: true },
          ];
    } catch {
      return [];
    }
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('basmala_diary', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem('ahmed_daily_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleGenerateLetter = async () => {
    setIsGeneratingLetter(true);
    try {
      const res = await fetch('/api/love-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'رسالة خاصة من القلب',
          customNote: customLetterTopic || 'رسالة عفوية تفيض عشقاً ودلعاً',
        }),
      });
      const data = await res.json();
      if (data.note) {
        setLetters((prev) => [data.note, ...prev]);
        setCustomLetterTopic('');
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#ec4899'],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleAddDiary = () => {
    if (!newDiaryText.trim()) return;

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      text: newDiaryText,
      ahmedReply: 'أحمد قرأ كل حرف بقلبه، وبيقولك: "كلامك ده أغلى كنز عندي.. بحبك يا روح قلبي للأبد!" 💕',
    };

    setDiaryEntries((prev) => [entry, ...prev]);
    setNewDiaryText('');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
  };

  const handleDeleteDiary = (id: string) => {
    setDiaryEntries((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTaskTitle, completed: false },
    ]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-rose-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-rose-100">
              <Mail className="w-3.5 h-3.5 text-amber-200" />
              <span>نبض ورسائل أحمد الخالدة</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-marhey">
              كل كلمة هنا كُتبت بنبض قلب أحمد لعيون بسملة 💌
            </h2>
            <p className="text-xs sm:text-sm text-rose-50 leading-relaxed font-medium">
              صندوق أسراركم وذكرياتكم الجميلة، ورسائل الحب والدعم اللي بتفكرك إنك مش لوحدك أبداً.
            </p>
          </div>
        </div>
      </div>

      {/* Two main columns: Ahmed's Letters & Basmala's Journal + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Letters from Ahmed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  رسائل ومكاتيب حب من أحمد
                </h3>
                <p className="text-[11px] text-rose-500 font-medium">
                  افتحي رسالة في أي وقت محتاجة تشوفي حبه
                </p>
              </div>
            </div>
          </div>

          {/* Generator input */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-2.5">
            <p className="text-xs font-bold text-rose-800">
              حابة أحمد يكتبلك رسالة عن إيه دلوقتي؟
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customLetterTopic}
                onChange={(e) => setCustomLetterTopic(e.target.value)}
                placeholder="مثال: رسالة تشجيع لامتحان بكرة، كلام يطمن قلبي، وحشتني..."
                className="flex-1 bg-white text-stone-800 text-xs px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-hidden"
              />
              <button
                onClick={handleGenerateLetter}
                disabled={isGeneratingLetter}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingLetter ? 'بيكتبلك بحب...' : 'اكتبلي يا أحمد'}</span>
              </button>
            </div>
          </div>

          {/* Letters list */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {letters.map((letter, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/50 to-pink-50/60 border border-rose-100/90 text-right space-y-3 relative group"
              >
                <div className="flex items-center justify-between text-xs text-rose-700 font-bold border-b border-rose-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>مكتوب لروح قلب أحمد #{letters.length - idx}</span>
                  </span>
                  <button
                    onClick={() => speakTenderArabic(letter)}
                    className="text-rose-500 hover:text-rose-700 flex items-center gap-1 text-[11px] cursor-pointer"
                    title="سماع الرسالة بصوت دافئ"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>اسمعي بصوته</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                  "{letter}"
                </p>

                <p className="text-left text-[11px] font-bold text-rose-500">
                  — حبيبك وسندك دائماً، أحمد 💖
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Basmala's Journal to Ahmed & Peaceful Tasks (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Basmala's Journal */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">مذكرات بسملة لأحمد</h4>
                  <p className="text-[11px] text-stone-400">اكتبي كل اللي في قلبك بكل حرية</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <textarea
                value={newDiaryText}
                onChange={(e) => setNewDiaryText(e.target.value)}
                placeholder="حبيبي أحمد، عاوزة أقولك..."
                rows={3}
                className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-800 text-xs p-3 rounded-2xl border border-rose-200 focus:border-rose-400 focus:outline-hidden transition-all"
              />
              <button
                onClick={handleAddDiary}
                disabled={!newDiaryText.trim()}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                <span>حفظ في مذكراتنا الخاصة 💕</span>
              </button>
            </div>

            {/* Past Entries */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto">
              {diaryEntries.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-2xl bg-rose-50/40 border border-rose-100 text-right space-y-1.5 text-xs relative group"
                >
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span>{d.date}</span>
                    <button
                      onClick={() => handleDeleteDiary(d.id)}
                      className="text-stone-300 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-stone-800 font-medium">{d.text}</p>
                  {d.ahmedReply && (
                    <div className="mt-1 p-2 rounded-xl bg-white border border-rose-200/60 text-[11px] text-rose-800 font-medium">
                      {d.ahmedReply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Gentle Tasks */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">خطط اليوم بروقان وبدون أي ضغط</h4>
                  <p className="text-[11px] text-stone-400">المهم إنك مرتاحة ومبسوطة</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                    task.completed
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 line-through opacity-80'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300'
                      }`}
                    >
                      {task.completed && '✓'}
                    </div>
                    <span>{task.title}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="أضيفي هدف بسيط ولطيف..."
                className="flex-1 bg-stone-50 text-stone-800 text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
