import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CardActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import type { Project } from "../../types";
import ConfirmDialog from "../common/ConfirmDialog";

interface Props {
  project: Project;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (project: Project) => void;
}

export default function ProjectCard({ project, onDelete, onEdit }: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(project.id);
      setOpenConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {project.name}
            </Typography>

            <Typography color="text.secondary">
              {project.description || "No description provided"}
            </Typography>

            <Button
              component={RouterLink}
              to={`/projects/${project.id}`}
              variant="contained"
            >
              Open Project
            </Button>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button
            startIcon={<Edit />}
            onClick={() => onEdit?.(project)}
            variant="outlined"
            size="small"
          >
            Edit
          </Button>

          <Tooltip title="Delete project">
            <IconButton color="error" onClick={() => setOpenConfirm(true)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <ConfirmDialog
        open={openConfirm}
        title="Delete project"
        message={`Are you sure you want to delete "${project.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
        confirmText={deleting ? "Deleting..." : "Delete"}
        loading={deleting}
      />
    </>
  );
}
