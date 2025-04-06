/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { shapes, shapeColors } from "./shape";

const getColoredSVG = (svg: string, shape: string) => svg.replace(/fill="gray"/g, `fill="${shapeColors[shape]}"`);
const sizeSvg = (svg: string, size: number) => svg.replace(/width="\d+"/g, `width="${size}"`).replace(/height="\d+"/g, `height="${size}"`);

type Props = {
    shape: keyof typeof shapes;
    startInBox: number;   
    targetInBox: number;  
    isCorrect: boolean;
    setIsCorrect: (v: boolean) => void;
};

export const BoxGame: React.FC<Props> = ({ shape = "guava", startInBox, targetInBox, isCorrect, setIsCorrect }) => {
    console.log("🚀 ~ shape:", shape)

    const [inBox, setInBox] = useState(Array.from({ length: startInBox }, (_, i) => ({ id: `in-${i}` })));
    const [outBox, setOutBox] = useState<{ id: string }[]>([]);

    const move = (src: any[], dst: any[], sIdx: number, dIdx: number) => {
        const cloneSrc = Array.from(src);
        const cloneDst = Array.from(dst);
        const [itm] = cloneSrc.splice(sIdx, 1);
        cloneDst.splice(dIdx, 0, itm);
        return { cloneSrc, cloneDst };
    };

    const onDragEnd = (r: DropResult) => {
        if (!r.destination) return;
        const { source, destination } = r;

        if (source.droppableId === destination.droppableId) return; // no reorder needed

        if (source.droppableId === "inBox") {
            const { cloneSrc, cloneDst } = move(inBox, outBox, source.index, destination.index);
            setInBox(cloneSrc); setOutBox(cloneDst);
            setIsCorrect(cloneSrc.length === targetInBox);
        } else {
            const { cloneSrc, cloneDst } = move(outBox, inBox, source.index, destination.index);
            setOutBox(cloneSrc); setInBox(cloneDst);
            setIsCorrect(cloneDst.length === targetInBox);
        }
    };

    const svg = sizeSvg(shapes[shape].uncolored, 40);
    const coloredSvg = sizeSvg(getColoredSVG(shapes[shape].uncolored, shape), 40);

    const renderItems = (arr: any[], droppableId: string) => (
        <Droppable droppableId={droppableId} direction="horizontal">
            {(p) => (
                <div ref={p.innerRef} {...p.droppableProps} className="h-full grid grid-cols-4 w-full bg-gray-200 p-2 py-5 rounded-xl min-h-[64px] ">
                    {arr.map((it, idx) => (
                        <Draggable key={it.id} draggableId={it.id} index={idx}>
                            {(p) => (
                                <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="  m-1" dangerouslySetInnerHTML={{ __html: droppableId === "inBox" && isCorrect ? coloredSvg : svg }} />
                            )}
                        </Draggable>
                    ))}
                    {p.placeholder}
                </div>
            )}
        </Droppable>
    );

    return (
        <div className="flex flex-col items-center space-y-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
                    {renderItems(inBox, "inBox")}
                    {renderItems(outBox, "outBox")}
                </div>
            </DragDropContext>
        </div>
    );
};
