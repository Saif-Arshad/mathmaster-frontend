import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { shapes, shapeColors } from "./shape";

function getShapeSvg(shapeKey, wantColored = true) {
    const shapeEntry = shapes[shapeKey];
    if (!shapeEntry) return "";
    let svgString = shapeEntry.uncolored;
    if (wantColored) {
        const color = shapeColors[shapeKey] || "#CCCCCC";
        svgString = svgString.replace(/fill="gray"/g, `fill="${color}"`);
    }
    return svgString;
}

const getSizedSVG = (svgString, size) => {
    let updated = svgString.replace(/width="[^"]+"/, `width="${size}px"`);
    updated = updated.replace(/height="[^"]+"/, `height="${size}px"`);
    return updated;
};

function neededCount(operand1, operation, result) {
    switch (operation) {
        case "+": return result - operand1;
        case "-": return operand1 - result;
        case "*":
        case "×": return operand1 === 0 ? 0 : result / operand1;
        case "/":
        case "÷": return result === 0 ? 0 : operand1 / result;
        default: return 0;
    }
}

const EquationGame = ({
    shape = "apple",
    operand1 = 3,
    operation = "+",
    result = 7,
    totalItemsInSource = 10,
    question = "Add items in the second bucket until we reach the final result",
}) => {
    const validShape = shapes[shape] ? shape : "apple";
    const [sourceItems, setSourceItems] = useState(
        Array.from({ length: totalItemsInSource }, (_, i) => ({ id: `src-${i}` }))
    );
    const [secondBoxItems, setSecondBoxItems] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        if (sourceId === destId) {
            if (sourceId === "source") {
                const newItems = Array.from(sourceItems);
                const [moved] = newItems.splice(source.index, 1);
                newItems.splice(destination.index, 0, moved);
                setSourceItems(newItems);
            } else {
                const newItems = Array.from(secondBoxItems);
                const [moved] = newItems.splice(source.index, 1);
                newItems.splice(destination.index, 0, moved);
                setSecondBoxItems(newItems);
            }
        } else {
            if (sourceId === "source" && destId === "box2") {
                const newSource = Array.from(sourceItems);
                const newBox2 = Array.from(secondBoxItems);
                const [moved] = newSource.splice(source.index, 1);
                newBox2.splice(destination.index, 0, moved);
                setSourceItems(newSource);
                setSecondBoxItems(newBox2);
                const needed = neededCount(operand1, operation, result);
                setIsCorrect(newBox2.length === needed);
            } else if (sourceId === "box2" && destId === "source") {
                const newSource = Array.from(sourceItems);
                const newBox2 = Array.from(secondBoxItems);
                const [moved] = newBox2.splice(source.index, 1);
                newSource.splice(destination.index, 0, moved);
                setSourceItems(newSource);
                setSecondBoxItems(newBox2);
                const needed = neededCount(operand1, operation, result);
                setIsCorrect(newBox2.length === needed);
            }
        }
    };

    const renderStaticItems = (count) => {
        return Array.from({ length: count }).map((_, i) => (
            <div key={`static-${i}`} className="w-10 h-10 m-1">
                <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                        __html: getSizedSVG(getShapeSvg(validShape, true), 40),
                    }}
                />
            </div>
        ));
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{question}</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="source" direction="horizontal">
                    {(provided) => (
                        <div
                            className="flex flex-wrap w-64 min-h-[60px] bg-gray-200 p-2 rounded mb-6"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {sourceItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="w-10 h-10 m-1"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div
                                                className="w-full h-full"
                                                dangerouslySetInnerHTML={{
                                                    __html: getSizedSVG(getShapeSvg(validShape, true), 40),
                                                }}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <div className="flex items-center space-x-2">
                    <div className="flex flex-wrap justify-center items-center bg-white rounded p-2 w-36 h-36">
                        {renderStaticItems(operand1)}
                    </div>
                    <div className="text-4xl font-bold">{operation}</div>
                    <Droppable droppableId="box2" direction="horizontal">
                        {(provided) => (
                            <div
                                className={`flex flex-wrap justify-center items-center bg-white rounded p-2 w-36 h-36 ${isCorrect ? "border-4 border-green-500" : ""
                                    }`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {secondBoxItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="w-10 h-10 m-1"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div
                                                    className="w-full h-full"
                                                    dangerouslySetInnerHTML={{
                                                        __html: getSizedSVG(getShapeSvg(validShape, true), 40),
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className="text-4xl font-bold">=</div>
                    <div className="flex flex-wrap justify-center items-center bg-white rounded p-2 w-36 h-36">
                        {renderStaticItems(result)}
                    </div>
                </div>
            </DragDropContext>
            {isCorrect && (
                <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
                    Next
                </button>
            )}
        </div>
    );
};

export default EquationGame;