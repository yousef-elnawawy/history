import React from "react";
import { 
  Compass, Award, RotateCcw, CheckCircle2, XCircle, Timer, 
  HelpCircle, BookOpen, User, Flame, History, ChevronRight, 
  Sparkles, ShieldCheck, RefreshCw, Star, Info, ListChecks, Check
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { historyQuestions, Question } from "./questions";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Explore from "./components/Explore";
import { playCorrectSound, playIncorrectSound } from "./utils/audio";

// Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function App() {
  const [view, setView] = React.useState<"home" | "quiz" | "quiz_playing" | "quiz_finished" | "explore" | "about">("home");

  // Audio toggle state
  const [isMuted, setIsMuted] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("app_muted") === "true";
    } catch {
      return false;
    }
  });

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newVal = !prev;
      localStorage.setItem("app_muted", newVal ? "true" : "false");
      return newVal;
    });
  };

  // Game configuration
  const [config, setConfig] = React.useState({
    count: 10,
    era: "all",
    difficulty: "all",
    timed: true,
    unseenOnly: true,
  });

  // Seen questions persistence to guarantee no repetition
  const [seenIds, setSeenIds] = React.useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("seen_question_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active quiz states
  const [activeQuestions, setActiveQuestions] = React.useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [answered, setAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = React.useState<Array<{ question: Question; userSelection: number | null }>>([]);
  
  // Timing & stats
  const [timer, setTimer] = React.useState(30);
  const [timeTaken, setTimeTaken] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const stopwatchRef = React.useRef<NodeJS.Timeout | null>(null);
  const [eraNotice, setEraNotice] = React.useState<string | null>(null);

  // Update seen pool in local storage
  const addToSeenPool = (ids: number[]) => {
    const updated = Array.from(new Set([...seenIds, ...ids]));
    setSeenIds(updated);
    localStorage.setItem("seen_question_ids", JSON.stringify(updated));
  };

  const resetSeenPool = () => {
    setSeenIds([]);
    localStorage.removeItem("seen_question_ids");
  };

  // Start the Quiz
  const handleStartQuiz = () => {
    setEraNotice(null);
    // 1. Filter questions based on era and difficulty
    let candidates = historyQuestions.filter((q) => {
      const matchesEra = config.era === "all" || q.era === config.era;
      const matchesDiff = config.difficulty === "all" || q.difficulty === config.difficulty;
      return matchesEra && matchesDiff;
    });

    if (candidates.length === 0) {
      alert("عذراً، لم نجد أي أسئلة تطابق هذه الخيارات، يرجى تغيير الإعدادات وبدء اللعبة!");
      return;
    }

    // 2. Handle "No repeat" restriction
    let filteredBySeen = candidates.filter((q) => !seenIds.includes(q.id));

    let finalSelection: Question[] = [];
    if (config.unseenOnly && filteredBySeen.length > 0) {
      // Shuffled unseen pool
      const shuffledUnseen = shuffleArray(filteredBySeen);
      if (shuffledUnseen.length >= config.count) {
        finalSelection = shuffledUnseen.slice(0, config.count);
      } else {
        // Not enough unseen questions, mix with seen questions to satisfy count
        const needed = config.count - shuffledUnseen.length;
        const alreadySeenShuffled = shuffleArray(candidates.filter((q) => seenIds.includes(q.id)));
        finalSelection = [...shuffledUnseen, ...alreadySeenShuffled.slice(0, needed)];
        setEraNotice(
          `رائع! لقد أجبت على معظم أسئلة هذه الفئة سابقاً. تم تكرار ${needed} أسئلة مجابة لإكمال العدد المطلوبة.`
        );
      }
    } else {
      // Just shuffle and pick from all matching candidates
      finalSelection = shuffleArray(candidates).slice(0, config.count);
    }

    // Ensure we don't exceed what is available
    if (finalSelection.length > config.count) {
      finalSelection = finalSelection.slice(0, config.count);
    }

    setActiveQuestions(finalSelection);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setIncorrectAnswers([]);
    setTimeTaken(0);
    setView("quiz_playing");

    // Start stopwatch
    if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    stopwatchRef.current = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    // Setup timer for first question
    resetQuestionTimer(config.timed);
  };

  const resetQuestionTimer = (isTimed: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isTimed) return;

    setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Timer finished - force correct answer reveal as incorrect
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeOut = () => {
    setAnswered(true);
    setSelectedOption(null); // No choice made
    
    const currentQ = activeQuestions[currentIndex];
    setIncorrectAnswers((prev) => [...prev, { question: currentQ, userSelection: null }]);
    addToSeenPool([currentQ.id]);
    if (!isMuted) playIncorrectSound();
  };

  const handleSelectOption = (idx: number) => {
    if (answered) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(idx);
    setAnswered(true);

    const currentQ = activeQuestions[currentIndex];
    if (idx === currentQ.answerIndex) {
      setScore((prev) => prev + 1);
      if (!isMuted) playCorrectSound();
    } else {
      setIncorrectAnswers((prev) => [...prev, { question: currentQ, userSelection: idx }]);
      if (!isMuted) playIncorrectSound();
    }

    // Track as seen
    addToSeenPool([currentQ.id]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
      resetQuestionTimer(config.timed);
    } else {
      // Game over
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
      setView("quiz_finished");
    }
  };

  // Evaluation title & badge based on score ratio
  const getEvaluation = (ratio: number) => {
    if (ratio === 1) return { title: "حارس بيت الحكمة الأعظم", desc: "أنت أسطورة تاريخية حقيقية! لقد أجبت على جميع الأسئلة الصعبة بشكل مثالي ولا مثيل لثقافتك الكبيرة.", color: "text-amber-600 border-amber-500 bg-amber-50", badge: "تاج الذهب" };
    if (ratio >= 0.8) return { title: "مؤرخ الإمبراطورية العتيد", desc: "مذهل! معرفتك بالتفاصيل والأحداث التاريخية عميقة للغاية ومثيرة للإعجاب.", color: "text-emerald-700 border-emerald-500 bg-emerald-50", badge: "وسام الذهب" };
    if (ratio >= 0.5) return { title: "الباحث التاريخي المساعد", desc: "أداء جيد جداً! لديك أساسيات متينة وقدرة جيدة على التحليل وحل الألغاز التاريخية.", color: "text-blue-700 border-blue-500 bg-blue-50", badge: "وسام الفضة" };
    return { title: "مستكشف مبتدئ", desc: "بداية رحلة معرفية رائعة! التاريخ مليء بالقصص والأسرار المثيرة، واصل اللعب لتكتشف المزيد.", color: "text-stone-600 border-stone-400 bg-stone-50", badge: "وسام البرونز" };
  };

  // Clean timers on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] text-stone-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white pb-12">
      {/* Navbar Component */}
      <Navbar 
        currentView={view} 
        setView={(v) => setView(v)} 
        isMuted={isMuted} 
        onToggleMute={toggleMute} 
      />

      {/* Main Container spacing with Navbar fixed */}
      <main className="flex-1 pt-24 max-w-7xl mx-auto w-full px-4 md:px-8">
        
        <AnimatePresence mode="wait">
          {/* VIEW: HOME PAGE */}
          {view === "home" && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto py-8 text-center"
            >
              {/* Main Welcome Card */}
              <div className="bg-[#fcf9f2] p-8 md:p-12 rounded-3xl border border-amber-500/20 shadow-xl relative overflow-hidden history-card">
                {/* Decorative corner accents */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/[0.03] rounded-bl-full"></div>
                
                <span className="text-xs font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> فوازير وألغاز تاريخية ممتعة
                </span>
                
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-950 mb-4 leading-tight serif-arabic">
                  هل تمتلك شجاعة مواجهة <span className="text-amber-700">ألغاز الماضي؟</span>
                </h2>
                
                <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                  تصفح أكثر من 100 لغز وفزورة تاريخية ذكية من مختلف الحقب التاريخية. اختبر عمق معلوماتك، وحل معضلات الماضي السحيق!
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                  <button
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto px-10 py-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer btn-hover text-lg"
                    id="home-start-btn"
                  >
                    <Award className="w-5 h-5" />
                    <span>ابدأ جولة تحدي الآن</span>
                  </button>
                  
                  <button
                    onClick={() => setView("explore")}
                    className="w-full sm:w-auto px-8 py-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/25"
                    id="home-explore-btn"
                  >
                    <BookOpen className="w-5 h-5 text-amber-800" />
                    <span>تصفح الموسوعة</span>
                  </button>
                </div>

                {/* Compact Customization Panel */}
                <div className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-6 text-right">
                  <h3 className="text-base font-bold text-stone-800 mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
                    <Flame className="w-4.5 h-4.5 text-amber-600" />
                    <span>تخصيص المعركة المعرفية الحالية:</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Questions Count */}
                    <div>
                      <span className="text-xs font-semibold text-stone-500 block mb-1.5">عدد الأسئلة:</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[5, 10, 15].map((num) => (
                          <button
                            key={num}
                            onClick={() => setConfig({ ...config, count: num })}
                            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                              config.count === num
                                ? "bg-amber-700 text-white shadow-sm"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                          >
                            {num} أسئلة
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Era Selector */}
                    <div>
                      <span className="text-xs font-semibold text-stone-500 block mb-1.5">الحقبة التاريخية:</span>
                      <select
                        value={config.era}
                        onChange={(e) => setConfig({ ...config, era: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="all">جميع الحقب التاريخية</option>
                        <option value="مصر القديمة">مصر القديمة (الفراعنة)</option>
                        <option value="العصور القديمة">العصور القديمة (الروم والإغريق)</option>
                        <option value="التاريخ الإسلامي">التاريخ والحضارة الإسلامية</option>
                        <option value="العصور الوسطى">العصور الوسطى وأوروبا</option>
                        <option value="تاريخ العالم">تاريخ العالم الحديث</option>
                        <option value="الحرب العالمية">الحرب العالمية الأولى والثانية</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <span className="text-xs font-semibold text-stone-500 block mb-1.5">مستوى الصعوبة:</span>
                      <select
                        value={config.difficulty}
                        onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="all">جميع المستويات المختلطة</option>
                        <option value="متوسط">متوسط الصعوبة فقط</option>
                        <option value="صعب">صعبة فقط</option>
                        <option value="شديد الصعوبة">شديدة الصعوبة فقط</option>
                      </select>
                    </div>

                    {/* Timed and unseen options */}
                    <div className="flex flex-col justify-center gap-2 pt-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.timed}
                          onChange={(e) => setConfig({ ...config, timed: e.target.checked })}
                          className="accent-amber-700 cursor-pointer w-4 h-4"
                        />
                        <span>عداد وقت (30 ثانية لكل لغز)</span>
                      </label>
                      
                      <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.unseenOnly}
                          onChange={(e) => setConfig({ ...config, unseenOnly: e.target.checked })}
                          className="accent-amber-700 cursor-pointer w-4 h-4"
                        />
                        <span>منع تكرار الأسئلة المحلولة سابقاً</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Compact Progress Badge */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 bg-[#faf6eb] border border-amber-500/10 px-4 py-3 rounded-xl">
                  <div className="flex items-center gap-1">
                    <History className="w-4 h-4 text-amber-600" />
                    <span>التقدم الحالي: {seenIds.length} من أصل {historyQuestions.length} سؤالاً</span>
                  </div>
                  
                  {seenIds.length > 0 && (
                    <button
                      onClick={resetSeenPool}
                      className="font-bold text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1"
                      id="reset-seen-pool-btn"
                    >
                      <RefreshCw className="w-3 h-3" />
                      تصفير السجل للبدء من جديد
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: QUIZ INSTRUCTIONS & START READY SCREEN */}
          {view === "quiz" && (
            <motion.div
              key="quiz-config-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-3xl mx-auto py-6"
            >
              <div className="bg-white/95 p-6 md:p-8 rounded-2xl shadow-xl border border-amber-500/10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                
                <div className="w-16 h-16 bg-amber-500 text-emerald-950 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Award className="w-8 h-8" />
                </div>
                
                <h2 className="text-3xl font-serif font-bold text-emerald-950 mb-2">تجهيز التحدي التاريخي الكبير</h2>
                <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
                  لقد اخترت الدخول إلى جولة التحدي. يمكنك تعديل الإعدادات في الأسفل ثم الضغط على زر البدء للانطلاق الفوري.
                </p>

                {/* Configuration Panel inside setup page */}
                <div className="bg-[#fbf9f1] border border-stone-200/80 rounded-2xl p-6 text-right mb-6 space-y-4">
                  <h3 className="font-bold text-emerald-950 border-b border-stone-200 pb-2 text-base flex items-center gap-2">
                    <ListChecks className="w-4.5 h-4.5 text-amber-600" />
                    إعدادات المعركة المعرفية:
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-semibold text-stone-500 block mb-1">الحقبة المفضلة:</span>
                      <select
                        value={config.era}
                        onChange={(e) => setConfig({ ...config, era: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="all">جميع الحقب التاريخية</option>
                        <option value="مصر القديمة">مصر القديمة (الفراعنة)</option>
                        <option value="العصور القديمة">العصور القديمة (الروم والإغريق)</option>
                        <option value="التاريخ الإسلامي">التاريخ والحضارة الإسلامية</option>
                        <option value="العصور الوسطى">العصور الوسطى وأوروبا</option>
                        <option value="تاريخ العالم">تاريخ العالم الحديث</option>
                        <option value="الحرب العالمية">الحرب العالمية الأولى والثانية</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-stone-500 block mb-1">عدد الألغاز:</span>
                      <select
                        value={config.count}
                        onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="5">5 أسئلة قصيرة</option>
                        <option value="10">10 أسئلة (مثالي)</option>
                        <option value="15">15 سؤالاً طويلاً</option>
                        <option value="20">20 سؤالاً للنوابغ</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-stone-500 block mb-1">مستوى الصعوبة:</span>
                      <select
                        value={config.difficulty}
                        onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="all">جميع المستويات المختلطة</option>
                        <option value="متوسط">متوسط الصعوبة فقط</option>
                        <option value="صعب">صعبة فقط</option>
                        <option value="شديد الصعوبة">شديدة الصعوبة فقط</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.timed}
                            onChange={(e) => setConfig({ ...config, timed: e.target.checked })}
                            className="accent-amber-500 cursor-pointer"
                          />
                          <span>عداد وقت (30 ث)</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.unseenOnly}
                            onChange={(e) => setConfig({ ...config, unseenOnly: e.target.checked })}
                            className="accent-amber-500 cursor-pointer"
                          />
                          <span>منع تكرار الأسئلة</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setView("home")}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition cursor-pointer"
                  >
                    تراجع
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="px-8 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                    id="setup-start-quiz-btn"
                  >
                    البدء فوراً
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: QUIZ ACTIVE PLAYING SCREEN */}
          {view === "quiz_playing" && activeQuestions.length > 0 && (
            <motion.div
              key="quiz-playing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto py-4"
            >
              {/* Top status bar */}
              <div className="flex items-center justify-between mb-5 px-1 bg-white/60 py-3 rounded-xl border border-stone-200/55 shadow-sm px-4">
                <div className="flex items-center gap-2 text-stone-600 font-semibold text-sm">
                  <span>السؤال</span>
                  <span className="text-amber-700 text-lg font-bold">{currentIndex + 1}</span>
                  <span>من أصل</span>
                  <span className="text-stone-800">{activeQuestions.length}</span>
                </div>

                {/* Score badge */}
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>النقاط: {score}</span>
                </div>

                {/* Optional Timer indicator */}
                {config.timed && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-bold transition-colors ${
                    timer <= 8 
                      ? "bg-red-50 text-red-700 border-red-200 animate-pulse" 
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}>
                    <Timer className={`w-4 h-4 ${timer <= 8 ? "animate-spin-slow" : ""}`} />
                    <span>00:{timer < 10 ? "0" : ""}{timer}</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-stone-200 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Notice of mixed questions if any */}
              {currentIndex === 0 && eraNotice && (
                <div className="bg-amber-50 text-amber-800 border border-amber-200/60 p-3 rounded-xl text-xs mb-4">
                  {eraNotice}
                </div>
              )}

              {/* MAIN QUESTION CARD */}
              <div className="bg-white rounded-3xl shadow-xl border border-amber-500/10 p-6 md:p-8 relative overflow-hidden">
                {/* Ancient theme watermark */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full"></div>
                
                {/* Era & Difficulty row */}
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold">
                    حقبـة: {activeQuestions[currentIndex].era}
                  </span>
                  
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                    activeQuestions[currentIndex].difficulty === "شديد الصعوبة"
                      ? "bg-red-50 text-red-800"
                      : activeQuestions[currentIndex].difficulty === "صعب"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-blue-50 text-blue-800"
                  }`}>
                    {activeQuestions[currentIndex].difficulty}
                  </span>
                </div>

                {/* Riddle / Question Title */}
                <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-950 leading-relaxed mb-6 text-right">
                  {activeQuestions[currentIndex].question}
                </h3>

                {/* Multiple choices */}
                <div className="space-y-3 mb-6" id="quiz-options-container">
                  {activeQuestions[currentIndex].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeQuestions[currentIndex].answerIndex;
                    
                    // Determine styling based on state
                    let optionStyle = "border-stone-200 hover:border-amber-500 hover:bg-amber-500/[0.02] text-stone-700 bg-white";
                    let iconNode = null;

                    if (answered) {
                      if (isCorrect) {
                        optionStyle = "bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/20";
                        iconNode = <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />;
                      } else if (isSelected) {
                        optionStyle = "bg-red-50 border-red-500 text-red-900 font-bold ring-2 ring-red-500/20";
                        iconNode = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
                      } else {
                        optionStyle = "bg-stone-50 border-stone-200 text-stone-400 opacity-70 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={answered}
                        className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between text-base cursor-pointer ${optionStyle}`}
                        id={`quiz-option-${idx}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            answered && isCorrect
                              ? "bg-amber-700 text-white"
                              : answered && isSelected
                              ? "bg-red-600 text-white"
                              : "bg-stone-100 text-stone-500"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-medium">{option}</span>
                        </div>
                        {iconNode}
                      </button>
                    );
                  })}
                </div>

                {/* TIME OUT OR FEEDBACK NOTICES */}
                {answered && selectedOption === null && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-sm font-semibold mb-6 flex items-center gap-2">
                    <Timer className="w-5 h-5 shrink-0" />
                    <span>لقد انتهى الوقت المخصص لهذا اللغز! الإجابة الصحيحة هي: {activeQuestions[currentIndex].options[activeQuestions[currentIndex].answerIndex]}</span>
                  </div>
                )}

                {/* EXPLANATORY STORY AND HISTORICAL BACKGROUND */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-500/5 rounded-2xl border border-amber-500/10 p-5 mb-6 text-right"
                    >
                      <h4 className="text-amber-800 font-bold text-sm mb-1.5 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 animate-spin-slow" />
                        السر والخلفية التاريخية للغز:
                      </h4>
                      <p className="text-stone-700 text-sm leading-relaxed text-justify">
                        {activeQuestions[currentIndex].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CONTROL ACTION BAR */}
                {answered && (
                  <div className="flex justify-end pt-2 border-t border-stone-100">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      id="next-question-btn"
                    >
                      <span>
                        {currentIndex + 1 === activeQuestions.length ? "مشاهدة التقييم النهائي" : "اللغز التالي"}
                      </span>
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* VIEW: QUIZ COMPLETED & FINAL EVALUATION SCREEN */}
          {view === "quiz_finished" && (
            <motion.div
              key="quiz-finished-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto py-4"
            >
              {/* Outer Parchment Box */}
              <div className="bg-white rounded-3xl shadow-xl border border-amber-500/15 p-6 md:p-8 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-3">
                  انتهى التحدي التاريخي بنجاح
                </span>
                
                {/* score evaluation node */}
                {(() => {
                  const ratio = score / activeQuestions.length;
                  const evalData = getEvaluation(ratio);
                  return (
                    <div id="evaluation-card">
                      <h2 className="text-3xl font-serif font-bold text-amber-950 mb-2">
                        {evalData.title}
                      </h2>
                      
                      {/* Badge and score badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-bold text-sm mb-6 shadow-sm bg-amber-50 border-amber-200 text-amber-800">
                        <Award className="w-4.5 h-4.5" />
                        <span>وسام الاستحقاق: {evalData.badge}</span>
                      </div>

                      {/* Score Circle Indicator */}
                      <div className="w-36 h-36 rounded-full border-4 border-amber-500/30 mx-auto mb-6 flex flex-col items-center justify-center bg-stone-50/50 shadow-inner relative">
                        {/* Outer rotating/glowing border if perfect score */}
                        {ratio === 1 && (
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500 animate-spin-slow"></div>
                        )}
                        <span className="text-4xl font-serif font-bold text-amber-950">
                          {score} / {activeQuestions.length}
                        </span>
                        <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider mt-1">
                          الإجابات الصحيحة
                        </span>
                      </div>

                      <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto mb-8 bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                        {evalData.desc}
                      </p>
                    </div>
                  );
                })()}

                {/* Brief details of play stats */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-right">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 flex items-center justify-between">
                    <span className="text-xs text-stone-500">الوقت المستغرق:</span>
                    <span className="text-sm font-bold text-stone-800">{formatTime(timeTaken)}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 flex items-center justify-between">
                    <span className="text-xs text-stone-500">نسبة الدقة:</span>
                    <span className="text-sm font-bold text-stone-800">
                      {Math.round((score / activeQuestions.length) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Incorrect questions details to review */}
                {incorrectAnswers.length > 0 && (
                  <div className="mb-8 text-right">
                    <h3 className="font-bold text-stone-800 text-base mb-3 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-red-600" />
                      <span>مراجعة الأسئلة التي تعثرت بها للتعلّم:</span>
                    </h3>
                    
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                      {incorrectAnswers.map((item, idx) => (
                        <div key={idx} className="bg-[#fffcf6] p-4 rounded-xl border border-amber-500/10 shadow-sm">
                          <p className="text-sm font-serif font-bold text-stone-800 mb-1.5">
                            {idx + 1}. {item.question.question}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-stone-500 mb-2">
                            <span>الإجابة الصحيحة:</span>
                            <span className="font-bold text-amber-800">
                              {item.question.options[item.question.answerIndex]}
                            </span>
                            {item.userSelection !== null && (
                              <>
                                <span className="mr-2">اختيارك:</span>
                                <span className="font-bold text-red-700">
                                  {item.question.options[item.userSelection]}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-stone-600 leading-relaxed bg-amber-500/[0.02] p-2.5 rounded-lg border border-amber-500/5 italic">
                            {item.question.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Replay commands */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setView("home")}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition cursor-pointer"
                    id="finish-back-home-btn"
                  >
                    الصفحة الرئيسية
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                    id="finish-replay-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة اللعب بنفس الإعدادات</span>
                  </button>
                  <button
                    onClick={() => setView("quiz")}
                    className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                    id="finish-edit-config-btn"
                  >
                    تغيير الإعدادات
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: ENCYCLOPEDIA / EXPLORE WORLD */}
          {view === "explore" && (
            <motion.div
              key="explore-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Explore />
            </motion.div>
          )}

          {/* VIEW: ABOUT PAGE */}
          {view === "about" && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <About />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Decorative page layout divider */}
      <footer className="mt-16 text-center text-xs text-stone-400 font-sans border-t border-stone-200/50 pt-6">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          <span>تطبيق فوازير تاريخية متجددة</span>
          <span>•</span>
          <span>تصميم شيك وبسيط بطراز عتيق</span>
        </div>
      </footer>
    </div>
  );
}
