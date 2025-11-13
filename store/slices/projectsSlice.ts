import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Project {
  id: string;
  name: string;
  description?: string;
}
interface ProjectsState {
  items: Project[];
  status: "idle" | "loading" | "failed";
}

const initialState: ProjectsState = {
  items: [],
  status: "idle",
};

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (token?: string) => {
    const config: any = {};
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get("/api/projects", config);
    return (res.data?.data?.projects ?? []) as Project[];
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (
    payload: { name: string; description?: string; token?: string },
  ) => {
    const config: any = {};
    if (payload.token) config.headers = { Authorization: `Bearer ${payload.token}` };
    const res = await axios.post(
      "/api/projects",
      { name: payload.name, description: payload.description },
      config
    );
    return res.data?.data?.project as Project;
  }
);

const slice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.items = a.payload ?? [];
        s.status = "idle";
      })
      .addCase(fetchProjects.rejected, (s) => {
        s.status = "failed";
      })
      .addCase(createProject.fulfilled, (s, a) => {
        if (a.payload) s.items.push(a.payload);
      });
  },
});

export default slice.reducer;
