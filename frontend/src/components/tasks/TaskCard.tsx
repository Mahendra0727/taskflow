import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete, Edit, DragIndicator } from "@mui/icons-material";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { Task } from "../../types";
import TaskStatusChip from "./TaskStatusChip";
import TaskPriorityChip from "./TaskPriorityChip";

interface Props {
  task: Task;
  assigneeName?: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({
  task,
  assigneeName,
  onEdit,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        borderRadius: 4,
        boxShadow: isDragging ? 6 : 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                minWidth: 0,
                flex: 1,
              }}
            >
              <Box
                {...attributes}
                {...listeners}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "grab",
                  color: "text.secondary",
                  flexShrink: 0,
                }}
              >
                <DragIndicator fontSize="small" />
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {task.title}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", flexShrink: 0 }}
            >
              <Tooltip title="Edit task">
                <IconButton size="small" onClick={() => onEdit(task)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(task)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              minHeight: 20,
            }}
          >
            {task.description || "No description"}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", rowGap: 1 }}
          >
            <TaskStatusChip status={task.status} />
            <TaskPriorityChip priority={task.priority} />
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              pt: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              Due: {task.due_date || "No due date"}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 12,
                  bgcolor: "#E0E7FF",
                  color: "#3730A3",
                  fontWeight: 700,
                }}
              >
                {assigneeName ? assigneeName.charAt(0).toUpperCase() : "?"}
              </Avatar>

              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                  maxWidth: 100,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {assigneeName || "Unassigned"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
