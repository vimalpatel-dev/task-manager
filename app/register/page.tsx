"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  CircularProgress,
  LinearProgress,
  Alert,
  Link,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const { status, error } = useAppSelector((s) => s.auth);
  const isLoading = status === "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(form)).unwrap();
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error("Error creating account, please enter correct details");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <Card
        className="relative overflow-hidden w-full max-w-md shadow-xl"
        sx={{
          borderRadius: 3,
          p: 3,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        {isLoading && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          />
        )}

        <Box className="p-4 flex flex-col gap-5">
          <div className="text-center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "#1e293b",
                mb: 1,
              }}
            >
              Create your account
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 400 }}
            >
              Sign up to start managing your projects
            </Typography>
          </div>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              size="medium"
              required
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              disabled={isLoading}
              autoComplete="name"
            />

            <TextField
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              size="medium"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isLoading}
              autoComplete="email"
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              size="medium"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={isLoading}
              autoComplete="new-password"
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isLoading}
              sx={{
                py: 1.3,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "0.6rem",
                textTransform: "none",
                background: "linear-gradient(90deg,#2563eb,#4f46e5)",
              }}
              startIcon={
                isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {isLoading ? "Creating..." : "Register"}
            </Button>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "#6b7280", mt: 2 }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{
                fontWeight: 600,
                color: "#2563eb",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Card>
    </div>
  );
}
