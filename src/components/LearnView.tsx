import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Search,
} from 'lucide-react';
import {
  GLOSSARY_TERMS,
  LESSONS,
  TOPIC_MODULES,
  type DifficultyLevel,
  type Lesson,
  type TopicId,
} from '../data/curriculum';

interface LearnViewProps {
  learnerName: string;
  currentLevel: string;
  preferredTopic: TopicId;
  learnerLevel: DifficultyLevel;
  selectedTopicId: TopicId | 'all';
  onSelectTopicId: (topicId: TopicId | 'all') => void;
  activeLessonId: string;
  onSelectLessonId: (lessonId: string) => void;
  completedLessons: string[];
  onToggleCompleteLesson: (lessonId: string) => void;
  onAskAboutTopic: (prompt: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  learnerName,
  currentLevel,
  preferredTopic,
  learnerLevel,
  selectedTopicId,
  onSelectTopicId,
  activeLessonId,
  onSelectLessonId,
  completedLessons,
  onToggleCompleteLesson,
  onAskAboutTopic,
}) => {
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | 'All'>('All');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAlternateAnalogy, setShowAlternateAnalogy] = useState<boolean>(false);
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');

  const preferredModuleTitle =
    TOPIC_MODULES.find((m) => m.id === preferredTopic)?.title || 'Budgeting and Saving';

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesTopic = selectedTopicId === 'all' || lesson.topicId === selectedTopicId;
    const matchesLevel = levelFilter === 'All' || lesson.level === levelFilter;
    return matchesTopic && matchesLevel;
  });

  const activeLesson: Lesson =
    LESSONS.find((l) => l.id === activeLessonId) || filteredLessons[0] || LESSONS[0];

  const isCompleted = completedLessons.includes(activeLesson.id);
  const nextLesson =
    LESSONS.find((l) => l.id === activeLesson.nextRecommendedLessonId) || LESSONS[0];

  const handleLessonSwitch = (lesson: Lesson) => {
    onSelectLessonId(lesson.id);
    setSelectedOption(null);
    setShowAlternateAnalogy(false);
  };

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
      item.simpleDefinition.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">
      {/* Header & Learning Path Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-teal-700">
            <span>{learnerName.trim() ? `${learnerName.trim()}’s Curriculum` : 'Structured Curriculum'}</span>
            <span className="mx-1.5">·</span>
            <span>{currentLevel}</span>
            <span className="mx-1.5">·</span>
            <span>Focus: {preferredModuleTitle}</span>
            <span className="mx-1.5">·</span>
            <span>{learnerLevel} Difficulty</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Financial Literacy Learning Paths
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Step-by-step lessons covering Money Fundamentals, Budgeting & Saving, Investing
            Fundamentals, and Financial Planning & Wealth Habits.
          </p>
        </div>

        {/* Interactive Level Filter */}
        <div
          role="group"
          aria-label="Filter lessons by difficulty level"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto"
        >
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelFilter(lvl)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl === 'All' ? 'All Paths' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Topic Modules Overview Cards */}
      <section aria-label="Core Learning Modules" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Filter by Core Subject Module
          </h2>
          {selectedTopicId !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectTopicId('all')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              Show All Modules
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOPIC_MODULES.map((mod) => {
            const isSelected = selectedTopicId === mod.id;
            const modLessons = LESSONS.filter((l) => l.topicId === mod.id);
            const doneCount = modLessons.filter((l) => completedLessons.includes(l.id)).length;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  onSelectTopicId(isSelected ? 'all' : mod.id);
                  if (!isSelected && modLessons[0]) {
                    handleLessonSwitch(modLessons[0]);
                  }
                }}
                className={`text-left p-5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                    <span className="font-semibold text-teal-700">{mod.code}</span>
                    <span>
                      {doneCount}/{modLessons.length} completed
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{mod.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{mod.subtitle}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  {mod.subtopics.slice(0, 3).join(' · ')}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Two-Column Split: Lesson Selector Sidebar + Interactive Lesson Reader */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Lessons List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 px-1">
            Available Lessons ({filteredLessons.length})
          </h2>
          <div className="space-y-2.5">
            {filteredLessons.map((lesson, idx) => {
              const isCurrent = lesson.id === activeLesson.id;
              const done = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleLessonSwitch(lesson)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-teal-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={isCurrent ? 'text-teal-300' : 'text-slate-500'}>
                      0{idx + 1} · {lesson.level} · {lesson.durationMinutes} min
                    </span>
                    {done && (
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          isCurrent ? 'text-emerald-300' : 'text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold mt-1.5">{lesson.title}</h3>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      isCurrent ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {lesson.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Stage: Interactive Lesson Reader (8 cols) */}
        <article className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8">
          {/* Lesson Header */}
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                <span className="font-semibold text-teal-700">{activeLesson.topicTitle}</span>
                <span className="mx-1.5">·</span>
                <span>{activeLesson.level} Level</span>
                <span className="mx-1.5">·</span>
                <span>{activeLesson.durationMinutes} min read</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleCompleteLesson(activeLesson.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : 'Mark Lesson Complete'}</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {activeLesson.title}
            </h2>
            <p className="text-sm text-slate-600">{activeLesson.summary}</p>
          </div>

          {/* 1. Plain-English Explanation */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Concept Explained in Plain English</span>
            </h3>
            <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              {activeLesson.plainExplanation.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* 2. Practical Indian ₹ Example */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5">
            <div className="text-xs font-semibold text-teal-800">
              Real-Life Indian Example · Currency in ₹ (INR)
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {activeLesson.indianExample.title}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {activeLesson.indianExample.scenario}
            </p>
            <div className="pt-2 border-t border-slate-200/80 text-sm font-medium text-slate-900">
              <strong>Outcome: </strong>
              {activeLesson.indianExample.calculationOrOutcome}
            </div>
          </div>

          {/* 3. Comparison Table */}
          {activeLesson.comparisonTable && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                {activeLesson.comparisonTable.caption}
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-800">
                      {activeLesson.comparisonTable.headers.map((h) => (
                        <th key={h} className="py-3 px-4 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeLesson.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-3 px-4 tabular-nums ${
                              cIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Interactive Check Question (One Question at a Time + Alternate Explanation for Struggling Learners) */}
          <div className="bg-teal-50/40 border border-teal-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-teal-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-700" />
                <span>Interactive Lesson Check · 1 Question</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAlternateAnalogy((prev) => !prev)}
                className="text-xs font-semibold text-teal-800 hover:text-teal-950 underline cursor-pointer"
              >
                {showAlternateAnalogy
                  ? 'Hide Everyday Analogy'
                  : 'Struggling? Explain this concept differently'}
              </button>
            </div>

            {showAlternateAnalogy && (
              <div className="bg-white border border-teal-200 rounded-lg p-4 text-xs sm:text-sm text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Simpler Everyday Analogy from FinBuddy:</span>
                </p>
                <p>{activeLesson.interactiveCheck.alternateExplanation}</p>
              </div>
            )}

            <p className="text-sm sm:text-base font-bold text-slate-900">
              {activeLesson.interactiveCheck.question}
            </p>

            <div className="space-y-2.5">
              {activeLesson.interactiveCheck.options.map((option, idx) => {
                const isPicked = selectedOption === idx;
                const isRight = idx === activeLesson.interactiveCheck.correctIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                      selectedOption === null
                        ? 'bg-white border-slate-200 text-slate-800 hover:border-teal-600'
                        : isPicked && isRight
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                        : isPicked && !isRight
                        ? 'bg-amber-50 border-amber-600 text-amber-950 font-semibold'
                        : isRight
                        ? 'bg-emerald-50/60 border-emerald-400 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div
                className={`p-4 rounded-lg border text-xs sm:text-sm space-y-2 ${
                  selectedOption === activeLesson.interactiveCheck.correctIndex
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <p className="font-semibold">
                  {selectedOption === activeLesson.interactiveCheck.correctIndex
                    ? activeLesson.interactiveCheck.correctFeedback
                    : activeLesson.interactiveCheck.incorrectFeedback}
                </p>
                {selectedOption !== activeLesson.interactiveCheck.correctIndex && (
                  <p className="text-slate-700 pt-1 border-t border-amber-200">
                    <strong>Let’s look at it another way: </strong>
                    {activeLesson.interactiveCheck.alternateExplanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 5. Key Takeaways (3 to 5 bullet points) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Key Lesson Takeaways
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              {activeLesson.keyTakeaways.map((point, idx) => (
                <li key={idx} className="leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Lesson Footer Actions & Recommended Next Lesson */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isCompleted) onToggleCompleteLesson(activeLesson.id);
                }}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Lesson Completed' : 'Complete Lesson & Save Progress'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onAskAboutTopic(
                    `Can you explain "${activeLesson.title}" with another simple Indian example?`
                  )
                }
                className="px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
                <span>Ask FinBuddy About This</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleLessonSwitch(nextLesson)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>Next: {nextLesson.title.slice(0, 26)}...</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </article>
      </section>

      {/* Searchable Financial Glossary Section */}
      <section aria-labelledby="glossary-heading" className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-teal-700">
              Plain-Language Dictionary · Zero Jargon
            </p>
            <h2 id="glossary-heading" className="text-2xl font-bold text-slate-900 mt-1">
              Financial Literacy Glossary
            </h2>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              aria-label="Search financial glossary terms"
              placeholder="Search UPI, CIBIL, SIP, PPF, Inflation..."
              value={glossaryQuery}
              onChange={(e) => setGlossaryQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        {filteredGlossary.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
            <p className="text-sm text-slate-600">
              No glossary terms matched “{glossaryQuery}”.
            </p>
            <button
              type="button"
              onClick={() => setGlossaryQuery('')}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((item) => (
              <div
                key={item.term}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-2"
              >
                <div className="text-xs text-slate-500">{item.category}</div>
                <h3 className="text-base font-bold text-slate-900">{item.term}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.simpleDefinition}
                </p>
                <p className="text-xs text-teal-800 pt-2 border-t border-slate-100">
                  <strong>Example:</strong> {item.indianExample}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
