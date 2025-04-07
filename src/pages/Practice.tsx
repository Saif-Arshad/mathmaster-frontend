/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { HelpCircle, Trophy } from "lucide-react";
import axios from "axios";
import { ColorUpGame } from "../lib/Game/ColorUpGame";
import { SortGame } from "../lib/Game/SortGame";
import { BoxGame } from "../lib/Game/BoxGame";
import EquationGame from "../lib/Game/DivisionGame";
import Hint from "@/lib/Game/hint";
import { generateLearning } from "@/lib/Ai";

interface Question {
  questionId: number;
  question_id: number;
  question?: string;
  question_text?: string;
  game: "Color Up Game" | "Sort Game" | "Box Game" | "Equation Game";
  difficulty: number;
  sortOrder: number;
  colorUp_shape?: string;
  colorUp_totalItem?: number;
  colorUp_coloredCount?: number;
  sort_order?: "asc" | "desc";
  sort_shape?: string;
  sort_totalItem?: number;
  box_shape?: string;
  box_firstBoxCount?: number;
  box_secondBoxCount?: number;
  equation_shape?: string;
  equation_operation?: string;
  equation_finalBoxcount?: number;
  hint?: any;
  equation_firstBoxCount?: number;
  equation_secondBoxCount?: number;
  level: {
    level_id: number;
    level_name: string;
    min_passing_percentage: number;
    discription: string;
  };
}

