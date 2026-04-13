import { useEffect, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import type { Task, TaskStatus } from "../../types";
import TaskColumn from "./TaskColumn";

interface Props {
  tasks: Task[];
  assigneeMap: Record<string, string>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
}

type ColumnsState = Record<TaskStatus, Task[]>;

const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

const groupTasks = (items: Task[]): ColumnsState => ({
  todo: items.filter((task) => task.status === "todo"),
  in_progress: items.filter((task) => task.status === "in_progress"),
  done: items.filter((task) => task.status === "done"),
});

export default function TaskBoard({
  tasks,
  assigneeMap,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const [columns, setColumns] = useState<ColumnsState>(groupTasks(tasks));
  const activeTaskIdRef = useRef<string | null>(null);
  const originalStatusRef = useRef<TaskStatus | null>(null);

  useEffect(() => {
    setColumns(groupTasks(tasks));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const findContainer = (
    id: string,
    currentColumns: ColumnsState = columns,
  ): TaskStatus | null => {
    if (STATUSES.includes(id as TaskStatus)) {
      return id as TaskStatus;
    }

    for (const status of STATUSES) {
      if (
        currentColumns[status].some((task) => String(task.id) === String(id))
      ) {
        return status;
      }
    }

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    activeTaskIdRef.current = activeId;

    const originalTask = tasks.find((task) => String(task.id) === activeId);
    originalStatusRef.current = originalTask?.status ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setColumns((prev) => {
      const activeContainer = findContainer(activeId, prev);
      const overContainer = findContainer(overId, prev);

      if (!activeContainer || !overContainer) return prev;
      if (activeContainer === overContainer) return prev;

      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex(
        (item) => String(item.id) === activeId,
      );
      const overIndex = overItems.findIndex(
        (item) => String(item.id) === overId,
      );

      if (activeIndex === -1) return prev;

      const movedItem = {
        ...activeItems[activeIndex],
        status: overContainer,
      };

      return {
        ...prev,
        [activeContainer]: activeItems.filter(
          (item) => String(item.id) !== activeId,
        ),
        [overContainer]:
          overIndex >= 0
            ? [
                ...overItems.slice(0, overIndex),
                movedItem,
                ...overItems.slice(overIndex),
              ]
            : [...overItems, movedItem],
      };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    const activeId = String(active.id);
    const originalStatus = originalStatusRef.current;

    if (!over) {
      activeTaskIdRef.current = null;
      originalStatusRef.current = null;
      return;
    }

    const overId = String(over.id);
    const finalStatus = findContainer(overId) ?? findContainer(activeId);

    if (!finalStatus || !originalStatus) {
      activeTaskIdRef.current = null;
      originalStatusRef.current = null;
      return;
    }

    if (originalStatus === finalStatus) {
      const items = columns[finalStatus];
      const oldIndex = items.findIndex((item) => String(item.id) === activeId);
      const newIndex = items.findIndex((item) => String(item.id) === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setColumns((prev) => ({
          ...prev,
          [finalStatus]: arrayMove(prev[finalStatus], oldIndex, newIndex),
        }));
      }

      activeTaskIdRef.current = null;
      originalStatusRef.current = null;
      return;
    }

    try {
      await onStatusChange(activeId, finalStatus);
    } finally {
      activeTaskIdRef.current = null;
      originalStatusRef.current = null;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <TaskColumn
          title="To Do"
          status="todo"
          tasks={columns.todo}
          assigneeMap={assigneeMap}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <TaskColumn
          title="In Progress"
          status="in_progress"
          tasks={columns.in_progress}
          assigneeMap={assigneeMap}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <TaskColumn
          title="Done"
          status="done"
          tasks={columns.done}
          assigneeMap={assigneeMap}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Box>
    </DndContext>
  );
}
