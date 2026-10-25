import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Compass,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  DAILY_LESSONS,
  LESSONS,
  QUICK_START_CHOICES,
  TOPIC_MODULES,
  type DifficultyLevel,
  type Lesson,
  type TopicId,
} from '../data/curriculum';
import type { CurrentKnowledgeLevel } from '../App';
import { formatINR } from '../utils/calculators';
import type { ActiveTab } from './Navbar';

interface HomeViewProps {
  learnerName: string;
  onChangeLearnerName: (name: string) => void;
  currentLevel: CurrentKnowledgeLevel;
  onChangeCurrentLevel: (level: CurrentKnowledgeLevel) => void;
  preferredTopic: TopicId;
  onChangePreferredTopic: (topic: TopicId) => void;
  learnerLevel: DifficultyLevel;
  onChangeLearnerLevel: (level: DifficultyLevel) => void;
  learnerGoal: string;
  onChangeLearnerGoal: (goal: string) => void;
  completedLessons: string[];
  quizScores: Record<string, boolean>;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenLesson: (lessonId: string, topicId?: TopicId) => void;
  onAskQuestionWithPrompt: (prompt: string) => void;
}

const CURRENT_LEVEL_OPTIONS: CurrentKnowledgeLevel[] = [
  'New to Finance',
  'Know the Basics',
  'Managing Money Actively',
];

