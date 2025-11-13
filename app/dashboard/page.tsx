"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects, createProject } from "@/store/slices/projectsSlice";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/store/slices/tasksSlice";
import { setAuth, logout as clearAuth } from "@/store/slices/authSlice";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProjectSidebar from "./ProjectSidebar";
import TaskBoard from "./TaskBoard";
import ProjectModal from "./ProjectModal";
import TaskModal from "./TaskModal";

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token } = useAppSelector((s) => s.auth);
  const projects = useAppSelector((s) => s.projects.items);
  const tasks = useAppSelector((s) => s.tasks.items);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskForm, setTaskForm] = useState({ id: "", title: "", status: "Todo", dueDate: "" });

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("token");
    if (stored && !token) dispatch(setAuth({ token: stored }));
    else if (!stored) router.push("/login");
  }, []);

  useEffect(() => {
    const load = async () => {
      if(!token) return;
      try {
        setLoadingProjects(true);
        const t = token ?? localStorage.getItem("token");
        await dispatch(fetchProjects(t ?? undefined)).unwrap();
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch projects");
      } finally {
        setLoadingProjects(false);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (!selectedProject || !token) return;
    const load = async () => {
      try {
        setLoadingTasks(true);
        const t = token ?? localStorage.getItem("token");
        await dispatch(fetchTasks({ projectId: selectedProject, token: t ?? undefined })).unwrap();
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch tasks");
      } finally {
        setLoadingTasks(false);
      }
    };
    load();
  }, [selectedProject, token]);

  const openAddProject = () => {
    setProjectForm({ name: "", description: "" });
    setOpenProjectModal(true);
  };

  const handleSaveProject = async () => {
    if (!projectForm.name.trim() || !token) return toast.error("Project name required");
    try {
      setProjectLoading(true);
      const t = token ?? localStorage.getItem("token");
      await dispatch(createProject({ name: projectForm.name, description: projectForm.description, token: t ?? undefined })).unwrap();
      await dispatch(fetchProjects(t ?? undefined)).unwrap();
      setOpenProjectModal(false);
      setProjectForm({ name: "", description: "" });
      toast.success("Project created");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create project");
    } finally {
      setProjectLoading(false);
    }
  };

  const openAddTask = () => {
    if (!selectedProject) return toast.error("Select a project first");
    setTaskForm({ id: "", title: "", status: "Todo", dueDate: "" });
    setOpenTaskModal(true);
  };

  const openEditTask = (t: any) => {
    setTaskForm({ id: t.id, title: t.title, status: t.status, dueDate: t.dueDate || "" });
    setOpenTaskModal(true);
  };

  const handleSaveTask = async () => {
    if (!taskForm.title.trim()) return toast.error("Task title required");
    try {
      setTaskLoading(true);
      const t = token ?? localStorage.getItem("token");
      if (taskForm.id) {
        await dispatch(updateTask({ id: taskForm.id, updates: { title: taskForm.title, status: taskForm.status, dueDate: taskForm.dueDate || null }, token: t ?? undefined })).unwrap();
        toast.success("Task updated");
      } else {
        await dispatch(createTask({ projectId: selectedProject!, title: taskForm.title, status: taskForm.status, dueDate: taskForm.dueDate || null, token: t ?? undefined })).unwrap();
        toast.success("Task created");
      }
      await dispatch(fetchTasks({ projectId: selectedProject!, token: t ?? undefined })).unwrap();
      setOpenTaskModal(false);
      setTaskForm({ id: "", title: "", status: "Todo", dueDate: "" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to save task");
    } finally {
      setTaskLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      setTaskLoading(true);
      const t = token ?? localStorage.getItem("token");
      await dispatch(deleteTask({ id, token: t ?? undefined })).unwrap();
      await dispatch(fetchTasks({ projectId: selectedProject!, token: t ?? undefined })).unwrap();
      toast.success("Task deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete task");
    } finally {
      setTaskLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearAuth());
    router.push("/login");
    toast.success("Logged out");
  };

  return (
    <Box className="min-h-screen p-4 md:p-6" sx={{ background: "linear-gradient(to bottom right,#eef2ff,#f8fafc)" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={700}>
          Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
        <Box sx={{ width: { xs: "100%", lg: "360px" } }}>
          <ProjectSidebar
            projects={projects}
            loadingProjects={loadingProjects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            openAddProject={openAddProject}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <TaskBoard
            tasks={tasks}
            loadingTasks={loadingTasks}
            selectedProject={selectedProject}
            openAddTask={openAddTask}
            openEditTask={openEditTask}
            handleDeleteTask={handleDeleteTask}
          />
        </Box>
      </Stack>

      <ProjectModal open={openProjectModal} setOpen={setOpenProjectModal} projectForm={projectForm} setProjectForm={setProjectForm} handleSaveProject={handleSaveProject} projectLoading={projectLoading} />
      <TaskModal open={openTaskModal} setOpen={setOpenTaskModal} taskForm={taskForm} setTaskForm={setTaskForm} handleSaveTask={handleSaveTask} taskLoading={taskLoading} />
    </Box>
  );
}
