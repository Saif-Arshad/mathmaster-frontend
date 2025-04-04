import React, { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { shapes, shapeColors } from "./shape";

// Helper functions
const getColoredSVG = (svgString: string, shape: string): string => {
    const fillColor = shapeColors[shape];
    let regex;
    if (shape === "orange") {
        regex = /fill="#CCCCCC"/g;
    } else if (shape === "carrot") {
        regex = /fill="#A5A5A5"/g;
    } else {
        regex = /fill="gray"/g;
    }
    return svgString.replace(regex, `fill="${fillColor}"`);
};

const getSizedSVG = (svgString: string, size: number): string => {
    let updated = svgString.replace(/width="[^"]+"/, `width="${size}px"`);
    updated = updated.replace(/height="[^"]+"/, `height="${size}px"`);
    return updated;
};

interface BoxGameProps {
    shape?: "apple" | "orange" | "guava" | "carrot";
    startInBox?: number;
    targetInBox?: number;
    question?: string;
    shapeSize?: number; // Size in pixels for the SVG shapes
}

const BoxGame: React.FC<BoxGameProps> = ({
    shape = "apple",
    startInBox = 15,
    targetInBox = 3,
    question = "Leave 3 apples in the box",
    shapeSize = 40,
}) => {
    const [inBoxItems, setInBoxItems] = useState(
        Array.from({ length: startInBox }, (_, i) => ({ id: `item-${i}` }))
    );
    const [outBoxItems, setOutBoxItems] = useState<Array<{ id: string }>>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    // Handle drag-and-drop logic with bounds checking
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const newInBoxItems = [...inBoxItems];
        const newOutBoxItems = [...outBoxItems];

        // Moving items out of or within the inBox
        if (source.droppableId === "inBox") {
            if (source.index < 0 || source.index >= newInBoxItems.length) {
                console.warn(
                    "Invalid source index for inBox:",
                    source.index,
                    "Length:",
                    newInBoxItems.length
                );
                return;
            }
            const [movedItem] = newInBoxItems.splice(source.index, 1);
            if (destination.droppableId === "inBox") {
                // Reordering within the box
                newInBoxItems.splice(destination.index, 0, movedItem);
            } else {
                // Moving to outBox
                newOutBoxItems.splice(destination.index, 0, movedItem);
            }
        } else {
            // Moving items out of or within the outBox
            if (source.index < 0 || source.index >= newOutBoxItems.length) {
                console.warn(
                    "Invalid source index for outBox:",
                    source.index,
                    "Length:",
                    newOutBoxItems.length
                );
                return;
            }
            const [movedItem] = newOutBoxItems.splice(source.index, 1);
            if (destination.droppableId === "inBox") {
                newInBoxItems.splice(destination.index, 0, movedItem);
            } else {
                newOutBoxItems.splice(destination.index, 0, movedItem);
            }
        }

        setInBoxItems(newInBoxItems);
        setOutBoxItems(newOutBoxItems);

        setIsCorrect(newInBoxItems.length === targetInBox);
    };

    // Render SVG shape, colored if the solution is correct
    const renderShapeSVG = (colored: boolean): string => {
        const baseSVG = shapes[shape].uncolored;
        const svg = colored ? getColoredSVG(baseSVG, shape) : baseSVG;
        return getSizedSVG(svg, shapeSize);
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                {question}
            </h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-6 sm:space-y-0 justify-center">
                    {/* IN-BOX */}
                    <Droppable droppableId="inBox">
                        {(provided) => (
                            <div
                                className="w-full sm:w-64 bg-blue-100 rounded-lg p-4 flex flex-wrap justify-center items-center border-2 border-blue-300 shadow-md min-h-[150px]"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {inBoxItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                // Critical: include the draggableProps.style
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    width: `${shapeSize}px`,
                                                    height: `${shapeSize}px`,
                                                    margin: "0.5rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <div
                                                    className="w-full h-full"
                                                    dangerouslySetInnerHTML={{
                                                        __html: renderShapeSVG(isCorrect),
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
                    {/* OUT-BOX */}
                    <Droppable droppableId="outBox">
                        {(provided) => (
                            <div
                                className="w-full sm:w-64 bg-gray-200 rounded-lg p-4 flex flex-wrap justify-center items-center border-2 border-gray-300 shadow-md min-h-[150px]"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {outBoxItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                // Same fix here
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    width: `${shapeSize}px`,
                                                    height: `${shapeSize}px`,
                                                    margin: "0.5rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <div
                                                    className="w-full h-full"
                                                    dangerouslySetInnerHTML={{
                                                        __html: renderShapeSVG(false),
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
                </div>
            </DragDropContext>
            {isCorrect && (
                <div className="mt-6 text-center">
                    <button className="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-200">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default BoxGame;
