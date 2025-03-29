import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { HelpCircle, AlertCircle, CheckCircle2, XCircle, Trophy } from 'lucide-react';

const PRACTICE_QUESTIONS = {
  1: { // Level 1
    1: [ // Sublevel 1
      {
        id: 'l1-s1-q1',
        question: 'What is 2 + 3?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        difficulty: 1
      },
      {
        id: 'l1-s1-q2',
        question: 'What is 1 + 4?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '5',
        difficulty: 1
      },
    ],
    2: [ // Sublevel 2
      {
        id: 'l1-s2-q1',
        question: 'What is 4 + 5?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '9',
        difficulty: 1
      },
    ],
    3: [ // Sublevel 3 (quiz prep)
      {
        id: 'l1-s3-q1',
        question: 'What is 6 + 7?',
        options: ['11', '12', '13', '14'],
        correctAnswer: '13',
        difficulty: 1
      },
    ]
  },
  2: { // Level 2
    1: [ // Sublevel 1
      {
        id: 'l2-s1-q1',
        question: 'What is 10 - 3?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '7',
        difficulty: 2
      },
    ],
  },
};

const QUIZ_QUESTIONS = {
  1: [
    {
      id: 'quiz-l1-q1',
      question: 'What is 5 + 8?',
      options: ['11', '12', '13', '14'],
      correctAnswer: '13'
    },
    {
      id: 'quiz-l1-q2',
      question: 'What is 9 + 4?',
      options: ['11', '12', '13', '14'],
      correctAnswer: '13'
    },
    {
      id: 'quiz-l1-q3',
      question: 'What is 7 + 6?',
      options: ['11', '12', '13', '14'],
      correctAnswer: '13'
    },
    {
      id: 'quiz-l1-q4',
      question: 'What is 3 + 9?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '12'
    },
    {
      id: 'quiz-l1-q5',
      question: 'What is 8 + 5?',
      options: ['11', '12', '13', '14'],
      correctAnswer: '13'
    },
    {
      id: 'quiz-l1-q6',
      question: 'What is 4 + 8?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '12'
    },
    {
      id: 'quiz-l1-q7',
      question: 'What is 2 + 9?',
      options: ['9', '10', '11', '12'],
      correctAnswer: '11'
    },
    {
      id: 'quiz-l1-q8',
      question: 'What is 6 + 8?',
      options: ['12', '13', '14', '15'],
      correctAnswer: '14'
    },
    {
      id: 'quiz-l1-q9',
      question: 'What is 7 + 7?',
      options: ['12', '13', '14', '15'],
      correctAnswer: '14'
    },
    {
      id: 'quiz-l1-q10',
      question: 'What is 9 + 9?',
      options: ['16', '17', '18', '19'],
      correctAnswer: '18'
    }
  ],
};

const getHint = (questionId: string) => {
  return {
    question: 'What is 1 + 4?',
    steps: [
      'First, visualize 1 object.',
      'Then, add 4 more objects.',
      'Count all the objects: 1, 2, 3, 4, 5.',
      'So 1 + 4 = 5'
    ],
    answer: '5'
  };
};

