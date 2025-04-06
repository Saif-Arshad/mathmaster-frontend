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

const Quiz: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);

    const [answeredFlags, setAnsweredFlags] = useState<Record<number, boolean>>({});

    const [showHint, setShowHint] = useState(false);
    const [error, setError] = useState("");
    const [showCongrats, setShowCongrats] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, isAuthenticated, setUserProgress } = useAuth();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

   
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        if (!user) return;

        (async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${backendUrl}/quiz/${user.user_id}`);

                console.log("🚀 ~ data:", data)
                if (!data?.questions?.length) throw new Error("No questions received");

                const normalized: Question[] = data.questions.map((q: any) => ({
                    ...q,
                    questionId: q.question_id,
                    question: q.question_text,
                    gameType: q.game,
                    difficulty: q.difficulty ?? 1,
                    sortOrder: q.sortOrder ?? q.sort_order ?? 0,
                }));
                
                
                console.log("🚀 ~ constnormalized:Question[]=data.questions.map ~ normalized:", normalized)
                setQuestions(normalized);
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
    }, [backendUrl, isAuthenticated, navigate, toast, user]);

    
    const q = questions[current] || ({} as Question);
    const correctCount = Object.values(answeredFlags).filter(Boolean).length;
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

    
    const handleSubmit = async () => {
       
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/quiz/submit`, {
                user_id: user?.user_id,
                level_id: q.level.level_id,
                correct_answers: correctCount,
                total_questions: questions.length,
            });
            if (data) {
                toast({
                    title: "Success",
                    description: "Level up successfully!",
                    variant: "default",
                });
                // Update user progress (if needed)
                setUserProgress((prev: any) => ({
                    ...prev,
                    progress: data.progress,
                }));
                setShowCongrats(true);
            }
        } catch (e: any) {
            toast({
                title: "Error",
                description: e.response?.data?.message || e.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };


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
            {loading ? (
                <div className="min-h-screen flex items-center mr-64 justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="w-16 h-16 mx-auto bg-mathpath-purple rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
                    </div>
                </div>
            ) : (
                <main className="mr-64 py-8 px-12 mx-auto space-y-6">
                    <div className="flex justify-between text-sm mb-4">
                        <span>
                            <h2 className="font-semibold text-xl">
                                {q?.level?.level_name} Quiz
                            </h2>
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

                            <h2 className="text-xl font-semibold text-start capitalize">
                                {q.question}
                            </h2>
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
                            {/* If user answered at least 10 correct, show "Submit" (your custom logic) */}
                            {correctCount >= 10 ? (
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
                                    disabled={
                                        !(q.questionId in answeredFlags) ||
                                        current === questions.length - 1
                                    }
                                    className="bg-mathpath-purple hover:bg-purple-600"
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </main>
            )}

            <div className="fixed right-0 top-0 h-full w-64 p-6 bg-mathpath-purple overflow-y-auto shadow-lg">
                <h2 className="text-xl text-white  font-bold text-center mb-4">
                    {q?.level?.level_name || "Level"} {" "} Quiz
                </h2>
                <div className="space-y-2">
                    {questions.map((question, index) => {
                        const isAnswered = question.questionId in answeredFlags;
                        return (
                            <div
                                key={question.questionId}
                                className={`cursor-pointer rounded p-2 text-center 
                  ${isAnswered ? "bg-pink-400 text-white" : "bg-white/10 text-white"}`}
                                onClick={() => setCurrent(index)}
                            >
                                Question {index + 1}
                            </div>
                        );
                    })}
                </div>
            </div>

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
                        <Button
                            onClick={() => setShowHint(false)}
                            className="bg-mathpath-purple hover:bg-purple-600"
                        >
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Quiz Results</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4 py-4">
                        <Trophy className="h-12 w-12 text-yellow-500" />
                        <p className="text-lg font-semibold">
                            Questions Attempted: {totalAnswered}
                        </p>
                        <p className="text-lg font-semibold">
                            Correct Answers: {correctCount}
                        </p>
                        <p className="text-lg font-semibold">
                            Score: {Math.round((correctCount / totalAnswered) * 100)}%
                        </p>
                    </div>
                    <div className="w-full">
                        <h3 className="font-medium mb-2">Questions Summary:</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {questions.map((question, index) => (
                                <div
                                    key={question.questionId}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${answeredFlags[question.questionId]
                                                ? "bg-green-500"
                                                : question.questionId in answeredFlags
                                                    ? "bg-red-500"
                                                    : "bg-gray-300"
                                            }`}
                                    />
                                    <span>
                                        Question {index + 1}:{" "}
                                        {answeredFlags[question.questionId]
                                            ? "Correct"
                                            : question.questionId in answeredFlags
                                                ? "Incorrect"
                                                : "Not Answered"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => (window.location.href = "/")}
                            className="bg-mathpath-purple hover:bg-purple-600"
                        >
                            Back to Home
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Quiz;
