import React, { useEffect, useState } from "react";
import { shapes, shapeColors } from "./shape";

const getColoredSVG = (svg: string, shape: string) =>
  svg.replace(/fill="gray"/g, `fill="${shapeColors[shape]}"`);

type Props = {
  shape?: keyof typeof shapes;
  totalItems: number;
  colorCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
  isCorrect: boolean;
  setIsCorrect: (v: boolean) => void;
};

export const ColorUpGame: React.FC<Props> = ({
  shape = "guava",
  totalItems,
  colorCount,
  isCorrect,
  id,
  setIsCorrect
}) => {
  const [colored, setColored] = useState(Array(totalItems).fill(false));
  console.log("🚀 ~ colored:", colored)

  useEffect(() => {
    setColored(Array(totalItems).fill(false));
  }, [id]);

  const toggle = (idx: number) => {
    const arr = [...colored];
    arr[idx] = !arr[idx];
    setColored(arr);
    setIsCorrect(arr.filter(Boolean).length === colorCount);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 gap-y-16 p-4">
      {Array.from({ length: totalItems }).map((_, i) => (
        <div
          key={i}
          className="w-"
          onClick={() => toggle(i)}
          dangerouslySetInnerHTML={{
            __html: colored[i]
              ? getColoredSVG(shapes[shape].uncolored, shape)
              : shapes[shape].uncolored
          }}
        />
      ))}
    </div>
  );
};