const Practice: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentSubLevel, setCurrentSubLevel] = useState(1);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState<{ question: string; steps: string[]; answer: string } | null>(null);
  const [showQuizButton, setShowQuizButton] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResults, setQuizResults] = useState<{ total: number; correct: number; percentage: number } | null>(null);
  const [showQuizResults, setShowQuizResults] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setCurrentLevel(user.level || 1);
      setCurrentSubLevel(1);
      setCorrectAnswersCount(0);
      setTotalAnswered(0);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setShowQuizButton(false);
      setQuizMode(false);
    }
  }, [isAuthenticated, navigate, user]);

  const questions = quizMode
    ? QUIZ_QUESTIONS[currentLevel as keyof typeof QUIZ_QUESTIONS] || []
    : (PRACTICE_QUESTIONS[currentLevel as keyof typeof PRACTICE_QUESTIONS]?.[
      currentSubLevel as keyof (typeof PRACTICE_QUESTIONS)[keyof typeof PRACTICE_QUESTIONS]
    ] || []);

  const currentQuestionData = questions[currentQuestion];

  const handleSelectAnswer = (answer: string) => {
    if (answerStatus !== null || !currentQuestionData) return;

    setSelectedAnswer(answer);

    if (quizMode) {
      setQuizAnswers({
        ...quizAnswers,
        [currentQuestionData.id]: answer
      });

      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
        }, 500);
      }
    } else {
      const isCorrect = answer === currentQuestionData.correctAnswer;
      setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

      setTotalAnswered(prev => prev + 1);
      if (isCorrect) {
        setCorrectAnswersCount(prev => prev + 1);
      }

      if (currentSubLevel === 3 && correctAnswersCount >= 2) {
        setShowQuizButton(true);
      }

      if (currentSubLevel < 3 && correctAnswersCount >= 4) {
        toast({
          title: "Sublevel Completed!",
          description: `You've completed sublevel ${currentSubLevel} of level ${currentLevel}.`,
        });

        setCurrentSubLevel(prev => prev + 1);
        setCorrectAnswersCount(0);
        setTotalAnswered(0);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
    }

    setSelectedAnswer(null);
    setAnswerStatus(null);
  };

  const handleShowHint = () => {
    if (!currentQuestionData) return;

    const hintData = getHint(currentQuestionData.id);
    setHint(hintData);
    setShowHint(true);
  };

  const handleStartQuiz = () => {
    setQuizMode(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setQuizAnswers({});
    setQuizResults(null);

    toast({
      title: "Quiz Started",
      description: "Good luck! Try to answer at least 70% correctly.",
    });
  };

  const handleSubmitQuiz = () => {
    const quizQuestions = QUIZ_QUESTIONS[currentLevel as keyof typeof QUIZ_QUESTIONS] || [];
    let correctCount = 0;

    quizQuestions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / quizQuestions.length) * 100;
    const passed = percentage >= 70;

    setQuizResults({
      total: quizQuestions.length,
      correct: correctCount,
      percentage
    });

    setShowQuizResults(true);

    if (passed) {
      toast({
        title: "Congratulations!",
        description: `You passed the quiz with ${percentage.toFixed(0)}%. Moving to the next level!`,
      });

      const storedUser = localStorage.getItem('mathmaster_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = {
          ...parsedUser,
          level: currentLevel + 1
        };
        localStorage.setItem('mathmaster_user', JSON.stringify(updatedUser));
      }

      setCurrentLevel(prev => prev + 1);
      setCurrentSubLevel(1);
      setCorrectAnswersCount(0);
      setTotalAnswered(0);
      setQuizMode(false);
      setShowQuizButton(false);
    } else {
      toast({
        title: "Keep Practicing",
        description: `You got ${percentage.toFixed(0)}%. You need 70% to pass.`,
        variant: "destructive"
      });
    }
  };

  const handleCloseQuizResults = () => {
    setShowQuizResults(false);
    setQuizMode(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswerStatus(null);
  };

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Questions Available</h1>
          <p className="text-gray-600 mb-8">
            We're preparing more content for this level. Please check back soon!
          </p>
          <Button onClick={() => navigate('/')} className="bg-mathpath-purple hover:bg-purple-600">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Practice</h1>
            <p className="text-gray-600 mt-1">
              {quizMode
                ? `Level ${currentLevel} Quiz`
                : `Level ${currentLevel} - Sublevel ${currentSubLevel}`}
            </p>
          </div>

          {!quizMode && showQuizButton && (
            <Button
              onClick={handleStartQuiz}
              className="mt-4 sm:mt-0 bg-mathpath-purple hover:bg-purple-600 animate-pulse-subtle"
            >
              Take The Quiz
            </Button>
          )}

          {quizMode && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              {currentQuestion === questions.length - 1 && Object.keys(quizAnswers).length === questions.length && (
                <Button
                  onClick={handleSubmitQuiz}
                  className="bg-mathpath-purple hover:bg-purple-600"
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          )}
        </div>

        {!quizMode && (
          <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm">
            <div>
              <span className="text-sm text-gray-500">Progress: </span>
              <span className="font-medium">
                {correctAnswersCount} correct out of {totalAnswered} answered
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowHint}
              className="text-mathpath-purple border-mathpath-purple hover:bg-mathpath-lightPurple"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Hint
            </Button>
          </div>
        )}

        <Card className="mb-6 overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <div className="text-xl font-medium mb-6">
              {currentQuestionData.question}
            </div>

            <div className="space-y-3">
              {currentQuestionData.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = currentQuestionData.correctAnswer === option;
                const showCorrect = answerStatus !== null;

                return (
                  <div
                    key={option}
                    className={`p-4 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${isSelected
                        ? "border-mathpath-purple bg-mathpath-lightPurple"
                        : "border-gray-200 hover:border-mathpath-purple"
                      } ${showCorrect && isCorrect
                        ? "border-green-500 bg-green-50"
                        : showCorrect && isSelected && !isCorrect
                          ? "border-red-500 bg-red-50"
                          : ""
                      }`}
                    onClick={() => handleSelectAnswer(option)}
                  >
                    <span>{option}</span>
                    {showCorrect && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {showCorrect && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {answerStatus && (
              <div className={`mt-6 p-4 rounded-lg ${answerStatus === 'correct'
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                <div className="flex items-center">
                  {answerStatus === 'correct'
                    ? <CheckCircle2 className="h-5 w-5 mr-2" />
                    : <AlertCircle className="h-5 w-5 mr-2" />
                  }
                  <span className="font-medium">
                    {answerStatus === 'correct'
                      ? "Correct! Great job!"
                      : `Incorrect. The correct answer is ${currentQuestionData.correctAnswer}.`
                    }
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!quizMode && answerStatus !== null && (
          <div className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              className="bg-mathpath-purple hover:bg-purple-600"
            >
              Next Question
            </Button>
          </div>
        )}

        <Dialog open={showHint} onOpenChange={setShowHint}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Hint</DialogTitle>
            </DialogHeader>
            {hint && (
              <div className="space-y-4">
                <div className="text-lg font-medium">{hint.question}</div>
                <div className="space-y-2">
                  {hint.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="bg-mathpath-lightPurple text-mathpath-purple rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
                <div className="font-medium">
                  Answer: {hint.answer}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                onClick={() => setShowHint(false)}
                className="bg-mathpath-purple hover:bg-purple-600"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showQuizResults} onOpenChange={setShowQuizResults}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Quiz Results</DialogTitle>
            </DialogHeader>
            {quizResults && (
              <div className="space-y-4 text-center py-4">
                <div className={`text-5xl font-bold ${quizResults.percentage >= 70
                    ? "text-green-500"
                    : "text-red-500"
                  }`}>
                  {quizResults.percentage.toFixed(0)}%
                </div>
                <p>
                  You got {quizResults.correct} out of {quizResults.total} questions correct.
                </p>
                <div className="py-4">
                  {quizResults.percentage >= 70 ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-green-100 p-4 rounded-full mb-2">
                        <Trophy className="h-10 w-10 text-yellow-500" />
                      </div>
                      <p className="font-medium text-lg">Congratulations!</p>
                      <p className="text-gray-600">
                        You've passed this level and can now move on to the next one.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-red-100 p-4 rounded-full mb-2">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                      </div>
                      <p className="font-medium text-lg">Keep Practicing</p>
                      <p className="text-gray-600">
                        You need 70% to pass. Continue practicing this level.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                onClick={handleCloseQuizResults}
                className="bg-mathpath-purple hover:bg-purple-600"
              >
                Continue Practice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Practice;
