import { useState, useContext } from "react";
import { Button, Grid } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import AppLoader from "../components/common/AppLoader";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectFormDialog from "../components/projects/ProjectFormDialog";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import { projectService } from "../services/projectService";
import { SnackbarContext } from "../context/SnackbarContext";

export default function ProjectsPage() {
  // ✅ Fix 1: Destructure deleteProject also
  const {
    projects,
    loading,
    error,
    refetch,
    deleteProject, // Add this!
  } = useProjects();

  const { user } = useAuth();
  const snackbar = useContext(SnackbarContext);
  const [open, setOpen] = useState(false);

  if (!snackbar) throw new Error("SnackbarContext missing");

  const handleCreateProject = async (values: {
    name: string;
    description: string;
  }) => {
    if (!user) return;

    try {
      await projectService.createProject({
        name: values.name,
        description: values.description,
        owner_id: user.id,
      });

      snackbar.showMessage("Project created successfully", "success");
      refetch();
    } catch (err) {
      snackbar.showMessage("Failed to create project", "error");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Projects"
        subtitle="View and manage all accessible projects"
        action={
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Project
          </Button>
        }
      />

      {loading && <AppLoader message="Loading projects..." />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && projects.length === 0 && (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start tracking work."
          actionLabel="Create Project"
          onAction={() => setOpen(true)}
        />
      )}
      {!loading && !error && projects.length > 0 && (
        <Grid container spacing={3}>
          {projects.map((project) => (
            // ✅ Fix 2: size prop instead of xs
            <Grid
              key={project.id}
              size={{ xs: 12, sm: 6, md: 4 }} // MUI v5+ syntax
            >
              {/* ✅ Pass deleteProject to child */}
              <ProjectCard
                project={project}
                onDelete={deleteProject} // Now defined!
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateProject}
      />
    </DashboardLayout>
  );
}
