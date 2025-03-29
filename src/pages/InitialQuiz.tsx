
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

// Mock questions for the initial assessment
const INITIAL_QUESTIONS = [
  {
    id: 1,
    question: 'What is 5 + 3?',
    options: ['7', '8', '9', '10'],
    correctAnswer: '8',
    difficulty: 1
  },
  {
    id: 2,
    question: 'What is 10 - 4?',
    options: ['4', '5', '6', '7'],
    correctAnswer: '6',
    difficulty: 1
  },
  {
    id: 3,
    question: 'What is 3 × 2?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '6',
    difficulty: 1
  },
  {
    id: 4,
    question: 'What is 8 ÷ 2?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    difficulty: 1
  },
  {
    id: 5,
    question: 'What is 15 + 7?',
    options: ['21', '22', '23', '24'],
    correctAnswer: '22',
    difficulty: 2
  },
  {
    id: 6,
    question: 'What is 20 - 8?',
    options: ['10', '11', '12', '13'],
    correctAnswer: '12',
    difficulty: 2
  },
  {
    id: 7,
    question: 'What is 6 × 4?',
    options: ['22', '24', '26', '28'],
    correctAnswer: '24',
    difficulty: 2
  },
  {
    id: 8,
    question: 'What is 25 ÷ 5?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    difficulty: 2
  },
  {
    id: 9,
    question: 'What is 36 + 19?',
    options: ['53', '54', '55', '56'],
    correctAnswer: '55',
    difficulty: 3
  },
  {
    id: 10,
    question: 'What is 42 - 17?',
    options: ['23', '24', '25', '26'],
    correctAnswer: '25',
    difficulty: 3
  },
  {
    id: 11,
    question: 'What is 7 × 8?',
    options: ['54', '56', '58', '60'],
    correctAnswer: '56',
    difficulty: 3
  },
  {
    id: 12,
    question: 'What is 72 ÷ 9?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    difficulty: 3
  },
  {
    id: 13,
    question: 'If you have 5 apples and eat 2, how many are left?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    difficulty: 1
  },
  {
    id: 14,
    question: 'If 1 pencil costs 5 coins, how many coins do you need for 3 pencils?',
    options: ['10', '15', '20', '25'],
    correctAnswer: '15',
    difficulty: 2
  },
  {
    id: 15,
    question: 'A book has 60 pages. If you read 15 pages each day, how many days will it take to finish the book?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    difficulty: 3
  }
];

const InitialQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user has already completed the initial quiz, redirect to home
    if (user?.completedQuiz) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSelectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < INITIAL_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    
    // Calculate score and determine level
    let correctAnswers = 0;
    INITIAL_QUESTIONS.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentageCorrect = (correctAnswers / INITIAL_QUESTIONS.length) * 100;
    let assignedLevel = 1;
    
    if (percentageCorrect >= 80) {
      assignedLevel = 3;
    } else if (percentageCorrect >= 50) {
      assignedLevel = 2;
    }
    
    // In a real app, you would save this to the backend
    // For now, we'll just use local storage
    const storedUser = localStorage.getItem('mathpath_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const updatedUser = {
        ...parsedUser,
        level: assignedLevel,
        completedQuiz: true
      };
      localStorage.setItem('mathpath_user', JSON.stringify(updatedUser));
    }
    
    setTimeout(() => {
      toast({
        title: "Quiz Completed!",
        description: `You answered ${correctAnswers} out of ${INITIAL_QUESTIONS.length} questions correctly.`,
      });
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };

  const currentQuestionData = INITIAL_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / INITIAL_QUESTIONS.length) * 100;
  const isQuestionAnswered = selectedAnswers[currentQuestionData.id] !== undefined;
  const isLastQuestion = currentQuestion === INITIAL_QUESTIONS.length - 1;
  const areAllQuestionsAnswered = INITIAL_QUESTIONS.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Initial Assessment</h1>
          <p className="text-gray-600 mt-2">
            Let's see what math level is right for you!
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {INITIAL_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Card className="mb-6 overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <div className="text-xl font-medium mb-6">
              {currentQuestionData.question}
            </div>
            
            <div className="space-y-3">
              {currentQuestionData.options.map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswers[currentQuestionData.id] === option
                      ? "border-mathpath-purple bg-mathpath-lightPurple"
                      : "border-gray-200 hover:border-mathpath-purple"
                  }`}
                  onClick={() => handleSelectAnswer(currentQuestionData.id, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={!areAllQuestionsAnswered || isSubmitting}
              className="bg-mathpath-purple hover:bg-purple-600"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!isQuestionAnswered}
              className="bg-mathpath-purple hover:bg-purple-600"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialQuiz;
