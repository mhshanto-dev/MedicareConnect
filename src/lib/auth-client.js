import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Points to the Express server where Better Auth is mounted at /api/auth/*
  // In the browser we use a relative URL so Next.js proxy forwards to localhost:5000.
  baseURL: typeof window !== 'undefined'
    ? ''   // relative — Next.js rewrite handles /api/auth/* → localhost:5000/api/auth/*
    : (process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
        : 'http://localhost:5000'),
});
