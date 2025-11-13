"use client";

import { Card, Stack, Typography, Button, TextField, Box, Paper, Chip } from "@mui/material";

export default function ProjectSidebar({ projects, loadingProjects, selectedProject, setSelectedProject, openAddProject }: any) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          Projects
        </Typography>
        <Button variant="contained" size="small" onClick={openAddProject}>
          New
        </Button>
      </Stack>

      <Stack spacing={2}>
        {loadingProjects ? (
          <Box className="flex items-center justify-center py-6">Loading...</Box>
        ) : projects.length === 0 ? (
          <Box className="text-center py-6">No projects</Box>
        ) : (
          projects.map((p: any) => (
            <Paper key={p.id} elevation={1} sx={{ p: 2, cursor: "pointer", border: selectedProject === p.id ? "2px solid #c7d2fe" : "none" }} onClick={() => setSelectedProject(p.id)}>
              <Stack direction="row" justifyContent="space-between" alignItems="start">
                <Box>
                  <Typography fontWeight={700}>{p.name}</Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>{p.description || "—"}</Typography>
                </Box>
                <Box>
                  <Chip label={`view tasks`} size="small" />
                </Box>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Card>
  );
}
