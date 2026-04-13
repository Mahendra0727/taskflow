import { MenuItem, Stack, TextField } from "@mui/material";

interface Props {
  status: string;
  assignee: string;
  onStatusChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
}

export default function TaskFilters({
  status,
  assignee,
  onStatusChange,
  onAssigneeChange,
}: Props) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
      <TextField
        select
        label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        fullWidth
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="todo">To Do</MenuItem>
        <MenuItem value="in_progress">In Progress</MenuItem>
        <MenuItem value="done">Done</MenuItem>
      </TextField>

      <TextField
        label="Filter by assignee"
        value={assignee}
        onChange={(e) => onAssigneeChange(e.target.value)}
        fullWidth
      />
    </Stack>
  );
}
