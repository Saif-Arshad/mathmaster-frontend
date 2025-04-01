import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

type QuestionType = {
  quiz_id: number;
  question_text: string;
  questionImage?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  type?: string;
};

const InitialQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Redirect if the user already completed the quiz
  useEffect(() => {
    if (user?.completedQuiz) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/initial-quiz`);
      setQuestions(res.data);
      setCurrentQuestion(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSelectAnswer = (quiz_id: number, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [quiz_id]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async() => {
    setIsSubmitting(true);

    // Simple scoring: count questions where the selected answer matches the correct answer
    const totalQuestions = questions.length;
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.quiz_id] === q.correct_option) {
        correctCount++;
      }
    });

    const percentage = (correctCount / totalQuestions) * 100;
    console.log("🚀 ~ handleSubmitQuiz ~ percentage:", percentage)

    const storedUser = localStorage.getItem('mathmaster_user');


    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      try {
        const payload={
          user_id: parsedUser.user_id,
          percentage: Math.round(percentage)
        }
        const res = await axios.post(`${backendUrl}/user/submit-inital`, payload);

      } catch (error) {
        console.log("🚀 ~ handleSubmitQuiz ~ error:", error)
        
      }
      const updatedUser = {
        ...parsedUser,
        level: percentage,
        completedQuiz: true,
      };
      localStorage.setItem('mathmaster_user', JSON.stringify(updatedUser));
    }

      toast({
        title: "Assessment Completed!",
        description: `Your score is ${Math.round(percentage)}%.`,
      });
      setIsSubmitting(false);
      window.location.href='/'
    }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading questions...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No questions available.
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isQuestionAnswered = selectedAnswers[currentQuestionData.quiz_id] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const areAllQuestionsAnswered = questions.every(q => selectedAnswers[q.quiz_id] !== undefined);

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
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6 overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <div className="text-xl font-medium mb-6">
              {currentQuestionData.question_text}
            </div>
            {currentQuestionData.questionImage && (
              <div className="mb-4">
                <img src={currentQuestionData.questionImage} alt="Question" className="w-full" />
              </div>
            )}
            <div className="space-y-3">
              {[
                currentQuestionData.option_a,
                currentQuestionData.option_b,
                currentQuestionData.option_c,
                currentQuestionData.option_d,
              ].map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAnswers[currentQuestionData.quiz_id] === option
                      ? "border-mathpath-purple bg-mathpath-lightPurple"
                      : "border-gray-200 hover:border-mathpath-purple"
                    }`}
                  onClick={() => handleSelectAnswer(currentQuestionData.quiz_id, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
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
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialQuiz;
