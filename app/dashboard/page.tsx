"use client";

import { Dashboard } from "../components/Dashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  function handleNavigate(page: string, consultationId?: string) {
    if (page === 'video-call' && consultationId) {
      router.push(`/video-call?consultationId=${consultationId}`);
      return;
    }
    // fallback
    router.push('/dashboard');
  }

  return <Dashboard onNavigate={handleNavigate} />;
}
