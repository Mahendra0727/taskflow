import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import AppLoader from "../components/common/AppLoader";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TaskBoard from "../components/tasks/TaskBoard";
import TaskFormDialog from "../components/tasks/TaskFormDialog";
import { SnackbarContext } from "../context/SnackbarContext";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import { userService, type AppUser } from "../services/userService";
import type { Task, TaskStatus } from "../types";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();
  const { user } = useAuth();
  const snackbar = useContext(SnackbarContext);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  } = useTasks(id);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!snackbar) {
    throw new Error("SnackbarContext missing");
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError("");
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        setUsersError(
          err instanceof Error ? err.message : "Failed to load users",
        );
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (!id) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Project id is missing from URL."
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  const project = projects.find((p) => String(p.id) === String(id));

  const assigneeMap = useMemo(() => {
    return users.reduce<Record<string, string>>((acc, current) => {
      acc[current.id] = current.name;
      return acc;
    }, {});
  }, [users]);

  const handleCreateTask = async (values: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: "low" | "medium" | "high";
    due_date: string;
    assignee_id: string;
  }) => {
    if (!user) return;

    setSubmitting(true);
    try {
      await createTask({
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        projectId: id,
        assignee_id: values.assignee_id || null,
        due_date: values.due_date || undefined,
      });

      snackbar.showMessage("Task created successfully", "success");
      setTaskDialogOpen(false);
    } catch {
      snackbar.showMessage("Failed to create task", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (values: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: "low" | "medium" | "high";
    due_date: string;
    assignee_id: string;
  }) => {
    if (!editingTask) return;

    setSubmitting(true);
    try {
      await updateTask(editingTask.id, {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        assignee_id: values.assignee_id || null,
        due_date: values.due_date || undefined,
      });

      snackbar.showMessage("Task updated successfully", "success");
      setTaskDialogOpen(false);
      setEditingTask(null);
    } catch {
      snackbar.showMessage("Failed to update task", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    setSubmitting(true);
    try {
      await deleteTask(taskToDelete.id);
      snackbar.showMessage("Task deleted successfully", "success");
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch {
      snackbar.showMessage("Failed to delete task", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  if (projectsLoading || tasksLoading || usersLoading) {
    return (
      <DashboardLayout>
        <AppLoader message="Loading project board..." />
      </DashboardLayout>
    );
  }

  if (projectsError) {
    return (
      <DashboardLayout>
        <ErrorState message={projectsError} onRetry={refetchProjects} />
      </DashboardLayout>
    );
  }

  if (tasksError) {
    return (
      <DashboardLayout>
        <ErrorState
          message={tasksError}
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  if (usersError) {
    return (
      <DashboardLayout>
        <ErrorState
          message={usersError}
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <EmptyState
          title="Project not found"
          description="This project does not exist or could not be loaded."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <PageHeader
          title={project.name}
          subtitle="Drag tasks between columns, edit details, and manage assignees"
          action={
            <Button
              variant="contained"
              onClick={() => {
                setEditingTask(null);
                setTaskDialogOpen(true);
              }}
            >
              New Task
            </Button>
          }
        />

        <Typography variant="body2" color="text.secondary">
          {project.description || "No description provided"}
        </Typography>

        {!tasks.length ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to start managing work."
            actionLabel="Create Task"
            onAction={() => {
              setEditingTask(null);
              setTaskDialogOpen(true);
            }}
          />
        ) : (
          <TaskBoard
            tasks={tasks}
            assigneeMap={assigneeMap}
            onStatusChange={async (taskId, status) => {
              await updateTaskStatus(taskId, status);
            }}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </Stack>

      <TaskFormDialog
        open={taskDialogOpen}
        onClose={() => {
          setTaskDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialTask={editingTask}
        users={users}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title || ""}"?`}
        onConfirm={handleDeleteTask}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        confirmText="Delete"
        loading={submitting}
      />
    </DashboardLayout>
  );
}
