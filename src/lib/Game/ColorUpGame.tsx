import React, { useState } from "react";
import { shapes, shapeColors } from "./shape";

const getColoredSVG = (svgString, shape) => {
  const fillColor = shapeColors[shape];
  let regex;
  if (shape === "orange") {
    regex = /fill="#CCCCCC"/g;
  } else {
    regex = /fill="gray"/g;
  }
  return svgString.replace(regex, `fill="${fillColor}"`);
};



const ColorUpGame = ({
  shape = "orange",
  totalItems = 10,
  colorCount = 5,
  question = "Color 5 apples",
}) => {
  const [colored, setColored] = useState(Array(totalItems).fill(false));
  const [isCorrect, setIsCorrect] = useState(false);

  const toggleColor = (index) => {
    const newColored = [...colored];
    newColored[index] = !newColored[index];
    setColored(newColored);
    const count = newColored.filter(Boolean).length;
    setIsCorrect(count === colorCount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
        {question}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: totalItems }).map((_, index) => (
          <div
            key={index}
            onClick={() => toggleColor(index)}
            className="w-[150px] h-[150px] mx-auto relative cursor-pointer rounded-full transition-transform transform hover:scale-105"
          >
            <div
              className="absolute inset-0"
              dangerouslySetInnerHTML={{
                __html: colored[index]
                  ? getColoredSVG(shapes[shape].uncolored, shape)
                  : shapes[shape].uncolored,
              }}
            />
          </div>
        ))}
      </div>
      {isCorrect && (
        <div className="text-center">
          <button className="mt-8 px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow hover:bg-green-600 transition">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorUpGame;
