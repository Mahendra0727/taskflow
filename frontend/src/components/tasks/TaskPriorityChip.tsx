import { Chip } from "@mui/material";
import type { TaskPriority } from "../../types";

const priorityMap: Record<
  TaskPriority,
  {
    label: string;
    bg: string;
    color: string;
    border: string;
  }
> = {
  low: {
    label: "Low",
    bg: "#F0FDF4",
    color: "#166534",
    border: "#BBF7D0",
  },
  medium: {
    label: "Medium",
    bg: "#FEFCE8",
    color: "#A16207",
    border: "#FDE68A",
  },
  high: {
    label: "High",
    bg: "#FEF2F2",
    color: "#B91C1C",
    border: "#FECACA",
  },
};

export default function TaskPriorityChip({
  priority,
}: {
  priority: TaskPriority;
}) {
  const config = priorityMap[priority];

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: 28,
        borderRadius: "999px",
        bgcolor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: "0.01em",
        "& .MuiChip-label": {
          px: 1.25,
          py: 0,
        },
      }}
    />
  );
}
