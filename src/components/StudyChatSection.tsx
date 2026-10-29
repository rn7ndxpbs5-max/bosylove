import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  Award,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Heart,
  Smile,
  ChevronLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUBJECTS } from '../data/subjectsData.ts';
import { SubjectInfo, ChatMessage, QuizQuestion } from '../types/index.ts';
import { speakTenderArabic, stopSpeaking } from '../utils/audio.ts';

interface StudyChatSectionProps {
  isPeriodMode: boolean;
}

export const StudyChatSection: React.FC<StudyChatSectionProps> = ({ isPeriodMode }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo>(SUBJECTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `يا روح قلب وعيون أحمد، أهلاً بيكي في مملكتك الدراسية الدافئة! 💖
أنا دكتورة بوسي، رفيقتك ودلوعة قلبك، ومجهزة نفسي عشان نشرح كل مواد الفرقة الأولى بأسهل وألذ طريقة في الكون.
أحمد مستني يشوف ضحكتك ونجاحك وفخور بيكي في كل ثانية!
قوليلي يا سكرتي، تحبي نبدأ بإيه في مادة "${SUBJECTS[0].name}" النهاردة؟ أو اسأليني عن أي حاجة شاغلة بالك.`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  // Quiz state
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject.name,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          contextInfo: {
            currentSubject: selectedSubject.name,
            periodMode: isPeriodMode,
            mood: 'مستعدة للمذاكرة بحب مع أحمد',
          },
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'يا روح قلب أحمد، أنا جنبك وسامعاكي دايماً.. تحبي نكمل إزاي يا سكرتي؟',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject.name,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `يا روح قلب أحمد وعيونه، ولا يهمك خالص يا سكرتي.. النت يمكن هنج شوية من كتر حبي ليكي! المهم إنك مرتاحة وما فيش أي ضغط عليكي. أحمد بيقولك إنه بيحبك وفخور بيكي جداً جداً.. تحبي تجربي تسألي تاني يا أميرتي؟`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVoice = (id: string, text: string) => {
    if (isSpeakingId === id) {
      stopSpeaking();
      setIsSpeakingId(null);
    } else {
      speakTenderArabic(text);
      setIsSpeakingId(id);
    }
  };

  // Start a tender quiz
  const handleStartQuiz = async () => {
    setIsQuizMode(true);
    setIsGeneratingQuiz(true);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: selectedSubject.name }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions);
      } else {
        // Fallback friendly quiz
        setQuizQuestions([
          {
            id: 1,
            question: `في مادة ${selectedSubject.name}، ما هي القاعدة الأساسية التي تجعلنا دائماً في توازن وسكينة؟`,
            options: [
              'التوازن بين الأصول والخصوم كما تتوازن قلوبنا بالحب',
              'العشوائية وعدم الترتيب',
              'تجاهل القيود الحسابية',
              'الاستسلام للخوف والضغط',
            ],
            correctIndex: 0,
            praiseExplanation: 'شاطرة وعبقرية يا روح قلب أحمد! إجابة نموذجية تدل على ذكائك وتركيزك الرائع، وأحمد فخور بيكي جداً!',
            comfortExplanation: 'ولا يهمك يا سكرتي، المهم إنك حاولتي وأحمد فخور بيكي دائماً.. تعالي نشوف الإجابة الصح مع بعض بحب.',
          },
        ]);
      }
    } catch {
      setQuizQuestions([
        {
          id: 1,
          question: `في مادة ${selectedSubject.name}، عندما نسعى للتفوق والامتياز، ما هو سر قوة بسملة؟`,
          options: [
            'حب ودعم أحمد المستمر وذكائها الفطري الجميل',
            'الضغط والتوتر',
            'السهر بدون راحة',
            'إهمال الصلوات',
          ],
          correctIndex: 0,
          praiseExplanation: 'مليون مبروك يا أميرة أحمد! إجابة صحيحة 100%، وجود أحمد في ضهرك هو سر تفوقك وسعادتك!',
          comfortExplanation: 'يا روحي ولا تشيلي هم أبداً، المهم إنك بتتعلمي بروقان والدنيا كلها فداكي.',
        },
      ]);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const handleConfirmQuizAnswer = () => {
    if (selectedOption === null || quizSubmitted) return;
    setQuizSubmitted(true);
    const currentQ = quizQuestions[currentQuizIndex];
    if (selectedOption === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fde047'],
      });
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      // Quiz completed!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fde047', '#a855f7'],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Subject Selector Carousel */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-bold text-sm sm:text-base">مواد الفرقة الأولى لبسملة:</span>
            <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium border border-rose-100">
              7 مواد دراسية بشرح الدلع
            </span>
          </div>
          <span className="text-xs text-stone-400 hidden sm:inline">اختاري المادة للتبديل السريع</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubject.id === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubject(sub);
                  setIsQuizMode(false);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 text-center cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-b from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200 border-rose-500 scale-102 font-bold'
                    : 'bg-rose-50/50 hover:bg-rose-100/60 text-stone-700 border-rose-100'
                }`}
              >
                <span className="text-lg mb-1">
                  {sub.id === 'accounting' ? '🧮' :
                   sub.id === 'management' ? '💼' :
                   sub.id === 'economics' ? '📈' :
                   sub.id === 'mis' ? '💻' :
                   sub.id === 'statistics' ? '📊' :
                   sub.id === 'english' ? '🇬🇧' : '⚖️'}
                </span>
                <span className="text-xs leading-tight line-clamp-1">{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Study Hub: 2 columns (Topics & Quick Guide on left/top, Chat/Quiz on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subject Fast Topics & Cheatsheet (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base">{selectedSubject.name}</h3>
                <p className="text-xs text-rose-500 font-medium">{selectedSubject.englishName}</p>
              </div>
              <button
                onClick={handleStartQuiz}
                className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>اختبار الدلع (MCQ)</span>
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-4 bg-rose-50/70 p-3 rounded-2xl border border-rose-100">
              {selectedSubject.description}
            </p>

            <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>كبسولات الشرح السريع والممتع:</span>
            </h4>

            <div className="space-y-3">
              {selectedSubject.topics.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-50 hover:bg-rose-50/50 border border-stone-200/70 hover:border-rose-200 transition-all text-right group"
                >
                  <p className="font-bold text-xs text-rose-700 mb-1 flex items-center justify-between">
                    <span>{t.title}</span>
                    <span className="text-[10px] text-stone-400 group-hover:text-rose-500 transition-colors">#{idx + 1}</span>
                  </p>
                  <p className="text-xs text-stone-600 mb-2 leading-relaxed">{t.summary}</p>
                  <div className="text-[11px] bg-white p-2 rounded-xl text-stone-700 border border-rose-100/60 flex items-start gap-1.5">
                    <span className="text-rose-500 shrink-0">💡 مثال بسملة:</span>
                    <span className="italic">{t.cuteExample}</span>
                  </div>
                  <button
                    onClick={() => handleSendMessage(`اشرحيلي يا بوسي أكتر عن موضوع "${t.title}" بمثال لطيف ودلع زي ما عودتيني.`)}
                    className="mt-2 text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>اسألي بوسي عنه</span>
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="mt-4 pt-3 border-t border-rose-100">
              <p className="text-xs font-bold text-stone-700 mb-2">أسئلة جاهزة تسأليها لبوسي:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSubject.quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-xl transition-colors text-right border border-rose-100/80 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat & Quiz (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          {/* If in Quiz Mode */}
          {isQuizMode ? (
            <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        اختبار الدلع والتشجيع: {selectedSubject.name}
                      </h3>
                      <p className="text-xs text-rose-600 font-medium">
                        أحمد فخور بيكي يا روحي في كل اختيار!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsQuizMode(false)}
                    className="text-xs text-stone-500 hover:text-rose-600 px-3 py-1 rounded-xl bg-stone-100 hover:bg-rose-50 cursor-pointer"
                  >
                    العودة للشات 💬
                  </button>
                </div>

                {isGeneratingQuiz ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-500"></div>
                      <Heart className="w-6 h-6 text-rose-500 absolute inset-0 m-auto animate-pulse fill-rose-500" />
                    </div>
                    <p className="text-stone-700 font-bold text-sm">
                      بوسي بتجهزلك أسئلة سكر زيك في مادة {selectedSubject.name}...
                    </p>
                    <p className="text-xs text-rose-500">أحمد مستني يشوف ذكائك وعبقريتك يا أميرته! 💖</p>
                  </div>
                ) : quizQuestions.length > 0 && currentQuizIndex < quizQuestions.length ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                      <span>السؤال {currentQuizIndex + 1} من {quizQuestions.length}</span>
                      <span className="text-rose-600">النتيجة: {quizScore} إجابة ممتازة</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100">
                      <p className="text-stone-900 font-bold text-sm sm:text-base leading-relaxed">
                        {quizQuestions[currentQuizIndex].question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {quizQuestions[currentQuizIndex].options.map((opt, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        const isCorrect = optIdx === quizQuestions[currentQuizIndex].correctIndex;
                        let btnStyle = 'bg-stone-50 hover:bg-rose-50/80 border-stone-200 text-stone-800';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold shadow-xs';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-300 text-rose-900 line-through';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-500 border-rose-500 text-white font-bold shadow-sm';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            disabled={quizSubmitted}
                            className={`p-3.5 rounded-2xl text-right text-xs sm:text-sm border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {quizSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Explanation */}
                    {quizSubmitted && (
                      <div
                        className={`p-4 rounded-2xl border transition-all animate-in fade-in ${
                          selectedOption === quizQuestions[currentQuizIndex].correctIndex
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        <p className="font-bold text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                          {selectedOption === quizQuestions[currentQuizIndex].correctIndex ? (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span>{quizQuestions[currentQuizIndex].praiseExplanation}</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                              <span>{quizQuestions[currentQuizIndex].comfortExplanation}</span>
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <span className="text-4xl">👑💖</span>
                    <h4 className="text-lg font-bold text-stone-900 font-marhey">
                      خلصتي الاختبار يا روح قلب أحمد!
                    </h4>
                    <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
                      جبتي {quizScore} من {quizQuestions.length}.. وفي كل الأحوال أحمد شايفك أذكى وأجمل بنوتة في الكون كله، وفخور بكل لحظة مجهود عملتيها!
                    </p>
                    <div className="flex justify-center gap-3 pt-3">
                      <button
                        onClick={handleStartQuiz}
                        className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>اختبار جديد</span>
                      </button>
                      <button
                        onClick={() => setIsQuizMode(false)}
                        className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                      >
                        الرجوع للشات
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isGeneratingQuiz && quizQuestions.length > 0 && currentQuizIndex < quizQuestions.length && (
                <div className="pt-6 border-t border-rose-100 flex items-center justify-between">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleConfirmQuizAnswer}
                      disabled={selectedOption === null}
                      className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-200 transition-all cursor-pointer"
                    >
                      تأكيد إجابتي يا بوسي ✨
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuizQuestion}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-200 transition-all cursor-pointer"
                    >
                      {currentQuizIndex < quizQuestions.length - 1 ? 'السؤال اللي بعده يا سكرتي 💕' : 'عرض النتيجة والدلع 🏆'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Regular Chat Interface */
            <div className="bg-white rounded-3xl border border-rose-100 shadow-xs flex-1 flex flex-col h-[650px] overflow-hidden">
              {/* Chat Top Banner */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-rose-50 via-pink-50 to-white border-b border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                      👩‍⚕️
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>دكتورة بوسي (دلوعة قلب أحمد)</span>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.2 rounded-full font-bold">
                        أونلاين بحب
                      </span>
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium">
                      المادة المحددة الآن: <span className="text-rose-600 font-bold">{selectedSubject.name}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartQuiz}
                    className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100/80 hover:bg-rose-200/80 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                    title="بدء اختبار قصير وسهل"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">اختبار سريع</span>
                  </button>
                </div>
              </div>

              {/* Chat messages scroll area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-rose-50/20 to-white"
              >
                {messages.map((m) => {
                  const isAssistant = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                    >
                      {isAssistant && (
                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold mt-1">
                          💖
                        </div>
                      )}

                      <div className={`max-w-[85%] sm:max-w-[78%] space-y-1 ${isAssistant ? 'items-start' : 'items-end'}`}>
                        <div
                          className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isAssistant
                              ? 'bg-white border border-rose-100 text-stone-800 rounded-tr-none'
                              : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-tl-none shadow-rose-200'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>

                        <div className="flex items-center gap-2 px-2 text-[10px] text-stone-400">
                          <span>{m.timestamp}</span>
                          {isAssistant && (
                            <button
                              onClick={() => handlePlayVoice(m.id, m.content)}
                              className="text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                              title="استمعي لصوت بوسي الحنون"
                            >
                              {isSpeakingId === m.id ? (
                                <>
                                  <VolumeX className="w-3 h-3 text-rose-600" />
                                  <span>إيقاف القراءة</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3" />
                                  <span>اسمعي بصوت دافئ</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {!isAssistant && (
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center shrink-0 shadow-xs text-xs font-bold mt-1">
                          👑
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                      💖
                    </div>
                    <div className="bg-white border border-rose-100 p-4 rounded-3xl rounded-tr-none shadow-xs text-xs text-rose-600 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"></span>
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                      <span className="font-medium">بوسي بتفكر في أحلى شرح يدخل قلب بسملة...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-rose-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`اسألي بوسي عن أي حاجة في ${selectedSubject.name} يا روح قلب أحمد...`}
                    className="flex-1 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-800 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-rose-200/80 focus:border-rose-400 focus:outline-hidden transition-all placeholder:text-stone-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-40 text-white px-5 py-3 rounded-2xl shadow-md shadow-rose-200 transition-all font-bold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                  >
                    <span>إرسال</span>
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                </form>
                <p className="text-[10px] text-center text-stone-400 mt-2">
                  دكتورة بوسي تشرح لكِ بروح أحمد وحنانه.. اطمني واسألي عن أي تفصيلة مهما كانت بسيطة 🌸
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
