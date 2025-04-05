/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import {SortGame} from "../lib/Game/SortGame";
import { BoxGame } from "../lib/Game/BoxGame";
import { ColorUpGame } from "../lib/Game/ColorUpGame";
import  EquationGame  from "../lib/Game/DivisionGame";

const InitialQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [correctFlags, setCorrectFlags] = useState<{ [id: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user?.isAdmin) navigate("/admin");
    if (user?.completedQuiz) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/initial-quiz`);
        setQuestions(data);
      } catch (err: any) {
        toast({ title: "Error", description: err.response?.data?.message || "Fetch failed", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [backendUrl, toast]);

  const setIsCorrect = (val: boolean) => {
    const id = questions[current].quiz_id;
    setCorrectFlags({ ...correctFlags, [id]: val });
  };

  const next = () => setCurrent((p) => p + 1);
  const prev = () => setCurrent((p) => p - 1);

  const submit = async () => {
    setSubmitting(true);
    const correctCount = questions.filter((q) => correctFlags[q.quiz_id]).length;
    const percent = (correctCount / questions.length) * 100;
    const storedUser = localStorage.getItem('mathmaster_user');


    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
    
      const updatedUser = {
        ...parsedUser,
        level: percent,
        completedQuiz: true,
      };
      localStorage.setItem('mathmaster_user', JSON.stringify(updatedUser));
    }

    try {
      // @ts-ignore
      await axios.post(`${backendUrl}/user/submit-inital`, { user_id: user.user_id, percentage: Math.round(percent) });
      toast({ title: "Assessment Completed!", description: `Your score is ${Math.round(percent)}%.` });
      window.location.href = "/";

    } catch (err) {
      toast({ title: "Error", description: "Submit failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!questions.length) return <div className="min-h-screen flex items-center justify-center">No questions.</div>;

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const answered = !!correctFlags[q.quiz_id];
  const last = current === questions.length - 1;

  const renderGame = () => {
    switch (q.game) {
      case "Color Up Game":
        return <ColorUpGame shape={q.colorUp_shape as any} totalItems={q.colorUp_totalItem!} colorCount={q.colorUp_coloredCount!} isCorrect={answered} setIsCorrect={setIsCorrect} />;
      case "Sort Game":
        return <SortGame shape={q.sort_shape as any} totalItem={q.sort_totalItem!} order={q.sort_order as any} isCorrect={answered} setIsCorrect={setIsCorrect} />;
      case "Box Game":
        return <BoxGame shape={q.box_shape as any} startInBox={q.box_firstBoxCount!} targetInBox={q.box_secondBoxCount!} isCorrect={answered} setIsCorrect={setIsCorrect} />;
      case "Equation Game":
        return <EquationGame shape={q.equation_shape as any} operand1={q.equation_firstBoxCount!} operand2={q.equation_secondBoxCount!} operation={q.equation_operation} result={q.equation_finalBoxcount!} isCorrect={answered} setIsCorrect={setIsCorrect} />;
      default:
        return <div>Unknown game type.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Question {current + 1} / {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <h2 className="text-xl font-bold text-center">{q.question_text}</h2>
        {renderGame()}

        <div className="flex justify-between">
          <Button variant="outline" onClick={prev} disabled={current === 0}>Previous</Button>
          {last ? (
            <Button onClick={submit} disabled={!answered || submitting} className="bg-mathpath-purple hover:bg-purple-600">{submitting ? "Submitting…" : "Submit"}</Button>
          ) : (
            <Button onClick={next} disabled={!answered} className="bg-mathpath-purple hover:bg-purple-600">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialQuiz;
