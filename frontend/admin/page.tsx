"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "../lib/auth";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    if (!isAdmin()) {
      router.replace("/");
      return;
    }
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Admin Area</h1>
        <p>Redirecting to the admin dashboard…</p>
      </div>
    </main>
  );
}
