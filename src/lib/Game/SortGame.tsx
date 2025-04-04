import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { shapes, shapeColors } from "./shape";

// Function to get colored SVG
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

const SortGame = ({
  shape = "orange",
  numbersToSort = [4, 2, 3],
  instruction = "Sort the numbers from smallest to largest",
}) => {
  // Shuffle numbers on component mount
  const [items, setItems] = useState(() => {
    const shuffledNumbers = [...numbersToSort].sort(() => Math.random() - 0.5);
    return shuffledNumbers.map((num, idx) => ({ id: `item-${idx}`, number: num }));
  });
  const [isCorrect, setIsCorrect] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);

    // Check if sorted in ascending order (allowing duplicates)
    const sorted = newItems.every(
      (item, idx, arr) => idx === 0 || item.number >= arr[idx - 1].number
    );
    setIsCorrect(sorted);
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{instruction}</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sort" direction="horizontal">
          {(provided) => (
            <div
              className="flex space-x-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative w-32 h-32 flex items-center justify-center"
                      style={{
                        ...provided.draggableProps.style,
                        zIndex: provided.isDragging ? 100 : 1, // Higher z-index when dragging
                      }}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none"
                        dangerouslySetInnerHTML={{
                          __html: isCorrect
                            ? getColoredSVG(shapes[shape].uncolored, shape)
                            : shapes[shape].uncolored,
                        }}
                      />
                      <span
                        className="absolute text-md font-bold text-gray-100 pointer-events-none"
                        style={{
                          top: "70%",
                          left: "60%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {item.number}
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              <div style={{ visibility: "hidden" }}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isCorrect && (
        <button className="mt-12 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
          Next
        </button>
      )}
    </div>
  );
};

export default SortGame;