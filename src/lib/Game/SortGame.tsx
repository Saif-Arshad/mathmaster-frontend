/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { shapes, shapeColors } from "./shape";

const getColoredSVG = (svg: string, shape: string) => {
  const fill = shapeColors[shape];
  const regex = /fill="gray"/g;
  return svg.replace(regex, `fill="${fill}"`);
};

type Item = { id: string; number: number };

type Props = {
  shape: keyof typeof shapes;
  totalItem: number;
  id: number;
  order: "asc" | "desc";
  isCorrect: boolean;
  setIsCorrect: (v: boolean) => void;
};

const Tile: React.FC<
  Item & { shape: keyof typeof shapes; isCorrect: boolean }
> = ({ id, number, shape, isCorrect }) => {
  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center"
    >
      <div
        className="pointer-events-none"
        dangerouslySetInnerHTML={{
          __html:
            getColoredSVG(shapes[shape].uncolored, shape)

        }}
      />
      <div className="h-7 w-7 p-1 mt-4 bg-mathpath-purple rounded-full flex items-center justify-center">
        <span className="font-bold text-white">{number}</span>
      </div>
    </div>
  );
};

export const SortGame: React.FC<Props> = ({
  shape = "guava",
  totalItem,
  order,
  id,
  isCorrect,
  setIsCorrect,
}) => {
  const make = (n: number): Item[] =>
    Array.from({ length: n }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .map((num, i) => ({ id: `num-${i}`, number: num }));

  const [items, setItems] = useState<Item[]>(() => make(totalItem));

  useEffect(() => {
    setItems(make(totalItem));
    setIsCorrect(false);
  }, [totalItem, id]);

  /* dnd‑kit sensors */
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    const sorted = reordered.every(
      (it, idx) =>
        idx === 0 ||
        (order === "asc"
          ? it.number >= reordered[idx - 1].number
          : it.number <= reordered[idx - 1].number)
    );
    setIsCorrect(sorted);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-5 gap-4 p-4">
            {items.map((it) => (
              <Tile
                key={it.id}
                {...it}
                shape={shape}
                isCorrect={isCorrect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
