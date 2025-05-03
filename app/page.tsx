// Docs: https://docs.dndkit.com/presets/sortable

"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import WidgetQuickAccess from "@/components/widget-quick-access";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [items, setItems] = useState([1, 2, 3]);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="max-w-[1320px] mx-auto px-2 sm:px-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div
            className={
              activeId === 1
                ? "flex flex-col gap-12 sm:gap-18 -rotate-1 opacity-40"
                : "flex flex-col gap-12 sm:gap-18"
            }
          >
            <div>
              <WidgetQuickAccess key={1} id={1} />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}
