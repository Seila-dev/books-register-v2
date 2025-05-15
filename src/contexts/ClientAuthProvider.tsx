"use client";

import { AuthProvider } from "./AuthContext";

export default function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}