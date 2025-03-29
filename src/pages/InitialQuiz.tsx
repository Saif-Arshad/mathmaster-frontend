
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

// Updated mock questions following the new curriculum
const INITIAL_QUESTIONS = [
  {
    id: 1,
    question: 'How many apples are there?',
    questionImage: 'https://placehold.co/200x100/FFC0CB/FFFFFF?text=3+apples',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    difficulty: 1,
    type: 'counting'
  },
  {
    id: 2,
    question: 'Count the number of pencils.',
    questionImage: 'https://placehold.co/200x100/ADD8E6/FFFFFF?text=5+pencils',
    options: ['4', '5', '6', '7'],
    correctAnswer: '5',
    difficulty: 1,
    type: 'counting'
  },
  {
    id: 3,
    question: 'What number comes after 7?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    difficulty: 1,
    type: 'number_sequence'
  },
  {
    id: 4,
    question: 'What number comes before 5?',
    options: ['2', '3', '4', '6'],
    correctAnswer: '4',
    difficulty: 1,
    type: 'number_sequence'
  },
  {
    id: 5,
    question: 'What is 2 + 3?',
    questionImage: 'https://placehold.co/200x100/98FB98/FFFFFF?text=2%2B3',
    options: ['4', '5', '6', '7'],
    correctAnswer: '5',
    difficulty: 1,
    type: 'addition'
  },
  {
    id: 6,
    question: 'What is 1 + 4?',
    questionImage: 'https://placehold.co/200x100/98FB98/FFFFFF?text=1%2B4',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    difficulty: 1,
    type: 'addition'
  },
  {
    id: 7,
    question: 'Count the total number of objects.',
    questionImage: 'https://placehold.co/200x100/FFC0CB/FFFFFF?text=3+oranges+%2B+2+apples',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    difficulty: 1,
    type: 'addition'
  },
  {
    id: 8,
    question: 'What is 5 - 2?',
    questionImage: 'https://placehold.co/200x100/FFFFE0/FFFFFF?text=5-2',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    difficulty: 2,
    type: 'subtraction'
  },
  {
    id: 9,
    question: 'If you have 4 candies and eat 1, how many are left?',
    questionImage: 'https://placehold.co/200x100/FFFFE0/FFFFFF?text=4-1',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    difficulty: 2,
    type: 'subtraction'
  },
  {
    id: 10,
    question: 'What is the ones place in the number 24?',
    options: ['2', '4', '24', '0'],
    correctAnswer: '4',
    difficulty: 3,
    type: 'place_value'
  },
  {
    id: 11,
    question: 'What is the tens place in the number 57?',
    options: ['5', '7', '57', '0'],
    correctAnswer: '5',
    difficulty: 3,
    type: 'place_value'
  },
  {
    id: 12,
    question: 'What number comes after 19?',
    options: ['18', '19', '20', '21'],
    correctAnswer: '20',
    difficulty: 2,
    type: 'number_sequence'
  },
  {
    id: 13,
    question: 'What is 7 + 3?',
    questionImage: 'https://placehold.co/200x100/98FB98/FFFFFF?text=7%2B3',
    options: ['9', '10', '11', '12'],
    correctAnswer: '10',
    difficulty: 2,
    type: 'addition'
  },
  {
    id: 14,
    question: 'If you have 5 pens and get 3 more, how many pens do you have in total?',
    questionImage: 'https://placehold.co/200x100/ADD8E6/FFFFFF?text=5+pens+%2B+3+pens',
    options: ['7', '8', '9', '10'],
    correctAnswer: '8',
    difficulty: 2,
    type: 'addition'
  },
  {
    id: 15,
    question: 'What is 8 - 5?',
    questionImage: 'https://placehold.co/200x100/FFFFE0/FFFFFF?text=8-5',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    difficulty: 2,
    type: 'subtraction'
  }
];

const InitialQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
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
    let countingCorrect = 0;
    let additionCorrect = 0;
    let subtractionCorrect = 0;
    let placeValueCorrect = 0;
    let sequenceCorrect = 0;

    let totalCounting = 0;
    let totalAddition = 0;
    let totalSubtraction = 0;
    let totalPlaceValue = 0;
    let totalSequence = 0;

    INITIAL_QUESTIONS.forEach(question => {
      // Count by type
      switch (question.type) {
        case 'counting':
          totalCounting++;
          if (selectedAnswers[question.id] === question.correctAnswer) countingCorrect++;
          break;
        case 'addition':
          totalAddition++;
          if (selectedAnswers[question.id] === question.correctAnswer) additionCorrect++;
          break;
        case 'subtraction':
          totalSubtraction++;
          if (selectedAnswers[question.id] === question.correctAnswer) subtractionCorrect++;
          break;
        case 'place_value':
          totalPlaceValue++;
          if (selectedAnswers[question.id] === question.correctAnswer) placeValueCorrect++;
          break;
        case 'number_sequence':
          totalSequence++;
          if (selectedAnswers[question.id] === question.correctAnswer) sequenceCorrect++;
          break;
      }
    });

    // Determine level based on performance
    let assignedLevel = 1;

    const countingPercentage = totalCounting > 0 ? (countingCorrect / totalCounting) * 100 : 0;
    const additionPercentage = totalAddition > 0 ? (additionCorrect / totalAddition) * 100 : 0;
    const subtractionPercentage = totalSubtraction > 0 ? (subtractionCorrect / totalSubtraction) * 100 : 0;

    if (countingPercentage >= 80 && additionPercentage >= 70) {
      assignedLevel = 2; // Advance to subtraction level

      if (subtractionPercentage >= 70) {
        assignedLevel = 3; // Advance to place value level
      }
    }

    // In a real app, you would save this to the backend
    // For now, we'll just use local storage
    const storedUser = localStorage.getItem('mathmaster_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const updatedUser = {
        ...parsedUser,
        level: assignedLevel,
        completedQuiz: true,
        quizResults: {
          counting: { total: totalCounting, correct: countingCorrect },
          addition: { total: totalAddition, correct: additionCorrect },
          subtraction: { total: totalSubtraction, correct: subtractionCorrect },
          placeValue: { total: totalPlaceValue, correct: placeValueCorrect },
          numberSequence: { total: totalSequence, correct: sequenceCorrect }
        }
      };
      localStorage.setItem('mathmaster_user', JSON.stringify(updatedUser));
    }

    setTimeout(() => {
      toast({
        title: "Assessment Completed!",
        description: `Based on your results, we've determined your optimal starting level.`,
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

            {currentQuestionData.questionImage && (
              <div className="mb-6 flex justify-center">
                <img
                  src={currentQuestionData.questionImage}
                  alt={`Visual for ${currentQuestionData.question}`}
                  className="rounded-md"
                />
              </div>
            )}

            <div className="space-y-3">
              {currentQuestionData.options.map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAnswers[currentQuestionData.id] === option
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
