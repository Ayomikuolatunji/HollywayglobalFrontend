"use client";

import { useEffect, useState } from "react";
import { kycStorageKey, type KycStatus } from "../data/kyc";
import DashboardSummaryCard from "./DashboardSummaryCard";

export default function KycStatusSummary() {
  const [status, setStatus] = useState<KycStatus>("not-started");

  useEffect(() => {
    const saved = window.localStorage.getItem(kycStorageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { status?: KycStatus };
      if (parsed.status === "draft" || parsed.status === "submitted") setStatus(parsed.status);
    } catch {
      window.localStorage.removeItem(kycStorageKey);
    }
  }, []);

  const submitted = status === "submitted";
  const inProgress = status === "draft";
  const title = submitted ? "KYC saved for review" : inProgress ? "KYC draft in progress" : "Not started";
  const action = submitted ? "Review verification" : inProgress ? "Continue verification" : "Start verification";

  return <DashboardSummaryCard label="KYC STATUS" value={title} note={action} icon="shield" href="/dashboard/profile/kyc" tone={submitted ? "green" : "blue"} />;
}
