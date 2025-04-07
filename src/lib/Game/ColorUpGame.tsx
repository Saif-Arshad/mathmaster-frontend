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
  totalItems = 5,
  colorCount = 1,
  isCorrect,
  id,
  setIsCorrect
}) => {
  console.log("🚀 ~ colorCount:", colorCount)
  console.log("🚀 ~ totalItems:", totalItems)
  const [colored, setColored] = useState(Array(totalItems).fill(false));
  console.log("🚀 ~ colored:", colored)

  useEffect(() => {
    setColored(Array(totalItems).fill(false));
  }, [id, colorCount, totalItems]);

  const toggle = (idx: number) => {
    console.log("🚀 ~ toggle ~ idx:", idx)
    const arr = [...colored];
    console.log("🚀 ~ toggle ~ arr:", arr)
    console.log("🚀 ~ toggle ~ arr:", colorCount)
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
