import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Points to the Express server where Better Auth is mounted at /api/auth/*
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "http://localhost:5000",
});
