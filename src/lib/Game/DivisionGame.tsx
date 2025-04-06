/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { shapes, shapeColors } from "./shape";


const colorSvg = (svg: string, shape: string, size: number) => {
    const fill = shapeColors[shape];
    return svg
        .replace(/fill="gray"/g, `fill="${fill}"`)
        .replace(/fill="#CCCCCC"/g, `fill="${fill}"`)
        .replace(/fill="#A5A5A5"/g, `fill="${fill}"`)
        .replace(/width="[^"]+"/, `width="${size}px"`)
        .replace(/height="[^"]+"/, `height="${size}px"`);
};

const graySvg = (svg: string, size: number) =>
    svg
        .replace(/width="[^"]+"/, `width="${size}px"`)
        .replace(/height="[^"]+"/, `height="${size}px"`);


const needSecondBox = (op1: number, op: string, res: number) => {
    switch (op) {
        case "+":
            return res - op1;
        case "-":
            return op1 - res;
        case "*":
            return op1 === 0 ? 0 : res / op1;
        default:
            return 0;
    }
};

type Props = {
    shape: keyof typeof shapes;
    operand1: number;
    operand2: number;
    operation: "+" | "-" | "*";
    result: number;
    isCorrect: boolean;
    setIsCorrect: (v: boolean) => void;
    shapeSize?: number; // <‑‑ NEW
};

const EquationGame: React.FC<Props> = ({
    shape = "guava",
    operand1,
    operand2,
    operation,
    result,
    isCorrect,
    setIsCorrect,
    shapeSize = 48,
}) => {
  
    const [box2, setBox2] = useState<Array<{ id: string }>>([]);
    const [source, setSrc] = useState(
        Array.from({ length: operand2 }, (_, i) => ({ id: `src-${i}` }))
    );

    const goal = needSecondBox(operand1, operation, result);

    const baseSvg = useMemo(
        () => graySvg(shapes[shape].uncolored, shapeSize),
        [shape, shapeSize]
    );
    const filledSvg = useMemo(
        () => colorSvg(shapes[shape].uncolored, shape, shapeSize),
        [shape, shapeSize]
    );

    const move = (
        src: any[],
        dst: any[],
        sIdx: number,
        dIdx: number
    ): { cloneS: any[]; cloneD: any[] } => {
        const cloneS = Array.from(src);
        const cloneD = Array.from(dst);
        const [itm] = cloneS.splice(sIdx, 1);
        cloneD.splice(dIdx, 0, itm);
        return { cloneS, cloneD };
    };

    const onDragEnd = (r: DropResult) => {
        if (!r.destination) return;
        const { source: s, destination: d } = r;
        if (s.droppableId === d.droppableId) return;

        if (s.droppableId === "src") {
            const { cloneS, cloneD } = move(source, box2, s.index, d.index);
            setSrc(cloneS);
            setBox2(cloneD);
            setIsCorrect(cloneD.length === goal);
        } else {
            const { cloneS, cloneD } = move(box2, source, s.index, d.index);
            setBox2(cloneS);
            setSrc(cloneD);
            setIsCorrect(cloneS.length === goal);
        }
    };

    const ShapeIcon = ({ colored }: { colored?: boolean }) => (
        <div
            style={{ width: shapeSize, height: shapeSize }}
            dangerouslySetInnerHTML={{ __html: colored ? filledSvg : baseSvg }}
        />
    );

    const renderBucket = (items: any[], id: string) => (
        <Droppable droppableId={id} direction="horizontal">
            {(p) => (
                <div
                    ref={p.innerRef}
                    {...p.droppableProps}
                    className="flex flex-wrap bg-white rounded-lg p-2 shadow-sm min-h-[64px] w-full sm:w-48"
                >
                    {items.map((it, idx) => (
                        <Draggable key={it.id} draggableId={it.id} index={idx}>
                            {(p) => (
                                <div
                                    ref={p.innerRef}
                                    {...p.draggableProps}
                                    {...p.dragHandleProps}
                                >
                                    <ShapeIcon colored={id === "box2" && isCorrect} />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {p.placeholder}
                </div>
            )}
        </Droppable>
    );

    // read‑only bucket
    const renderStaticBucket = (count: number, colored?: boolean) => (
        <div className="grid grid-cols-3 gap-4 bg-gray-200 rounded-lg p-2 py-5 shadow-sm h-full min-h-[64px] w-full sm:w-56">
            {Array.from({ length: count }).map((_, i) => (
                <ShapeIcon key={i} colored={colored} />
            ))}
        </div>
    );

    return (
        <div className="flex flex-col items-center space-y-6 p-4 w-full max-w-3xl mx-auto">
            <DragDropContext onDragEnd={onDragEnd}>
                {renderBucket(source, "src")}

                <div className="flex items-center justify-center flex-wrap gap-2 text-3xl font-bold mt-4 w-full">
                    {renderStaticBucket(operand1)} 
                    <div> {operation} </div>
                    {renderBucket(box2, "box2")} 
                    <div>=</div>
                    {renderStaticBucket(result, isCorrect)} 
                </div>
            </DragDropContext>
        </div>
    );
};

export default EquationGame;
