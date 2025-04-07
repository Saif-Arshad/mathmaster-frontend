/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import React, { useState } from "react";


export type GameType = "color" | "sort" | "box" | "equation";

interface HintContent {
    question: string;
    steps: string[];
    answer: string;
}


const HINTS: Record<GameType, HintContent> = {
    color: {
        question: "Need help colouring?",
        steps: [
            "Count the pictures slowly, pointing at each one.",
            "Look at the number in the question.",
            "Tap that many pictures to colour them.",

        ],
        answer: "Count, then colour 🎨",
    },
    sort: {
        question: "Need help sorting?",
        steps: [
            "Say each number out loud.",
            "Find the smallest number first.",
            "Put the numbers from smallest to biggest.",
        ],
        answer: "Small → Big 📈",
    },
    box: {
        question: "Need help with the box?",
        steps: [
            "Read how many should stay inside.",
            "Drag extra items out — or drag more in.",
            "Stop when the box shows the right number.",
        ],
        answer: "Just the right number 📦",
    },
    equation: {
        question: "Need help with the sum?",
        steps: [
            "Solve the sum one step at a time (use fingers if it helps).",
            "Remember your answer number.",
            "Colour or move that many objects.",
        ],
        answer: "Solve, then act ➕",
    },
};



const Hint = ({ gameType, questionHint }: any) => {
    const [open, setOpen] = useState(false);
    switch (gameType) {
        case "Equation Game":
            gameType = "equation";
            break;
        case "Color Game":
            gameType = "color";
            break;
        case "Sort Game":
            gameType = "sort";
            break;
        case "Box Game":
            gameType = "box";
            break;
        default:
            gameType = "color";
            break;
    }
    const hint = HINTS[gameType] ?? HINTS.color;

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="text-mathpath-purple border-mathpath-purple hover:bg-mathpath-lightPurple"
            >
                <Lightbulb className="h-5 w-5" />
                Hint
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hint</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-lg font-medium">{hint.question}</p>

                        <div className="space-y-2">
                            {hint.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="bg-mathpath-lightPurple text-mathpath-purple rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <p>{step}</p>
                                </div>
                            ))}
                        </div>
                        {
                            questionHint &&
                            <img src={questionHint.image} alt="" />
                        }
                        <p className="font-medium">Remember: {hint.answer}</p>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={() => setOpen(false)}
                            className="bg-mathpath-purple hover:bg-purple-600"
                        >
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Hint;
