import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { Task, TaskStatus } from "../../types";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  assigneeMap: Record<string, string>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskColumn({
  title,
  status,
  tasks,
  assigneeMap,
  onEdit,
  onDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        minHeight: 420,
        borderRadius: 3,
        bgcolor: isOver ? "action.hover" : "grey.50",
        border: "1px solid",
        borderColor: isOver ? "primary.main" : "divider",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        {title} ({tasks.length})
      </Typography>

      <SortableContext
        items={tasks.map((task) => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={2}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assigneeName={
                task.assignee_id ? assigneeMap[task.assignee_id] : undefined
              }
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {tasks.length === 0 && (
            <Box
              sx={{
                minHeight: 120,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Drop task here
            </Box>
          )}
        </Stack>
      </SortableContext>
    </Paper>
  );
}
