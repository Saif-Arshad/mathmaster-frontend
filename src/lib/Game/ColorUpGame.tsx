import React, { useEffect, useState } from "react";
import { shapes, shapeColors } from "./shape";

const getColoredSVG2 = (svg: string, shape: string) => svg.replace(/fill="gray"/g, `fill="${shapeColors[shape]}"`);

type Props = {
  shape?: keyof typeof shapes;
  totalItems: number;
  colorCount: number;
  isCorrect: boolean;
  setIsCorrect: (v: boolean) => void;
};

export const ColorUpGame: React.FC<Props> = ({ shape ="guava", totalItems, colorCount, isCorrect, setIsCorrect }) => {
  const [colored, setColored] = useState(Array(totalItems).fill(false));
  useEffect(() => {
    setColored(Array(totalItems).fill(false));
  }, [totalItems]);
  const toggle = (idx: number) => {
    const arr = [...colored];
    arr[idx] = !arr[idx];
    setColored(arr);
    setIsCorrect(arr.filter(Boolean).length === colorCount);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 gap-y-16 p-4">
      {Array.from({ length: totalItems }).map((_, i) => (
        <div key={i} className="w- " onClick={() => toggle(i)} dangerouslySetInnerHTML={{ __html: colored[i] || isCorrect ? getColoredSVG2(shapes[shape].uncolored, shape) : shapes[shape].uncolored }} />
      ))}
    </div>
  );
};
