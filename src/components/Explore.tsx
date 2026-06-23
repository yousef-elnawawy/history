import React from "react";
import { Search, Compass, BookOpen, ChevronDown, ChevronUp, AlertCircle, HelpCircle } from "lucide-react";
import { historyQuestions, Question } from "../questions";

export default function Explore() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEra, setSelectedEra] = React.useState("all");
  const [selectedDiff, setSelectedDiff] = React.useState("all");
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const eras = ["all", "مصر القديمة", "العصور القديمة", "التاريخ الإسلامي", "العصور الوسطى", "تاريخ العالم", "الحرب العالمية"];
  const difficulties = ["all", "متوسط", "صعب", "شديد الصعوبة"];

  const filteredQuestions = React.useMemo(() => {
    return historyQuestions.filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesEra = selectedEra === "all" || q.era === selectedEra;
      const matchesDiff = selectedDiff === "all" || q.difficulty === selectedDiff;
      return matchesSearch && matchesEra && matchesDiff;
    });
  }, [searchQuery, selectedEra, selectedDiff]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 font-sans" id="explore-section">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full text-xs font-semibold mb-3">
          موسوعة الفوازير
        </span>
        <h1 className="text-4xl font-serif font-bold text-amber-950 mb-3">
          مستكشف الأسرار التاريخية
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          تصفح الأسئلة والألغاز التاريخية الصعبة واكتشف الإجابات النموذجية مع شرح مفصل للخلفيات التاريخية الغنية وراء كل لغز.
        </p>
        <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4"></div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/85 backdrop-blur-sm shadow-md rounded-2xl p-5 border border-amber-500/10 mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <label className="text-xs font-semibold text-stone-500 mb-1 block">ابحث عن لغز أو حدث:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="مثال: صلاح الدين، روما، نابليون..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 text-sm placeholder:text-stone-400 transition"
              id="explore-search-input"
            />
            <Search className="w-5 h-5 text-stone-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Era Filter */}
        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-stone-500 mb-1 block">الحقبة الزمنية:</label>
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 text-sm transition cursor-pointer"
            id="explore-era-filter"
          >
            {eras.map((era) => (
              <option key={era} value={era}>
                {era === "all" ? "جميع الحقب التاريخية" : era}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-stone-500 mb-1 block">مستوى الصعوبة:</label>
          <select
            value={selectedDiff}
            onChange={(e) => setSelectedDiff(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 text-sm transition cursor-pointer"
            id="explore-diff-filter"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff === "all" ? "جميع الصعوبات" : diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4" id="explore-questions-list">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-amber-500/50 shadow-lg ring-1 ring-amber-500/20"
                    : "border-stone-200/80 shadow-sm hover:border-amber-500/30 hover:shadow-md"
                }`}
              >
                {/* Header/Question Trigger */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  id={`explore-q-trigger-${q.id}`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2.5">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded border border-amber-200">
                        {q.era}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                          q.difficulty === "شديد الصعوبة"
                            ? "bg-red-50 text-red-800 border-red-100"
                            : q.difficulty === "صعب"
                            ? "bg-amber-50 text-amber-800 border-amber-100"
                            : "bg-blue-50 text-blue-800 border-blue-100"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-800 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                  <div className="mt-1 text-amber-600">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="bg-stone-50/50 border-t border-stone-100 p-5 animate-in fade-in duration-200">
                    {/* Options list */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-500 mb-2">الخيارات المتاحة للغز:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((option, idx) => {
                          const isCorrect = idx === q.answerIndex;
                          return (
                            <div
                              key={idx}
                              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 border ${
                                isCorrect
                                  ? "bg-amber-50 text-amber-950 border-amber-200/80 font-semibold"
                                  : "bg-white text-stone-600 border-stone-200/60"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                                  isCorrect ? "bg-amber-700 text-white" : "bg-stone-100 text-stone-500"
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span>{option}</span>
                              {isCorrect && <span className="mr-auto text-amber-700 font-bold text-xs">الإجابة الصحيحة</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Historical Explanation */}
                    <div className="bg-amber-500/5 rounded-xl border border-amber-500/10 p-4">
                      <h4 className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" /> القصة والخلفية التاريخية:
                      </h4>
                      <p className="text-stone-700 text-sm leading-relaxed text-justify">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/80 shadow-inner flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-stone-400 mb-3" />
            <p className="text-stone-600 font-medium">لم يتم العثور على أي فوازير تطابق خيارات البحث الحالية.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedEra("all");
                setSelectedDiff("all");
              }}
              className="mt-3 text-sm text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
            >
              إعادة تهيئة خيارات الفرز
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
