import React, { useEffect, useState } from 'react';
import { Navbar, type ActiveTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { AskFinBuddyView } from './components/AskFinBuddyView';
import { CalculatorsView } from './components/CalculatorsView';
import { QuizzesView } from './components/QuizzesView';
import { ProgressView } from './components/ProgressView';
import {
  LESSONS,
  type DifficultyLevel,
  type TopicId,
} from './data/curriculum';

const STORAGE_KEY = 'finbuddy_progress_v1';

export type CurrentKnowledgeLevel =
  | 'New to Finance'
  | 'Know the Basics'
  | 'Managing Money Actively';

interface StoredProgress {
  storageConsent: boolean;
  learnerName: string;
  currentLevel: CurrentKnowledgeLevel;
  preferredTopic: TopicId;
  learnerLevel: DifficultyLevel;
  learnerGoal: string;
  completedLessons: string[];
  quizScores: Record<string, boolean>;
  completedScenarios: string[];
  streakDays: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [storageConsent, setStorageConsent] = useState<boolean>(false);

  // 4 Core Personalization Fields: Name, Current Level, Topic, Difficulty Preference
  const [learnerName, setLearnerName] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState<CurrentKnowledgeLevel>('New to Finance');
  const [preferredTopic, setPreferredTopic] = useState<TopicId>('budgeting-saving');
  const [learnerLevel, setLearnerLevel] = useState<DifficultyLevel>('Beginner');

  const [learnerGoal, setLearnerGoal] = useState<string>(
    'Save from my monthly salary & build an emergency fund'
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    'lesson-needs-wants',
  ]);
  const [quizScores, setQuizScores] = useState<Record<string, boolean>>({});
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState<number>(1);

  // Learn View state
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId | 'all'>('all');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-needs-wants');

  // Ask FinBuddy pre-filled prompt
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);

  // Load saved state ONLY if user previously consented
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredProgress = JSON.parse(raw);
        if (parsed && parsed.storageConsent) {
          setStorageConsent(true);
          if (typeof parsed.learnerName === 'string') setLearnerName(parsed.learnerName);
          if (parsed.currentLevel) setCurrentLevel(parsed.currentLevel);
          if (parsed.preferredTopic) setPreferredTopic(parsed.preferredTopic);
          if (parsed.learnerLevel) setLearnerLevel(parsed.learnerLevel);
          if (parsed.learnerGoal) setLearnerGoal(parsed.learnerGoal);
          if (Array.isArray(parsed.completedLessons)) {
            setCompletedLessons(parsed.completedLessons);
          }
          if (parsed.quizScores) setQuizScores(parsed.quizScores);
          if (Array.isArray(parsed.completedScenarios)) {
            setCompletedScenarios(parsed.completedScenarios);
          }
          if (typeof parsed.streakDays === 'number') setStreakDays(parsed.streakDays);
        }
      }
    } catch {
      // Ignore storage access errors in restricted frames
    }
  }, []);

  // Persist state ONLY when storageConsent is true
  useEffect(() => {
    try {
      if (storageConsent) {
        const payload: StoredProgress = {
          storageConsent: true,
          learnerName,
          currentLevel,
          preferredTopic,
          learnerLevel,
          learnerGoal,
          completedLessons,
          quizScores,
          completedScenarios,
          streakDays,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [
    storageConsent,
    learnerName,
    currentLevel,
    preferredTopic,
    learnerLevel,
    learnerGoal,
    completedLessons,
    quizScores,
    completedScenarios,
    streakDays,
  ]);

  const handleToggleCompleteLesson = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleOpenLesson = (lessonId: string, topicId?: TopicId) => {
    setActiveLessonId(lessonId);
    if (topicId) {
      setSelectedTopicId(topicId);
    } else {
      setSelectedTopicId('all');
    }
    setActiveTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskQuestionWithPrompt = (prompt: string) => {
    setPendingChatPrompt(prompt);
    setActiveTab('ask');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordQuizAnswer = (questionId: string, isCorrect: boolean) => {
    setQuizScores((prev) => ({ ...prev, [questionId]: isCorrect }));
  };

  const handleCompleteScenario = (scenarioId: string) => {
    setCompletedScenarios((prev) =>
      prev.includes(scenarioId) ? prev : [...prev, scenarioId]
    );
  };

  const handleResetAllProgress = () => {
    setCompletedLessons([]);
    setQuizScores({});
    setCompletedScenarios([]);
    setStreakDays(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF4F1] text-[#0F172A]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        completedLessonsCount={completedLessons.length}
        totalLessonsCount={LESSONS.length}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            learnerName={learnerName}
            onChangeLearnerName={setLearnerName}
            currentLevel={currentLevel}
            onChangeCurrentLevel={setCurrentLevel}
            preferredTopic={preferredTopic}
            onChangePreferredTopic={setPreferredTopic}
            learnerLevel={learnerLevel}
            onChangeLearnerLevel={setLearnerLevel}
            learnerGoal={learnerGoal}
            onChangeLearnerGoal={setLearnerGoal}
            completedLessons={completedLessons}
            quizScores={quizScores}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLesson={handleOpenLesson}
            onAskQuestionWithPrompt={handleAskQuestionWithPrompt}
          />
        )}

        {activeTab === 'learn' && (
          <LearnView
            learnerName={learnerName}
            currentLevel={currentLevel}
            preferredTopic={preferredTopic}
            learnerLevel={learnerLevel}
            selectedTopicId={selectedTopicId}
            onSelectTopicId={setSelectedTopicId}
            activeLessonId={activeLessonId}
            onSelectLessonId={setActiveLessonId}
            completedLessons={completedLessons}
            onToggleCompleteLesson={handleToggleCompleteLesson}
            onAskAboutTopic={handleAskQuestionWithPrompt}
          />
        )}

        {activeTab === 'ask' && (
          <AskFinBuddyView
            learnerName={learnerName}
            onChangeLearnerName={setLearnerName}
            currentLevel={currentLevel}
            onChangeCurrentLevel={setCurrentLevel}
            preferredTopic={preferredTopic}
            onChangePreferredTopic={setPreferredTopic}
            learnerLevel={learnerLevel}
            onChangeLearnerLevel={setLearnerLevel}
            learnerGoal={learnerGoal}
            initialPrompt={pendingChatPrompt}
            onClearInitialPrompt={() => setPendingChatPrompt(null)}
          />
        )}

        {activeTab === 'calculators' && <CalculatorsView />}

        {activeTab === 'quizzes' && (
          <QuizzesView
            quizScores={quizScores}
            onRecordQuizAnswer={handleRecordQuizAnswer}
            completedScenarios={completedScenarios}
            onCompleteScenario={handleCompleteScenario}
            onOpenLesson={handleOpenLesson}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            learnerName={learnerName}
            currentLevel={currentLevel}
            preferredTopic={preferredTopic}
            learnerLevel={learnerLevel}
            learnerGoal={learnerGoal}
            completedLessons={completedLessons}
            quizScores={quizScores}
            completedScenarios={completedScenarios}
            streakDays={streakDays}
            storageConsent={storageConsent}
            onToggleStorageConsent={setStorageConsent}
            onResetAllProgress={handleResetAllProgress}
            onOpenLesson={handleOpenLesson}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-bold text-slate-900">
              FinBuddy — Learn Money. Build Confidence. Secure Your Future.
            </p>
            <p>
              Educational financial literacy tutor only; not a substitute for a qualified financial,
              tax, or investment advisor.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calculators')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Calculators
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quizzes')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Quizzes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('progress')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Privacy & Progress
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
