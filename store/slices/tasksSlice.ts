import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Task {
  id: string;
  projectId: string;
  title: string;
  status: string;
  dueDate?: string | null;
}

interface TasksState {
  items: Task[];
  status: "idle" | "loading" | "failed";
}

const initialState: TasksState = {
  items: [],
  status: "idle",
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async ({ projectId, token }: { projectId: string; token?: string }) => {
    const config: any = {};
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get(`/api/tasks?projectId=${projectId}`, config);
    return (res.data?.data?.tasks ?? []) as Task[];
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (
    { projectId, title, token,status, dueDate }: { projectId: string; title: string; token?: string, status?: string; dueDate?: string | null }
  ) => {
    const config: any = {};
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    const res = await axios.post(
      "/api/tasks",
      { projectId, title, status, dueDate },
      config
    );
    return res.data?.data?.task as Task;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, updates, token }: { id: string; updates: Partial<Task>; token?: string }) => {
    const config: any = {};
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    await axios.put("/api/tasks", { id, updates }, config);
    return { id, updates } as { id: string; updates: Partial<Task> };
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async ({ id, token }: { id: string; token?: string }) => {
    const config: any = {};
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`/api/tasks?id=${id}`, config);
    return id;
  }
);

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (s, a) => {
        s.items = a.payload;
        s.status = "idle";
      })
      .addCase(fetchTasks.rejected, (s) => {
        s.status = "failed";
      })
      .addCase(createTask.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateTask.fulfilled, (s, a) => {
        const idx = s.items.findIndex((it) => it.id === a.payload.id);
        if (idx !== -1) {
          s.items[idx] = { ...s.items[idx], ...(a.payload.updates as Partial<Task>) };
        }
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.items = s.items.filter((it) => it.id !== a.payload);
      });
  },
});

export default slice.reducer;
