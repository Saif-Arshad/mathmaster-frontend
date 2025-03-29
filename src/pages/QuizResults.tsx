
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Trophy, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

// This would come from a passed state in real app
const mockQuizResults = {
  level: 1,
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  passed: true,
  answers: [
    { questionId: 1, question: 'What is 5 + 8?', userAnswer: '13', correctAnswer: '13', isCorrect: true },
    { questionId: 2, question: 'What is 9 + 4?', userAnswer: '13', correctAnswer: '13', isCorrect: true },
    { questionId: 3, question: 'What is 7 + 6?', userAnswer: '13', correctAnswer: '13', isCorrect: true },
    { questionId: 4, question: 'What is 3 + 9?', userAnswer: '12', correctAnswer: '12', isCorrect: true },
    { questionId: 5, question: 'What is 8 + 5?', userAnswer: '12', correctAnswer: '13', isCorrect: false },
    { questionId: 6, question: 'What is 4 + 8?', userAnswer: '12', correctAnswer: '12', isCorrect: true },
    { questionId: 7, question: 'What is 2 + 9?', userAnswer: '11', correctAnswer: '11', isCorrect: true },
    { questionId: 8, question: 'What is 6 + 8?', userAnswer: '14', correctAnswer: '14', isCorrect: true },
    { questionId: 9, question: 'What is 7 + 7?', userAnswer: '13', correctAnswer: '14', isCorrect: false },
    { questionId: 10, question: 'What is 9 + 9?', userAnswer: '18', correctAnswer: '18', isCorrect: true }
  ]
};

const QuizResults: React.FC = () => {
  const [results, setResults] = useState(mockQuizResults);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // In a real app, you would fetch the quiz results from the backend or state
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
          <p className="text-gray-600 mt-2">
            Level {results.level} Quiz
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Your Answers</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {results.answers.map((answer, index) => (
                    <div
                      key={answer.questionId}
                      className={`p-4 border rounded-lg ${
                        answer.isCorrect 
                          ? "border-green-200 bg-green-50" 
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium mb-2">
                            {index + 1}. {answer.question}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Your answer: </span>
                            <span className={answer.isCorrect ? "text-green-700" : "text-red-700"}>
                              {answer.userAnswer}
                            </span>
                          </div>
                          {!answer.isCorrect && (
                            <div className="text-sm">
                              <span className="text-gray-500">Correct answer: </span>
                              <span className="text-green-700">{answer.correctAnswer}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          {answer.isCorrect 
                            ? <CheckCircle2 className="h-6 w-6 text-green-500" /> 
                            : <XCircle className="h-6 w-6 text-red-500" />
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-md mb-6">
              <CardHeader>
                <CardTitle>Score Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className={`text-6xl font-bold mb-4 ${
                    results.passed ? "text-green-500" : "text-red-500"
                  }`}>
                    {results.percentage}%
                  </div>
                  <p className="text-xl mb-4">
                    {results.score} / {results.totalQuestions} correct
                  </p>
                  
                  {results.passed ? (
                    <div className="flex flex-col items-center mb-6">
                      <div className="bg-yellow-100 p-4 rounded-full mb-2">
                        <Trophy className="h-12 w-12 text-yellow-500" />
                      </div>
                      <p className="font-medium text-lg">Congratulations!</p>
                      <p className="text-gray-600 text-sm">
                        You've passed this level!
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <p className="font-medium text-lg">Keep practicing!</p>
                      <p className="text-gray-600 text-sm">
                        You need 70% to pass this level.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3">
                    <Button 
                      onClick={() => navigate('/')}
                      className="bg-mathpath-purple hover:bg-purple-600"
                    >
                      Return to Home
                    </Button>
                    <Button 
                      onClick={() => navigate('/practice')}
                      variant="outline"
                      className="flex items-center justify-center"
                    >
                      Continue Practice
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
