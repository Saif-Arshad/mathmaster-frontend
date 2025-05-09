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
import Hint from "@/lib/Game/hint";

interface Question {
    questionId: number;
    question_id: number;
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

const Quiz: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);
    const [currentLevel, setCurrentLevel] = useState<any>();
    const [answeredFlags, setAnsweredFlags] = useState<Record<number, boolean>>({});
    const [error, setError] = useState("");
    const [showCongrats, setShowCongrats] = useState(false);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState({} as Question);
    const [quizResult, setQuizResult] = useState(""); // New state to store pass/fail result

    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, isAuthenticated, setUserProgress } = useAuth();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (questions.length > 0) {
            setQ(questions[current]);
        }
    }, [questions, current]);

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
                if (!data?.questions?.length) throw new Error("No questions received");
                setCurrentLevel(data.level);
                const normalized: Question[] = data.questions.map((q: any) => ({
                    ...q,
                    questionId: q.question_id,
                    question: q.question_text,
                    gameType: q.game,
                    difficulty: q.difficulty ?? 1,
                    sortOrder: q.sortOrder ?? q.sort_order ?? 0,
                }));
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

    const correctCount = Object.values(answeredFlags).filter(Boolean).length;
    const totalAnswered = Object.keys(answeredFlags).length;

    const setIsCorrect = (val: boolean) => {
        setAnsweredFlags((prev) => ({ ...prev, [q.questionId]: val }));
    };

    const next = () => {
        if (current === questions.length - 1) {
            handleSubmit();
        } else {
            setCurrent((p) => p + 1);
        }
    };
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
                total_questions: current + 1,
            });
            if (data) {
                console.log("🚀 ~ handleSubmit ~ data:", data)
                toast({
                    title: "Quiz Submitted",
                    description: data.message,
                    variant: "default",
                });
                setUserProgress((prev: any) => ({
                    ...prev,
                    progress: data.progress,
                }));
                setQuizResult(data.result); // Store the pass/fail result from backend
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
                        id={q.question_id!}
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
                        id={q.question_id!}
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
                        id={q.question_id!}
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
                        id={q.question_id!}
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
                    </div>
                    <Card>
                        <CardContent className="p-6 pb-20 space-y-6">
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
                                    className="bg-mathpath-purple hover:bg-purple-600"
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </main>
            )}

            <div className="fixed right-5 rounded-xl top-20 h-[80vh] w-64 p-6 bg-mathpath-purple overflow-y-auto shadow-lg">
                <h2 className="text-xl text-white font-bold text-center mb-4">
                    {q?.level?.level_name || "Level"} Quiz
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
                        <p className="text-lg font-semibold">
                            Result: {quizResult.toUpperCase()}
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
