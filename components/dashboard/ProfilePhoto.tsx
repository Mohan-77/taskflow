"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AvatarResponse = {
  success?: boolean;
  message?: string;
  image?: string;
};

export default function ProfilePhoto({
  name,
  email,
  image,
  onNotice,
}: {
  name: string;
  email: string;
  image: string | null;
  onNotice: (message: string, tone: "success" | "error") => void;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const initial = (name.trim()[0] || "T").toUpperCase();

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || uploading) {
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.set("image", file);
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: form,
      });

      let data: AvatarResponse | null = null;

      try {
        data = (await response.json()) as AvatarResponse;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !data?.image) {
        onNotice(data?.message || "Could not upload the photo.", "error");
        return;
      }

      const update = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: data.image }),
      });

      if (update.status === 401) {
        router.replace("/login");
        return;
      }

      if (!update.ok) {
        onNotice("Could not update your profile photo.", "error");
        return;
      }

      onNotice("Profile photo updated.", "success");
      router.refresh();
    } catch {
      onNotice("Could not upload the photo. Check your connection and try again.", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label className="relative shrink-0 cursor-pointer">
        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-semibold text-violet-800">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          onChange={onFile}
          disabled={uploading}
          aria-label={`Upload a profile photo for ${name}`}
        />
      </label>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{name}</p>
        <p className="truncate text-xs text-slate-500">{email}</p>
        <label className="mt-1 inline-flex cursor-pointer text-xs font-semibold text-violet-700 hover:text-violet-800">
          {uploading ? "Uploading..." : "Change photo"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={onFile}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
