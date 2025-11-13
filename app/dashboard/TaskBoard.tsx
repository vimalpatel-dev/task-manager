"use client";

import { useState } from "react";
import {
  Card,
  Typography,
  Stack,
  Button,
  IconButton,
  Chip,
  Paper,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TaskBoard({
  tasks,
  loadingTasks,
  selectedProject,
  openAddTask,
  openEditTask,
  handleDeleteTask,
}: {
  tasks: any[];
  loadingTasks: boolean;
  selectedProject: string | null;
  openAddTask: () => void;
  openEditTask: (task: any) => void;
  handleDeleteTask: (id: string) => Promise<void>;
}) {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setDeleteDialog(true);
  };

  const performDelete = async () => {
    if (!selectedId) return;
    try {
      setDeleting(true);
      await handleDeleteTask(selectedId);
      setDeleteDialog(false);
    } finally {
      setDeleting(false);
      setSelectedId(null);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          {selectedProject ? "Tasks" : "Select a Project"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddTask}
          disabled={!selectedProject}
        >
          Add Task
        </Button>
      </Stack>

      {!selectedProject ? (
        <Typography>Select a project to view its tasks.</Typography>
      ) : loadingTasks ? (
        <Box textAlign="center" py={3}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography>No tasks for this project.</Typography>
      ) : (
        <Box display="grid" gap={2}>
          {tasks.map((t) => (
            <Paper
              key={t.id}
              className="p-3 flex items-center justify-between"
              elevation={1}
            >
              <div>
                <Typography fontWeight={600}>{t.title}</Typography>
                <div className="flex gap-2 items-center mt-1">
                  <Chip
                    label={t.status}
                    color={
                      t.status === "Done"
                        ? "success"
                        : t.status === "In Progress"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                  {t.dueDate && (
                    <Chip
                      label={`Due ${t.dueDate}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </div>
              </div>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => openEditTask(t)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => confirmDelete(t.id)}
                  disabled={deleting}
                >
                  {deleting && selectedId === t.id ? (
                    <CircularProgress size={20} color="error" />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={performDelete}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={18} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
