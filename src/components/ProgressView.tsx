import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  LESSONS,
  QUIZ_QUESTIONS,
  SCENARIO_SIMULATIONS,
  TOPIC_MODULES,
  type DifficultyLevel,
  type TopicId,
} from '../data/curriculum';

interface ProgressViewProps {
  learnerName: string;
  currentLevel: string;
  preferredTopic: TopicId;
  learnerLevel: DifficultyLevel;
  learnerGoal: string;
  completedLessons: string[];
  quizScores: Record<string, boolean>;
  completedScenarios: string[];
  streakDays: number;
  storageConsent: boolean;
  onToggleStorageConsent: (consent: boolean) => void;
  onResetAllProgress: () => void;
  onOpenLesson: (lessonId: string, topicId?: TopicId) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  learnerName,
  currentLevel,
  preferredTopic,
  learnerLevel,
  learnerGoal,
  completedLessons,
  quizScores,
  completedScenarios,
  streakDays,
  storageConsent,
  onToggleStorageConsent,
  onResetAllProgress,
  onOpenLesson,
}) => {
  const totalLessons = LESSONS.length;
  const completedCount = completedLessons.length;
  const lessonCompletionPct = Math.round((completedCount / totalLessons) * 100);

  const totalQuizzes = QUIZ_QUESTIONS.length;
  const masteredQuizzes = Object.values(quizScores).filter(Boolean).length;
  const quizMasteryPct = Math.round((masteredQuizzes / totalQuizzes) * 100);

  const totalScenarios = SCENARIO_SIMULATIONS.length;
  const solvedScenarios = completedScenarios.length;

  const preferredModuleTitle =
    TOPIC_MODULES.find((m) => m.id === preferredTopic)?.title || 'Budgeting and Saving';

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-teal-700">
            <span>{learnerName.trim() ? `${learnerName.trim()}’s Progress` : 'My Progress & Mastery'}</span>
            <span className="mx-1.5">·</span>
            <span>{currentLevel}</span>
            <span className="mx-1.5">·</span>
            <span>Topic: {preferredModuleTitle}</span>
            <span className="mx-1.5">·</span>
            <span>{learnerLevel} Difficulty</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {learnerName.trim()
              ? `${learnerName.trim()}’s Financial Literacy Dashboard`
              : 'Your Financial Literacy Progress Dashboard'}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Goal: <strong>{learnerGoal}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onResetAllProgress}
          className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 self-start lg:self-auto cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session Progress</span>
        </button>
      </div>

      {/* 4 Key Progress Metrics */}
      <section aria-label="Progress summary metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <p className="text-xs text-slate-500">Lessons Completed</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {completedCount} / {totalLessons}
            </p>
            <span className="text-xs font-mono font-semibold text-teal-700">
              {lessonCompletionPct}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${lessonCompletionPct}%` }}
              className="h-full bg-teal-600 transition-all"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <p className="text-xs text-slate-500">Quiz Questions Mastered</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {masteredQuizzes} / {totalQuizzes}
            </p>
            <span className="text-xs font-mono font-semibold text-teal-700">
              {quizMasteryPct}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${quizMasteryPct}%` }}
              className="h-full bg-emerald-600 transition-all"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <p className="text-xs text-slate-500">Scenarios Mastered</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {solvedScenarios} / {totalScenarios}
            </p>
            <span className="text-xs font-mono font-semibold text-teal-700">
              {Math.round((solvedScenarios / totalScenarios) * 100)}%
            </span>
          </div>
          <p className="text-xs text-slate-500">Real-world Indian money decisions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <p className="text-xs text-slate-500">Active Learning Streak</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
            </p>
            <Award className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-xs text-slate-500">Consistent daily learning habit</p>
        </div>
      </section>

      {/* Topic Mastery Matrix across Modules A–D */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Mastery Across All 4 Core Financial Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track which modules you have completed and jump right into your next lesson.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOPIC_MODULES.map((mod) => {
            const modLessons = LESSONS.filter((l) => l.topicId === mod.id);
            const completedInMod = modLessons.filter((l) => completedLessons.includes(l.id));
            const pct =
              modLessons.length > 0
                ? Math.round((completedInMod.length / modLessons.length) * 100)
                : 0;
            const nextLessonInMod =
              modLessons.find((l) => !completedLessons.includes(l.id)) || modLessons[0];

            return (
              <div
                key={mod.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="font-semibold text-teal-700">{mod.code}</span>
                    <span className="text-slate-600">
                      {completedInMod.length}/{modLessons.length} Lessons ({pct}%)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{mod.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{mod.subtitle}</p>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-teal-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {modLessons.map((l) => {
                      const isDone = completedLessons.includes(l.id);
                      return (
                        <div
                          key={l.id}
                          className="flex items-center justify-between text-xs text-slate-700"
                        >
                          <span className="truncate pr-2">{l.title}</span>
                          {isDone ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 shrink-0">Pending</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {nextLessonInMod && (
                  <button
                    type="button"
                    onClick={() => onOpenLesson(nextLessonInMod.id, mod.id)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {pct === 100 ? 'Review Module Lesson' : 'Continue Module'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy & User Consent Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>User Privacy & Progress Storage Consent</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Control How Your Learning Progress Is Saved
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              FinBuddy respects your privacy. By default, your completed lessons and quiz scores
              remain in your active browser session only. Toggle local device persistence below if
              you consent to saving your progress in this browser across visits.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              role="switch"
              aria-checked={storageConsent}
              onClick={() => onToggleStorageConsent(!storageConsent)}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                storageConsent
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {storageConsent
                  ? 'Local Progress Storage: Enabled (Consented)'
                  : 'Enable Local Progress Storage'}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
