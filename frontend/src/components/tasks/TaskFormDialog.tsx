import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Task, TaskPriority, TaskStatus } from "../../types";

type AppUser = {
  id: string;
  name: string;
  email: string;
};

type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  assignee_id: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialTask?: Task | null;
  users: AppUser[];
}

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  due_date: "",
  assignee_id: "",
};

export default function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  initialTask,
  users,
}: Props) {
  const [values, setValues] = useState<TaskFormValues>(defaultValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setValues({
        title: initialTask.title,
        description: initialTask.description || "",
        status: initialTask.status,
        priority: initialTask.priority,
        due_date: initialTask.due_date || "",
        assignee_id: initialTask.assignee_id || "",
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialTask, open]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialTask ? "Edit Task" : "Create Task"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={values.title}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, title: e.target.value }))
            }
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            select
            label="Status"
            value={values.status}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                status: e.target.value as TaskStatus,
              }))
            }
            fullWidth
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>

          <TextField
            select
            label="Priority"
            value={values.priority}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                priority: e.target.value as TaskPriority,
              }))
            }
            fullWidth
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>

          <TextField
            select
            label="Assignee"
            value={values.assignee_id}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, assignee_id: e.target.value }))
            }
            fullWidth
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>

          <Stack spacing={0.75}>
            <Typography variant="body2" color="text.secondary">
              Due Date
            </Typography>
            <TextField
              type="date"
              value={values.due_date}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, due_date: e.target.value }))
              }
              fullWidth
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !values.title.trim()}
        >
          {submitting ? "Saving..." : initialTask ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
