import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import {
  LESSONS,
  QUIZ_QUESTIONS,
  SCENARIO_SIMULATIONS,
  type DifficultyLevel,
  type TopicId,
} from '../data/curriculum';

interface QuizzesViewProps {
  quizScores: Record<string, boolean>;
  onRecordQuizAnswer: (questionId: string, isCorrect: boolean) => void;
  completedScenarios: string[];
  onCompleteScenario: (scenarioId: string) => void;
  onOpenLesson: (lessonId: string, topicId?: TopicId) => void;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({
  quizScores,
  onRecordQuizAnswer,
  completedScenarios,
  onCompleteScenario,
  onOpenLesson,
}) => {
  const [mode, setMode] = useState<'quiz' | 'scenarios'>('quiz');
  const [quizFilter, setQuizFilter] = useState<'All' | DifficultyLevel>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [scenarioChoices, setScenarioChoices] = useState<Record<string, string>>({});

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    if (quizFilter === 'All') return true;
    return q.level === quizFilter;
  });

  const handleSelectQuizOption = (questionId: string, optionIdx: number, correctIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    onRecordQuizAnswer(questionId, optionIdx === correctIdx);
  };

  const handleSelectScenarioChoice = (scenarioId: string, choiceId: string, isOptimal: boolean) => {
    setScenarioChoices((prev) => ({ ...prev, [scenarioId]: choiceId }));
    if (isOptimal) {
      onCompleteScenario(scenarioId);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-teal-700">
            <span>Interactive Assessments</span>
            <span className="mx-1.5">·</span>
            <span>Practice Quizzes & Real-Life Scenarios</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Financial Quizzes & Scenario-Based Learning
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Test your understanding with multiple-choice questions and real-world money
            decisions. Receive immediate feedback and personalized next-lesson recommendations.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Switch between Quizzes and Scenario Simulations"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto"
        >
          <button
            role="tab"
            aria-selected={mode === 'quiz'}
            type="button"
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'quiz'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Financial Quiz ({QUIZ_QUESTIONS.length})</span>
          </button>
          <button
            role="tab"
            aria-selected={mode === 'scenarios'}
            type="button"
            onClick={() => setMode('scenarios')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'scenarios'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>Scenario-Based Learning ({SCENARIO_SIMULATIONS.length})</span>
          </button>
        </div>
      </div>

      {/* MODE 1: FINANCIAL QUIZ */}
      {mode === 'quiz' && (
        <div className="space-y-8">
          {/* Score Bar & Level Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div>
                <span className="text-slate-500">Session Score: </span>
                <span className="font-mono font-bold tabular-nums text-slate-900">
                  {correctCount} / {answeredCount} correct
                </span>
              </div>
              <span className="text-slate-300">·</span>
              <div>
                <span className="text-slate-500">All-Time Mastered: </span>
                <span className="font-mono font-bold tabular-nums text-teal-700">
                  {Object.values(quizScores).filter(Boolean).length} / {QUIZ_QUESTIONS.length}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setQuizFilter(f)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      quizFilter === f
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedAnswers({})}
                  className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {filteredQuestions.map((q, index) => {
              const userChoice = selectedAnswers[q.id];
              const hasAnswered = userChoice !== undefined;
              const isCorrect = userChoice === q.correctIndex;
              const recommendedLesson = LESSONS.find((l) => l.id === q.recommendedLessonId);

              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Question 0{index + 1} · {q.level} Level
                    </span>
                    {quizScores[q.id] && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mastered</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{q.question}</h3>

                  <div className="space-y-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = userChoice === optIdx;
                      const isRightOption = optIdx === q.correctIndex;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectQuizOption(q.id, optIdx, q.correctIndex)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                            !hasAnswered
                              ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-600'
                              : isPicked && isRightOption
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                              : isPicked && !isRightOption
                              ? 'bg-amber-50 border-amber-600 text-amber-950 font-semibold'
                              : isRightOption
                              ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div
                      className={`p-4 rounded-lg border text-xs sm:text-sm space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <p>
                        <strong>
                          {isCorrect ? 'Excellent! That is correct: ' : 'Let’s review why: '}
                        </strong>
                        {q.explanation}
                      </p>
                      {recommendedLesson && (
                        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                          <span className="text-xs text-slate-700">
                            Related Lesson: <strong>{recommendedLesson.title}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenLesson(recommendedLesson.id, recommendedLesson.topicId)
                            }
                            className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Open Lesson</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: SCENARIO-BASED LEARNING SIMULATIONS */}
      {mode === 'scenarios' && (
        <div className="space-y-8">
          {SCENARIO_SIMULATIONS.map((scen) => {
            const pickedChoiceId = scenarioChoices[scen.id];
            const pickedChoice = scen.choices.find((c) => c.id === pickedChoiceId);
            const isSolved = completedScenarios.includes(scen.id);
            const relatedLesson = LESSONS.find((l) => l.id === scen.relatedLessonId);

            return (
              <div
                key={scen.id}
                className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
                  <div>
                    <span className="font-semibold text-teal-700">{scen.persona}</span>
                    <span className="mx-1.5">·</span>
                    <span>{scen.level} Level</span>
                    <span className="mx-1.5">·</span>
                    <span className="font-mono">{scen.monthlyIncomeINR}</span>
                  </div>
                  {isSolved && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Optimal Decision Mastered</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{scen.title}</h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {scen.situation}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-900">{scen.question}</p>
                  <div className="space-y-2.5">
                    {scen.choices.map((choice) => {
                      const isPicked = pickedChoiceId === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() =>
                            handleSelectScenarioChoice(scen.id, choice.id, choice.isOptimal)
                          }
                          className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                            !pickedChoiceId
                              ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-600'
                              : isPicked && choice.isOptimal
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                              : isPicked && !choice.isOptimal
                              ? 'bg-amber-50 border-amber-600 text-amber-950 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {pickedChoice && (
                  <div
                    className={`p-5 rounded-xl border space-y-2.5 ${
                      pickedChoice.isOptimal
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold">{pickedChoice.outcomeTitle}</h3>
                      <span className="text-xs font-mono font-semibold">
                        {pickedChoice.financialImpact}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      <strong>FinBuddy Coaching: </strong>
                      {pickedChoice.finBuddyCoaching}
                    </p>
                    <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span>
                        <strong>Core Rule:</strong> {scen.keyLessonTakeaway}
                      </span>
                      {relatedLesson && (
                        <button
                          type="button"
                          onClick={() => onOpenLesson(relatedLesson.id, relatedLesson.topicId)}
                          className="font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <span>Review Lesson</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
