import { Chip } from "@mui/material";
import type { TaskStatus } from "../../types";

const statusMap: Record<
  TaskStatus,
  {
    label: string;
    bg: string;
    color: string;
    border: string;
  }
> = {
  todo: {
    label: "To Do",
    bg: "#EEF2FF",
    color: "#4338CA",
    border: "#C7D2FE",
  },
  in_progress: {
    label: "In Progress",
    bg: "#FFF7ED",
    color: "#C2410C",
    border: "#FED7AA",
  },
  done: {
    label: "Done",
    bg: "#ECFDF3",
    color: "#166534",
    border: "#BBF7D0",
  },
};

export default function TaskStatusChip({ status }: { status: TaskStatus }) {
  const config = statusMap[status];

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