const Practice: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answeredFlags, setAnsweredFlags] = useState<Record<number, boolean>>({});
  const [error, setError] = useState("");
  const [goNext, setGoNext] = useState(false)
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showNotQualifiedModal, setShowNotQualifiedModal] = useState(false);
  const [showLast, setShowNot] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sublevels, setSublevels] = useState<any[]>([]);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  console.log("🚀 ~ progressPercentage:", progressPercentage)
  const [isLastSublevel, setIsLastSublevel] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [q, setQ] = useState({} as Question);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, setUserProgress, userProgress } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (questions.length > 0) {
      setQ(questions[current]);
    }
  }, [questions, current]);

  // Fetch questions, user info, and sublevels from the backend
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!user) return;

    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${backendUrl}/admin/questions/${user.user_id}`
        );
        if (!data?.questions?.length) throw new Error("No questions received");
        setCurrentUserData(data?.user);

        if (data.sublevels && data.user && data.user.userSubLevel) {
          const userSubLevel = data.user.userSubLevel;
          const lastSublevel = data.sublevels[data.sublevels.length - 1];
          setIsLastSublevel(userSubLevel.sublevel_id === lastSublevel.sublevel_id);
        }
        setSublevels(data.sublevels || []);


        setQuestions(data?.questions);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        toast({
          title: "Error",
          description: err.response?.data?.message || err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [backendUrl, isAuthenticated, navigate]);

  const correctCount = Object.values(answeredFlags).filter(Boolean).length;
  console.log("🚀 ~ answeredFlags:", answeredFlags)
  console.log("🚀 ~ correctCount:", correctCount)
  console.log("🚀 ~ correctCount:", q)
  const totalAnswered = Object.keys(answeredFlags).length;
  const isLevelUpQuestion =
    q &&
    correctCount > 0 &&
    correctCount % 5 === 0;


  // useEffect(() => {
  //   // Calculate the current number of correct answers
  //   const newCorrectCount = Object.values(answeredFlags).filter(Boolean).length;
  //   const totalSublevels = sublevels.length;
  //   if (totalSublevels > 0) {
  //     const totalRequiredCorrect = 5 * totalSublevels;
  //     // Calculate progress as a percentage
  //     const progress = Math.floor((newCorrectCount / totalRequiredCorrect) * 100);
  //     console.log("Updated progress:", progress);
  //     setProgressPercentage(progress);
  //     setUserProgress((prev: any) => ({ ...prev, progress }));
  //   }
  //   }, [answeredFlags, sublevels, setUserProgress]);
  useEffect(() => {
    if (progressPercentage >= 100) {
      setProgressPercentage(100)
      setUserProgress((prev: any) => ({ ...prev, progress:100 }));

      // Update current question state whenever questions or index change

    }
  }, [progressPercentage]);

  const setIsCorrect = (val: boolean) => {
    setAnsweredFlags((prev) => ({ ...prev, [q.question_id]: val }));
    setLastAnswerCorrect(val);
    if (current === questions.length - 1 && val) {
      if (isLastSublevel) {
        setShowCongrats(true);
      } else {
        if (progressPercentage == 100) {

          setShowNot(true);
        } else {
          setShowNotQualifiedModal(true);

        }
      }
    }
    if (val && (correctCount + 1) % 5 === 0) {
      setShowLevelUpModal(true);
    }
  };

  const fetchNextQuestion = async () => {
    setGoNext(true)
    try {
      const sortedQuestionsFromAI = await generateLearning(
        questions,
        lastAnswerCorrect === false,
        current,
        progressPercentage
      );
      console.log("🚀 ~ fetchNextQuestion ~ sortedQuestions:", sortedQuestionsFromAI);

      const sortedIds = sortedQuestionsFromAI.map((q: any) => q.questionId || q.question_id);

      const filteredQuestions = sortedIds
        .map((id) => questions.find((question) => question.question_id === id))
        .filter((q): q is Question => q !== undefined);

      if (filteredQuestions.length === 0) {
        throw new Error("No matching questions found based on the AI sorted list.");
      }

      setQuestions(filteredQuestions);

      let nextIndex = current + 1;
      if (nextIndex >= filteredQuestions.length) {
        nextIndex = filteredQuestions.length - 1;
      }
      setCurrent(nextIndex);
    } catch (error: any) {
      console.log("🚀 ~ fetchNextQuestion ~ error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch the next question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoNext(false)
    }
  };


  const next = () => {
    const newCorrectCount = Object.values(answeredFlags).filter(Boolean).length;
    const totalSublevels = sublevels.length;

    if (totalSublevels > 0) {
      const totalRequiredCorrect = 5 * totalSublevels;
      const progress = Math.floor((newCorrectCount / totalRequiredCorrect) * 100);

      setProgressPercentage(progress);
      setUserProgress((prev: any) => ({ ...prev, progress }));
    }

    if (current === questions.length - 1 && !isLastSublevel) {
      if (userProgress == 100) {

        setShowNot(true);
      } else {


        setShowNotQualifiedModal(true);
      }
    } else {
      fetchNextQuestion();
    }
  };

  const prev = () => setCurrent((p) => (p > 0 ? p - 1 : p));

  const skipQuestion = () => {
    setAnsweredFlags((prev) => ({ ...prev, [q.question_id]: false }));
    if (current < questions.length - 1) {
      next();
    }
  };

  const handleSubmitLevelUp = async () => {
    const newCorrectCount = Object.values(answeredFlags).filter(Boolean).length;
    const totalSublevels = sublevels.length;

    if (totalSublevels > 0) {
      const totalRequiredCorrect = 5 * totalSublevels;
      const progress = Math.floor((newCorrectCount / totalRequiredCorrect) * 100);

      setProgressPercentage(progress);
      setUserProgress((prev: any) => ({ ...prev, progress }));
    }

    toast({
      title: "Success",
      description: "Level up successfully!",
      variant: "default",
    });
    setShowLevelUpModal(false);
    fetchNextQuestion();
  };

  const continueNotQualified = () => {
    setShowNotQualifiedModal(false);
    navigate("/"); // Redirect to home page
  };

  console.log(q)
  const renderGame = () => {
    console.log(q)
    switch (q.game) {
      case "Color Up Game":
        return (
          <ColorUpGame
            shape={q.colorUp_shape as any}
            totalItems={q.colorUp_totalItem!}
            id={q.question_id!}
            colorCount={q.colorUp_coloredCount!}
            isCorrect={q.questionId in answeredFlags ? !!answeredFlags[q.question_id] : false}
            setIsCorrect={setIsCorrect}
          />
        );

      case "Sort Game":
        return (
          <SortGame
            id={q.question_id!}
            shape={q.sort_shape as any}
            totalItem={q.sort_totalItem!}
            order={q.sort_order as any}
            isCorrect={q.question_id in answeredFlags ? !!answeredFlags[q.question_id] : false}
            setIsCorrect={setIsCorrect}
          />
        );

      case "Box Game":
        return (
          <BoxGame
            shape={q.box_shape as any}
            id={q.question_id!}
            startInBox={q.box_firstBoxCount!}
            targetInBox={q.box_secondBoxCount!}
            isCorrect={q.question_id in answeredFlags ? !!answeredFlags[q.question_id] : false}
            setIsCorrect={setIsCorrect}
          />
        );
      case "Equation Game":
        return (
          <EquationGame
            id={q.question_id!}
            shape={q.equation_shape as any}
            operand1={q.equation_firstBoxCount!}
            operand2={q.equation_secondBoxCount!}
            operation={q.equation_operation as "+" | "-" | "*"}
            result={q.equation_finalBoxcount!}
            isCorrect={q.question_id in answeredFlags ? !!answeredFlags[q.question_id] : false}
            setIsCorrect={setIsCorrect}
          />
        );
      default:
        return <div>Unknown game type.</div>;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center ml-64 justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto bg-mathpath-purple rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-medium text-gray-700">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 w-full">
      <Header />
      {loading ? (
        <div className="min-h-screen flex items-center ml-64 justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto bg-mathpath-purple rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
          </div>
        </div>
      ) : isLastSublevel ? (
        <div className="min-h-screen flex ml-64 flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <Trophy className="h-24 w-24 text-yellow-500 mx-auto animate-bounce" />
            <h1 className="text-4xl font-bold text-mathpath-purple">
              Congratulations! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              You've successfully completed all practice questions for this level.
            </p>
            <p className="text-lg text-gray-500">
              Ready to test your knowledge? Take the quiz to advance to the next level!
            </p>
            <Button
              onClick={() => navigate('/quiz')}
              className="bg-mathpath-purple hover:bg-purple-600 text-white px-8 py-4 text-lg"
            >
              Take the Quiz
            </Button>
          </div>
        </div>
      ) : (
        <main className="ml-64 py-8 px-12 mx-auto space-y-6">
          <div className="flex justify-between text-sm mb-4">
            <span>
              <h2 className="font-semibold text-xl">Practice</h2>
              <p>{q?.level?.level_name}</p>
              <p>Progress: {progressPercentage}%</p>
            </span>
          </div>
          <Card>
            <CardContent className="p-6 pb-20 space-y-6">
              <div className="flex justify-end">
                <div className="flex items-center gap-3">
                  <Hint gameType={q.game} questionHint={q.hint} />
                  {progressPercentage == 100 && (
                    <Button
                      onClick={() => navigate('/quiz')}
                      className="bg-mathpath-purple hover:bg-purple-600 text-white px-8 py-4 text-lg"
                    >
                      Take the Quiz
                    </Button>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-start capitalize">{q.question || q.question_text}</h2>
              {renderGame()}
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" onClick={prev} disabled={current === 0}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={skipQuestion}
                disabled={current === questions.length - 1}
                variant="outline"
                className="bg-gray-300 hover:bg-gray-400"
              >
                Skip
              </Button>
              {isLevelUpQuestion ? (
                <Button
                  onClick={handleSubmitLevelUp}
                  disabled={!(q.question_id in answeredFlags)}
                  className="bg-mathpath-purple hover:bg-purple-600"
                >
                  {goNext ? "Loading..." : "Submit"

                  }
                </Button>
              ) : (
                <Button
                  onClick={next}
                  className="bg-mathpath-purple hover:bg-purple-600"
                >
                  {goNext ? "Loading..." : "Next"

                  }

                </Button>
              )}
            </div>
          </div>
        </main>
      )}

      <Dialog open={showLevelUpModal} onOpenChange={setShowLevelUpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Great Job!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <p className="text-center">
              Congratulations, you cleared this level! Continue to level up.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitLevelUp} className="bg-mathpath-purple hover:bg-purple-600">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotQualifiedModal} onOpenChange={setShowNotQualifiedModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Not Qualified</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-center">
              You did not complete all sublevels. Please try again.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={continueNotQualified} className="bg-mathpath-purple hover:bg-purple-600">
              Go Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showLast} onOpenChange={setShowNot}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Practice Complete!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-center">
              You have completed this practice session. Take the quiz now to finish this level.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => navigate('/quiz')}
              className="bg-mathpath-purple hover:bg-purple-600 text-white px-8 py-4 text-lg"
            >
              Take the Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Practice;
