"use client";

import { Dialog, DialogTitle, DialogContent, Stack, TextField, DialogActions, Button, CircularProgress } from "@mui/material";

export default function ProjectModal({ open, setOpen, projectForm, setProjectForm, handleSaveProject, projectLoading }: any) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Project Name" fullWidth value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
          <TextField label="Description" fullWidth value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveProject} disabled={projectLoading}>{projectLoading ? <CircularProgress size={18} /> : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
