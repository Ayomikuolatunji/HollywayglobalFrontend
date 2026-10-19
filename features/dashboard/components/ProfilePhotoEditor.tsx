"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  accountProfileUpdatedEvent,
  saveProfilePhoto,
} from "../data/accountApi";

const MAX_PROFILE_PICTURE_SIZE = 5_000_000;
const ALLOWED_PROFILE_PICTURE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function initialFor(name: string) {
  return name.trim().charAt(0).toUpperCase() || "H";
}

export default function ProfilePhotoEditor({
  accountName,
  accountPhotoUrl,
}: {
  accountName: string;
  accountPhotoUrl: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(accountPhotoUrl);
  const [imageFailed, setImageFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const previewObjectUrl = useRef("");

  useEffect(() => {
    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
      previewObjectUrl.current = "";
    }
    setPreviewUrl(accountPhotoUrl);
    setImageFailed(false);
  }, [accountPhotoUrl]);

  useEffect(() => {
    return () => {
      if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    };
  }, []);

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] || null;
    event.target.value = "";
    if (!nextFile) return;
    if (!ALLOWED_PROFILE_PICTURE_TYPES.includes(nextFile.type)) {
      setError("Choose a JPG, PNG or WEBP image.");
      return;
    }
    if (nextFile.size > MAX_PROFILE_PICTURE_SIZE) {
      setError("Profile picture must be 5 MB or smaller.");
      return;
    }
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = URL.createObjectURL(nextFile);
    setPreviewUrl(previewObjectUrl.current);
    setImageFailed(false);
    setFile(nextFile);
    setError("");
    setMessage("");
  }

  async function savePhoto() {
    if (!file) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await saveProfilePhoto(file);
      setFile(null);
      setMessage("Profile picture updated.");
      window.dispatchEvent(new Event(accountProfileUpdatedEvent));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Profile picture could not be updated.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 border-b border-[#eef1f4] pb-4 dark:border-[#2a374e] sm:flex-row sm:items-center">
      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1453bb] text-base font-extrabold text-white dark:bg-[#dd6b12]">
        {previewUrl && !imageFailed ? (
          <img
            className="h-full w-full object-cover"
            src={previewUrl}
            alt="Your profile picture"
            onError={() => setImageFailed(true)}
          />
        ) : (
          initialFor(accountName)
        )}
      </span>
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-sm font-extrabold text-[#0b1830] dark:text-[#f4f7fb]">
          {accountName}
        </strong>
        <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#1453bb] dark:text-[#8bb8ff]">
          Profile picture
        </p>
        <p className="mt-1 text-[11px] leading-4 text-[#53627a] dark:text-[#b7c3d6]">
          Use your Google photo or upload another.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-[#1453bb] px-3 text-[10px] font-extrabold text-[#1453bb] hover:bg-[#f4f8ff] dark:border-[#8bb8ff] dark:text-[#8bb8ff] dark:hover:bg-[#202d44]">
            Choose picture
            <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} />
          </label>
          {file && (
            <button className="inline-flex h-8 items-center rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white hover:bg-[#0b3f91] disabled:opacity-50" type="button" onClick={() => void savePhoto()} disabled={saving}>
              {saving ? "Saving…" : "Save picture"}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-[10px] font-semibold text-[#a32929]" role="alert">{error}</p>}
        {message && <p className="mt-1 text-[10px] font-semibold text-[#168046]" role="status">{message}</p>}
      </div>
    </div>
  );
}
