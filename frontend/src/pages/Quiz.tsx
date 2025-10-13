import Navigation from '@/components/Navigation';
import { QuizWelcome } from '@/components/QuizWelcome';
import { QuizQuestion } from '@/components/QuizQuestion';
import { QuizResults } from '@/components/QuizResults';
import { quizQuestions, Question } from '@/data/quizQuestions';
import { useState } from 'react';

type QuizStep = 'welcome' | 'question' | 'results';

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState(0);

  const handleStartQuiz = () => {
    setCurrentStep('question');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final score and show results
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      setFinalScore(totalScore);
      setCurrentStep('results');
    }
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />

      {currentStep === 'welcome' && (
        <QuizWelcome onStart={handleStartQuiz} />
      )}

      {currentStep === 'question' && (
        <QuizQuestion
          question={quizQuestions[currentQuestionIndex]}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={quizQuestions.length}
          onAnswer={handleAnswer}
        />
      )}

      {currentStep === 'results' && (
        <QuizResults
          score={finalScore}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Quiz;
