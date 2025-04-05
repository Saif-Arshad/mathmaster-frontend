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
  const [answeredFlags, setAnsweredFlags] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

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
  const totalAnswered = Object.keys(answeredFlags).length;
  const correctCount = Object.values(answeredFlags).filter(Boolean).length;

  const setIsCorrect = (val: boolean) => {
    setAnsweredFlags((prev) => ({ ...prev, [q.questionId]: val }));
    if (current === questions.length - 1 && val) setShowCongrats(true);
  };
  const next = () => setCurrent((p) => p + 1);
  const prev = () => setCurrent((p) => p - 1);

  const renderGame = () => {
    switch (q.gameType) {
      case "Color Up Game":
        return (
          <ColorUpGame
            shape={q.colorUp_shape as any}
            totalItems={q.colorUp_totalItem!}
            colorCount={q.colorUp_coloredCount!}
            isCorrect={!!answeredFlags[q.questionId]}
            setIsCorrect={setIsCorrect}
          />
        );
      case "Sort Game":
        return (
          <SortGame
            shape={q.sort_shape as any}
            totalItem={q.sort_totalItem!}
            order={q.sort_order as any}
            isCorrect={!!answeredFlags[q.questionId]}
            setIsCorrect={setIsCorrect}
          />
        );
      case "Box Game":
        return (
          <BoxGame
            shape={q.box_shape as any}
            startInBox={q.box_firstBoxCount!}
            targetInBox={q.box_secondBoxCount!}
            isCorrect={!!answeredFlags[q.questionId]}
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
            isCorrect={!!answeredFlags[q.questionId]}
            setIsCorrect={setIsCorrect}
          />
        );
      default:
        return <div>Unknown game type.</div>;
    }
  };

  if (!questions.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );

  return (
    <div className="min-h-screen bg-sky-100">
      <Header />

      <main className="ml-64 py-8 px-12 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between text-sm mb-4">
          <span>
            <h2 className="font-semibold text-xl">Practice</h2>
            <p>
              {q.level.level_name} – SubLevel {Math.floor(correctCount / 5 == 0 ? 1 : correctCount / 5)}
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

                <Lightbulb className=" h-5 w-5" />
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

            <Button
              onClick={next}
              disabled={!answeredFlags[q.questionId] || current === questions.length - 1}
              className="bg-mathpath-purple hover:bg-purple-600"
            >
              Next
            </Button>
          </div>
        </div>
      </main>

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
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Practice;
