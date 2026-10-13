
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton({
  className = "rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700",
  label = "Logout",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {label}
    </button>
  );
}