export const HomeView: React.FC<HomeViewProps> = ({
  learnerName,
  onChangeLearnerName,
  currentLevel,
  onChangeCurrentLevel,
  preferredTopic,
  onChangePreferredTopic,
  learnerLevel,
  onChangeLearnerLevel,
  learnerGoal,
  onChangeLearnerGoal,
  completedLessons,
  quizScores,
  onNavigateTab,
  onOpenLesson,
  onAskQuestionWithPrompt,
}) => {
  const [previewSalary, setPreviewSalary] = useState<number>(30000);
  const [dailyLessonIndex, setDailyLessonIndex] = useState<number>(0);
  const [dailyAnswer, setDailyAnswer] = useState<number | null>(null);

  const currentDaily = DAILY_LESSONS[dailyLessonIndex];

  const preferredModuleTitle =
    TOPIC_MODULES.find((m) => m.id === preferredTopic)?.title || 'Budgeting and Saving';

  // Determine recommended next lesson based on preferredTopic, difficulty preference, & completion
  const nextRecommendedLesson: Lesson =
    LESSONS.find(
      (l) =>
        !completedLessons.includes(l.id) &&
        l.topicId === preferredTopic &&
        l.level === learnerLevel
    ) ||
    LESSONS.find((l) => !completedLessons.includes(l.id) && l.topicId === preferredTopic) ||
    LESSONS.find((l) => !completedLessons.includes(l.id) && l.level === learnerLevel) ||
    LESSONS.find((l) => !completedLessons.includes(l.id)) ||
    LESSONS[0];

  const essentialNeeds = Math.round(previewSalary * 0.6);
  const lifestyleWants = Math.round(previewSalary * 0.2);
  const monthlySavings = Math.round(previewSalary * 0.2);
  const emergencyTarget3Mo = essentialNeeds * 3;

  const masteredQuizzes = Object.values(quizScores).filter(Boolean).length;

  const goalsList = [
    'Save from my monthly salary & build an emergency fund',
    'Master money fundamentals, inflation & compounding',
    'Start investing via SIPs & Mutual Funds safely',
    'Plan financial goals & eliminate high-interest debt',
  ];

  const displayGreetingName = learnerName.trim() ? `Hi ${learnerName.trim()}!` : 'Hi!';

  return (
    <div className="space-y-12 pb-16 bg-[#EEF4F1] text-[#0F172A]">
      {/* Hero Section: Milk White (#EEF4F1) canvas, Deep Navy (#0F172A) headers, Classic Teal (#0EA5E9) brand actions, Mint Green (#10B981) growth numbers */}
      <section className="bg-[#EEF4F1] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column: FinBuddy Greeting & Personalizer */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold tracking-wide text-[#0EA5E9]">
                  Learn Money. Build Confidence. Secure Your Future.
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] text-balance leading-tight">
                  {displayGreetingName} I’m FinBuddy, your personal financial literacy tutor. 👋
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  I’m here to help you understand money, make smarter financial decisions, and build
                  confidence one lesson at a time. Personalize your profile below so every example,
                  lesson, and quiz fits you.
                </p>
              </div>

              {/* Personalize Name, Current Level, Topic & Difficulty Preference */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-[#0F172A]">
                      Personalize Your Learning Profile
                    </h2>
                    <p className="text-xs text-slate-600">
                      Set your name, current level, focus topic, and difficulty preference.
                    </p>
                  </div>
                  <div className="text-xs text-[#0EA5E9] font-semibold">
                    <span>{currentLevel}</span>
                    <span className="mx-1.5">·</span>
                    <span>{learnerLevel} Difficulty</span>
                  </div>
                </div>

                {/* Row 1: Name + Current Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="learner-name-input"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Your Name:
                    </label>
                    <input
                      id="learner-name-input"
                      type="text"
                      value={learnerName}
                      onChange={(e) => onChangeLearnerName(e.target.value)}
                      placeholder="e.g., Aarav, Priya"
                      className="w-full bg-[#EEF4F1] border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="learner-current-level-select"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Current Knowledge Level:
                    </label>
                    <select
                      id="learner-current-level-select"
                      value={currentLevel}
                      onChange={(e) =>
                        onChangeCurrentLevel(e.target.value as CurrentKnowledgeLevel)
                      }
                      className="w-full bg-[#EEF4F1] border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                    >
                      {CURRENT_LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Preferred Focus Topic + Difficulty Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                  <div>
                    <label
                      htmlFor="learner-topic-select"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Preferred Focus Topic:
                    </label>
                    <select
                      id="learner-topic-select"
                      value={preferredTopic}
                      onChange={(e) => onChangePreferredTopic(e.target.value as TopicId)}
                      className="w-full bg-[#EEF4F1] border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                    >
                      {TOPIC_MODULES.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          {mod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                      Difficulty Preference:
                    </span>
                    <div
                      role="group"
                      aria-label="Difficulty Preference"
                      className="grid grid-cols-3 gap-1 p-1 bg-[#EEF4F1] border border-slate-300 rounded-lg"
                    >
                      {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map(
                        (level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => onChangeLearnerLevel(level)}
                            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              learnerLevel === level
                                ? 'bg-[#0EA5E9] text-white font-semibold shadow-xs'
                                : 'text-slate-600 hover:text-[#0F172A]'
                            }`}
                          >
                            {level}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 3: Primary Financial Goal */}
                <div>
                  <label
                    htmlFor="learner-goal-select"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    My Primary Financial Goal:
                  </label>
                  <select
                    id="learner-goal-select"
                    value={learnerGoal}
                    onChange={(e) => onChangeLearnerGoal(e.target.value)}
                    className="w-full bg-[#EEF4F1] border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
                  >
                    {goalsList.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Hero CTA Row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onOpenLesson(nextRecommendedLesson.id, nextRecommendedLesson.topicId)
                  }
                  className="px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Start Recommended Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAskQuestionWithPrompt('I earn ₹30,000 per month. How can I start saving?')
                  }
                  className="px-5 py-3 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Ask FinBuddy: “How to save on ₹30,000?”
                </button>
              </div>
            </div>

            {/* Right Column: Interactive ₹30,000 Salary Starter Sandbox */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#0EA5E9]">
                  <span>Interactive Salary Sandbox</span>
                  <span aria-hidden="true">·</span>
                  <span>Illustrative 60/20/20 Plan</span>
                </div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  See How Your Monthly Salary Can Work for You
                </h2>
                <p className="text-xs text-slate-600">
                  Drag the slider to test FinBuddy’s beginner-friendly monthly allocation in Indian
                  Rupees (₹).
                </p>
              </div>

              <div className="space-y-3 bg-[#EEF4F1] p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="hero-salary-slider"
                    className="text-xs font-semibold text-[#0F172A]"
                  >
                    Monthly Take-Home Salary:
                  </label>
                  <span className="text-lg font-bold font-mono tabular-nums text-[#0EA5E9]">
                    {formatINR(previewSalary)}
                  </span>
                </div>
                <input
                  id="hero-salary-slider"
                  type="range"
                  min={10000}
                  max={150000}
                  step={2500}
                  value={previewSalary}
                  onChange={(e) => setPreviewSalary(Number(e.target.value))}
                  className="w-full accent-[#0EA5E9] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-500">
                  <span>₹10,000</span>
                  <span>₹30,000</span>
                  <span>₹75,000</span>
                  <span>₹1,50,000</span>
                </div>
              </div>

              {/* Visual Allocation Bar highlighting Needs, Wants, and Mint Green (#10B981) Savings */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100">
                  <div style={{ width: '60%' }} className="bg-[#0F172A]" title="Essential Needs (60%)" />
                  <div style={{ width: '20%' }} className="bg-[#0EA5E9]" title="Lifestyle Wants (20%)" />
                  <div style={{ width: '20%' }} className="bg-[#10B981]" title="Monthly Savings (20%)" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>60% Needs</span>
                  <span className="text-[#0EA5E9] font-medium">20% Wants</span>
                  <span className="text-[#10B981] font-semibold">20% Growth & Savings</span>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="font-semibold text-[#0F172A]">Essential Expenses (60%)</p>
                    <p className="text-xs text-slate-500">Rent, groceries, bills, commute</p>
                  </div>
                  <span className="font-mono font-semibold tabular-nums text-[#0F172A]">
                    {formatINR(essentialNeeds)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="font-semibold text-[#0F172A]">Personal & Lifestyle Wants (20%)</p>
                    <p className="text-xs text-slate-500">Dining out, hobbies, shopping</p>
                  </div>
                  <span className="font-mono font-semibold tabular-nums text-[#0EA5E9]">
                    {formatINR(lifestyleWants)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-semibold text-[#10B981] flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Savings & Financial Goals (20%)</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      3-Month Emergency Target: {formatINR(emergencyTarget3Mo)}
                    </p>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-[#10B981]">
                    +{formatINR(monthlySavings)}/mo
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigateTab('calculators')}
                  className="w-full py-2.5 px-4 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Open Smart Budget & SIP Calculators
                </button>
              </div>
            </div>
          </div>

          {/* Full-width KPI / Learning Progress Strip below the Hero split */}
          <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500">
                {learnerName.trim() ? `${learnerName.trim()}’s Profile` : 'Your Personalized Path'}
              </p>
              <p className="text-lg font-bold text-[#0F172A] mt-1">{learnerLevel} Difficulty</p>
              <p className="text-xs text-[#0EA5E9] font-medium mt-1">
                {currentLevel} · {preferredModuleTitle}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500">Lessons Completed</p>
              <p className="text-lg font-bold font-mono tabular-nums text-[#0F172A] mt-1">
                {completedLessons.length} / {LESSONS.length}
              </p>
              <p className="text-xs text-[#10B981] font-medium mt-1">
                Next: {nextRecommendedLesson.title.slice(0, 28)}...
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500">Quiz Questions Mastered</p>
              <p className="text-lg font-bold font-mono tabular-nums text-[#10B981] mt-1">
                {masteredQuizzes} / 8
              </p>
              <p className="text-xs text-slate-600 mt-1">Instant Explanations & Feedback</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500">Interactive Financial Tools</p>
              <p className="text-lg font-bold font-mono tabular-nums text-[#0F172A] mt-1">
                6 Smart Calculators
              </p>
              <p className="text-xs text-[#0EA5E9] font-medium mt-1">
                Budget · SIP · Debt Payoff · EMI · Inflation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 space-y-14">
        {/* Section 1: 6 Quick-Start Learning Choices */}
        <section aria-labelledby="quickstart-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0EA5E9]">
                Quick-Start Choices · Zero Registration Required
              </p>
              <h2
                id="quickstart-heading"
                className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1"
              >
                Choose Where You Would Like to Begin Today
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('learn')}
              className="text-sm font-semibold text-[#0EA5E9] hover:text-[#0284C7] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Browse All 4 Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUICK_START_CHOICES.map((choice) => (
              <div
                key={choice.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-[#0EA5E9] transition-colors"
              >
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-500">
                    <span className="text-[#0EA5E9] font-semibold">Option {choice.number}</span>
                    <span className="mx-1.5">·</span>
                    <span>Interactive Module</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{choice.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{choice.description}</p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (choice.targetTab === 'ask') {
                        onNavigateTab('ask');
                      } else if (choice.targetTab === 'quizzes') {
                        onNavigateTab('quizzes');
                      } else {
                        onOpenLesson(choice.targetLessonId, choice.targetTopic);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-[#0F172A] hover:bg-[#0EA5E9] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>
                      {choice.targetTab === 'ask'
                        ? 'Chat with FinBuddy Now'
                        : choice.targetTab === 'quizzes'
                        ? 'Start Quizzes & Scenarios'
                        : 'Start This Lesson'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Daily Money Lesson & Personalized Next Lesson Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Daily Money Lesson (7 columns) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-[#0EA5E9]">{currentDaily.dayLabel}</span>
                  <span className="mx-1.5">·</span>
                  <span>{currentDaily.category}</span>
                  <span className="mx-1.5">·</span>
                  <span>{currentDaily.readTime}</span>
                </div>
                <div className="flex items-center gap-1 bg-[#EEF4F1] p-1 rounded-lg border border-slate-200">
                  {DAILY_LESSONS.map((dl, idx) => (
                    <button
                      key={dl.id}
                      type="button"
                      onClick={() => {
                        setDailyLessonIndex(idx);
                        setDailyAnswer(null);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        dailyLessonIndex === idx
                          ? 'bg-[#0EA5E9] text-white font-semibold'
                          : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      Tip {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#0F172A]">{currentDaily.title}</h2>
              <p className="text-sm font-medium text-slate-700">{currentDaily.hook}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{currentDaily.coreConcept}</p>

              <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-teal-900">Today’s Actionable Habit:</p>
                <p className="text-sm text-[#0F172A] mt-1">{currentDaily.actionStep}</p>
              </div>
            </div>

            {/* 1-Question Daily Check */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <p className="text-xs font-semibold text-[#0F172A]">
                Quick Check: {currentDaily.quickQuestion.prompt}
              </p>
              <div className="space-y-2">
                {currentDaily.quickQuestion.options.map((opt, idx) => {
                  const isSelected = dailyAnswer === idx;
                  const isCorrect = idx === currentDaily.quickQuestion.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDailyAnswer(idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        dailyAnswer === null
                          ? 'bg-[#EEF4F1] border-slate-200 text-[#0F172A] hover:border-[#0EA5E9]'
                          : isSelected && isCorrect
                          ? 'bg-emerald-50 border-[#10B981] text-emerald-950 font-semibold'
                          : isSelected && !isCorrect
                          ? 'bg-amber-50 border-amber-600 text-amber-950 font-semibold'
                          : isCorrect
                          ? 'bg-emerald-50/50 border-[#10B981] text-emerald-900'
                          : 'bg-[#EEF4F1] border-slate-200 text-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {dailyAnswer !== null && (
                <p className="text-xs text-slate-700 bg-[#EEF4F1] border border-slate-200 rounded-lg p-3">
                  <strong className={dailyAnswer === currentDaily.quickQuestion.correctIndex ? 'text-[#10B981]' : 'text-[#0F172A]'}>
                    {dailyAnswer === currentDaily.quickQuestion.correctIndex
                      ? 'Correct! '
                      : 'Good try! '}
                  </strong>
                  {currentDaily.quickQuestion.explanation}
                </p>
              )}
            </div>
          </div>

          {/* Personalized Next Lesson & Tools (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-[#0EA5E9]">
                  {learnerName.trim()
                    ? `Recommended for ${learnerName.trim()}`
                    : 'Personalized For You'}
                </span>
                <span className="mx-1.5">·</span>
                <span>{nextRecommendedLesson.level} Level</span>
                <span className="mx-1.5">·</span>
                <span>{nextRecommendedLesson.durationMinutes} min lesson</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">{nextRecommendedLesson.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {nextRecommendedLesson.summary}
              </p>
              <div className="bg-[#F8F9FA] border border-slate-200 rounded-lg p-3.5">
                <p className="text-xs font-semibold text-[#0F172A]">
                  Includes Real-Life ₹ Example:
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {nextRecommendedLesson.indianExample.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenLesson(nextRecommendedLesson.id, nextRecommendedLesson.topicId)
                }
                className="w-full py-2.5 px-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>Continue Recommended Lesson</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">
                Explore Interactive Practice & Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateTab('calculators')}
                  className="p-3.5 text-left rounded-lg border border-slate-200 hover:border-[#0EA5E9] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                    <Calculator className="w-4 h-4 text-[#0EA5E9]" />
                    <span>Smart Calculators</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Compound interest, Debt Avalanche vs. Snowball, EMI & Budget
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('quizzes')}
                  className="p-3.5 text-left rounded-lg border border-slate-200 hover:border-[#0EA5E9] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                    <Compass className="w-4 h-4 text-[#0EA5E9]" />
                    <span>Real-Life Scenarios</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Practice first-salary, debt payoff, and scam-prevention decisions
                  </p>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Financial Safety & Educational Responsibility Charter */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Financial Safety & Educational Responsibility</span>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Safe, Unbiased Financial Education Built for Every Learner
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                FinBuddy is an educational tutor, not a substitute for a qualified financial, tax,
                or investment advisor. Market-linked returns are never guaranteed and involve risk.
                Never share OTPs, PINs, CVVs, or passwords with anyone.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('ask')}
                className="w-full py-2.5 px-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask FinBuddy in Simple Language</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenLesson('lesson-goals-debt-scams', 'financial-planning')}
                className="w-full py-2.5 px-4 bg-[#F8F9FA] hover:bg-slate-200 text-[#0F172A] border border-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <HelpCircle className="w-4 h-4 text-[#0EA5E9]" />
                <span>Learn Goal Planning & Scam Safety</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
