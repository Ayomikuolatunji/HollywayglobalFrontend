"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "./ui/Arrow";
import { getCustomerApiBaseUrl } from "./config/customerApi";

export default function CustomerAccountLink() {
  const [state, setState] = useState<"checking" | "authenticated" | "unauthenticated">("checking");

  useEffect(() => {
    let active = true;
    fetch(`${getCustomerApiBaseUrl()}/dashboard`, { credentials: "include" })
      .then((response) => { if (active) setState(response.ok ? "authenticated" : "unauthenticated"); })
      .catch(() => { if (active) setState("unauthenticated"); });
    return () => { active = false; };
  }, []);

  const authenticated = state === "authenticated";
  const label = authenticated ? "Dashboard" : state === "checking" ? "Account" : "Log in";
  return <Link href={authenticated ? "/dashboard" : "/login"} aria-label={authenticated ? "Open your dashboard" : "Log in to your Hollyway account"} aria-busy={state === "checking"} className="inline-flex items-center gap-2 rounded-lg bg-[#061936] px-3 py-3 text-[10px] font-extrabold text-white shadow-lg shadow-[#061936]/15 hover:bg-[#1453bb]">{label} <Arrow /></Link>;
}
