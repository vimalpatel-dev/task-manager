"use client";

import { Dialog, DialogTitle, DialogContent, Stack, TextField, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";

export default function TaskModal({ open, setOpen, taskForm, setTaskForm, handleSaveTask, taskLoading }: any) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>{taskForm.id ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Title" fullWidth value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={taskForm.status} label="Status" onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Due date" type="date" InputLabelProps={{ shrink: true }} value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveTask} disabled={taskLoading}>{taskLoading ? <CircularProgress size={18} /> : taskForm.id ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
