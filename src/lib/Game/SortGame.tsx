/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { shapes, shapeColors } from "./shape";

const getColoredSVG = (svg: string, shape: string) => {
  const fill = shapeColors[shape];
  const regex = shape === "orange" ? /fill="#CCCCCC"/g : /fill="gray"/g;
  return svg.replace(regex, `fill="${fill}"`);
};

type Props = {
  shape: keyof typeof shapes;
  totalItem: number;
  order: "asc" | "desc";
  isCorrect: boolean;
  setIsCorrect: (v: boolean) => void;
};

export const SortGame: React.FC<Props> = ({ shape, totalItem, order, isCorrect, setIsCorrect }) => {
  /* generate & shuffle list */
  const make = (n: number) =>
    Array.from({ length: n }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .map((num, i) => ({ id: `num-${i}`, number: num }));

  const [items, setItems] = useState(() => make(totalItem));

  useEffect(() => {
    setItems(make(totalItem));
    setIsCorrect(false);
  }, [totalItem]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const arr = Array.from(items);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);
    setItems(arr);

    const sorted = arr.every((it, idx) => idx === 0 || (order === "asc" ? it.number >= arr[idx - 1].number : it.number <= arr[idx - 1].number));
    setIsCorrect(sorted);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sort" direction="horizontal">
          {(p) => (
            <div ref={p.innerRef} {...p.droppableProps} className="flex space-x-4">
              {items.map((it, idx) => (
                <Draggable key={it.id} draggableId={it.id} index={idx}>
                  {(p, snap) => (
                    <div
                      ref={p.innerRef}
                      {...p.draggableProps}
                      {...p.dragHandleProps}
                      style={{ ...p.draggableProps.style, zIndex: snap.isDragging ? 100 : 1 }}
                      className="flex flex-col items-center"
                    >
                      {/* shape */}
                      <>

                        <div
                          className="w-28 h-28 pointer-events-none"
                          dangerouslySetInnerHTML={{
                            __html: isCorrect
                              ? getColoredSVG(shapes[shape].uncolored, shape)
                              : shapes[shape].uncolored,
                          }}
                        />

                        <div className="h-7 w-7 p-1 mt-12  bg-mathpath-purple rounded-full ml-10 flex items-center justify-center">
                          <span className="font-bold text-white">{it.number}</span>
                        </div>
                      </>
                    </div>
                  )}
                </Draggable>

              ))}
              {p.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};