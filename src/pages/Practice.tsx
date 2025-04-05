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
import { HelpCircle, Lightbulb, Trophy } from "lucide-react";
import axios from "axios";

import { ColorUpGame } from "../lib/Game/ColorUpGame";
import { SortGame } from "../lib/Game/SortGame";
import { BoxGame } from "../lib/Game/BoxGame";
import EquationGame from "../lib/Game/DivisionGame";

interface Question {
  questionId: number;
  question: string;
  gameType: "Color Up Game" | "Sort Game" | "Box Game" | "Equation Game";
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
  equation_firstBoxCount?: number;
  equation_secondBoxCount?: number;
  level: {
    level_id: number;
    level_name: string;
    min_passing_percentage: number;
    discription: string;
  };
}

const HINT = {
  question: "Need help?",
  steps: [
    "Look at the objects carefully.",
    "Follow the instruction on the screen.",
    "Try moving one item at a time.",
  ],
  answer: "🎉",
};

const Practice: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  // answeredFlags stores whether a question was answered (true if correct, false if skipped/wrong)
  const [answeredFlags, setAnsweredFlags] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  // const [isLevelUpQuestion,setIslevelUp] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!user) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/admin/questions/${user.user_id}`
        );

        if (!data?.questions?.length) throw new Error("No questions received");

        const normalised: Question[] = data.questions.map((q: any) => ({
          ...q,
          questionId: q.question_id,
          question: q.question_text,
          gameType: q.game,
          difficulty: q.difficulty ?? 1,
          sortOrder: q.sortOrder ?? q.sort_order ?? 0,
        }));

        normalised.sort((a, b) => a.sortOrder - b.sortOrder);

        setQuestions(normalised);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || err.message,
          variant: "destructive",
        });
      }
    })();
  }, [backendUrl, isAuthenticated, navigate, toast, user]);

  const q = questions[current];
  const correctCount = Object.values(answeredFlags).filter(Boolean).length;
  const isLevelUpQuestion = q &&
    (q.questionId in answeredFlags) &&
    answeredFlags[q.questionId] === true &&
    correctCount > 0 &&
    correctCount % 5 === 0;
  const totalAnswered = Object.keys(answeredFlags).length;

  const setIsCorrect = (val: boolean) => {
    setAnsweredFlags((prev) => ({ ...prev, [q.questionId]: val }));
    if (current === questions.length - 1 && val) setShowCongrats(true);
  };

  const next = () => setCurrent((p) => p + 1);
  const prev = () => setCurrent((p) => p - 1);

  const skipQuestion = () => {
    setAnsweredFlags((prev) => ({ ...prev, [q.questionId]: false }));
    if (current < questions.length - 1) setCurrent((p) => p + 1);
  };




  const handleSubmit = () => {
    setShowLevelUpModal(true);
  };

  const continueLevelUp = () => {

    setShowLevelUpModal(false);
    if (current < questions.length - 1) next();
  };

  const renderGame = () => {
    switch (q.gameType) {
      case "Color Up Game":
        return (
          <ColorUpGame
            shape={q.colorUp_shape as any}
            totalItems={q.colorUp_totalItem!}
            colorCount={q.colorUp_coloredCount!}
            isCorrect={q.questionId in answeredFlags ? !!answeredFlags[q.questionId] : false}
            setIsCorrect={setIsCorrect}
          />
        );
      case "Sort Game":
        return (
          <SortGame
            shape={q.sort_shape as any}
            totalItem={q.sort_totalItem!}
            order={q.sort_order as any}
            isCorrect={q.questionId in answeredFlags ? !!answeredFlags[q.questionId] : false}
            setIsCorrect={setIsCorrect}
          />
        );
      case "Box Game":
        return (
          <BoxGame
            shape={q.box_shape as any}
            startInBox={q.box_firstBoxCount!}
            targetInBox={q.box_secondBoxCount!}
            isCorrect={q.questionId in answeredFlags ? !!answeredFlags[q.questionId] : false}
            setIsCorrect={setIsCorrect}
          />
        );
      case "Equation Game":
        return (
          <EquationGame
            shape={q.equation_shape as any}
            operand1={q.equation_firstBoxCount!}
            operand2={q.equation_secondBoxCount!}
            operation={q.equation_operation as "+" | "-" | "*"}
            result={q.equation_finalBoxcount!}
            isCorrect={q.questionId in answeredFlags ? !!answeredFlags[q.questionId] : false}
            setIsCorrect={setIsCorrect}
          />
        );
      default:
        return <div>Unknown game type.</div>;
    }
  };


  return (
    <div className="min-h-screen bg-sky-100 w-full">
      <Header />
      {
        !questions.length ?
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 mx-auto bg-mathpath-purple rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-medium text-gray-700">Fetching Questions...</h2>
            </div>
          </div>
          :

          <main className="ml-64 py-8 px-12 mx-auto space-y-6">
            <div className="flex justify-between text-sm mb-4">
              <span>
                <h2 className="font-semibold text-xl">Practice</h2>
                {/* Updated sub-level calculation */}
                <p>
                  {q.level.level_name} – SubLevel {Math.floor(correctCount / 5) + 1}
                </p>
              </span>
              <span>
                {correctCount} correct out of {totalAnswered} answered
              </span>
            </div>

            <Card>
              <CardContent className="p-6 pb-20 space-y-6">
                <div className="flex justify-end ">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(true)}
                    className="text-mathpath-purple border-mathpath-purple hover:bg-mathpath-lightPurple"
                  >
                    <Lightbulb className="h-5 w-5" />
                    Hint
                  </Button>
                </div>

                <h2 className="text-xl font-semibold text-start capitalize">{q.question}</h2>
                {renderGame()}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} disabled={current === 0}>
                Previous
              </Button>

              <div className="flex gap-2">
                {/* New Skip button */}
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
                    onClick={handleSubmit}
                    disabled={!(q.questionId in answeredFlags)}
                    className="bg-mathpath-purple hover:bg-purple-600"
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    onClick={next}
                    disabled={!(q.questionId in answeredFlags) || current === questions.length - 1}
                    className="bg-mathpath-purple hover:bg-purple-600"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </main>
      }

      <Dialog open={showHint} onOpenChange={setShowHint}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-lg font-medium">{HINT.question}</div>
            <div className="space-y-2">
              {HINT.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="bg-mathpath-lightPurple text-mathpath-purple rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <div className="font-medium">Answer: {HINT.answer}</div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHint(false)} className="bg-mathpath-purple hover:bg-purple-600">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button onClick={continueLevelUp} className="bg-mathpath-purple hover:bg-purple-600">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Great Job!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <p className="text-center">
              You’ve completed all the practice questions for this level.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCongrats(false)} className="bg-mathpath-purple hover:bg-purple-600">
              Continue for Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Practice;
