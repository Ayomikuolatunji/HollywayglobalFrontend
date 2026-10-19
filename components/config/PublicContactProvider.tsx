"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { responsePayload } from "../api/apiResponse";
import { getCustomerApiBaseUrl } from "./customerApi";

export type PublicContactChannel = {
  key: string;
  icon: string;
  label: string;
  detail: string;
  url: string;
};

export type PublicContactConfiguration = {
  configured: boolean;
  contact_email: string | null;
  support_email: string | null;
  admin_phone: string | null;
  admin_phone_href: string | null;
  admin_whatsapp_url: string | null;
  sell_whatsapp_url: string | null;
  wanted_whatsapp_url: string | null;
  whatsapp_group_url: string | null;
  whatsapp_channel_url: string | null;
  social_channels: PublicContactChannel[];
};

type PublicContactState = {
  contact: PublicContactConfiguration | null;
  loading: boolean;
  error: string;
  reload: () => void;
};

const PublicContactContext = createContext<PublicContactState>({
  contact: null,
  loading: true,
  error: "",
  reload: () => undefined,
});

function parse(value: unknown): PublicContactConfiguration {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const channels = Array.isArray(source.social_channels)
    ? source.social_channels.filter((item): item is PublicContactChannel => {
        if (!item || typeof item !== "object") return false;
        const channel = item as Record<string, unknown>;
        return ["key", "icon", "label", "detail", "url"].every((key) => typeof channel[key] === "string");
      })
    : [];
  return {
    configured: source.configured === true,
    contact_email: typeof source.contact_email === "string" ? source.contact_email : null,
    support_email: typeof source.support_email === "string" ? source.support_email : null,
    admin_phone: typeof source.admin_phone === "string" ? source.admin_phone : null,
    admin_phone_href: typeof source.admin_phone_href === "string" ? source.admin_phone_href : null,
    admin_whatsapp_url: typeof source.admin_whatsapp_url === "string" ? source.admin_whatsapp_url : null,
    sell_whatsapp_url: typeof source.sell_whatsapp_url === "string" ? source.sell_whatsapp_url : null,
    wanted_whatsapp_url: typeof source.wanted_whatsapp_url === "string" ? source.wanted_whatsapp_url : null,
    whatsapp_group_url: typeof source.whatsapp_group_url === "string" ? source.whatsapp_group_url : null,
    whatsapp_channel_url: typeof source.whatsapp_channel_url === "string" ? source.whatsapp_channel_url : null,
    social_channels: channels,
  };
}

export function PublicContactProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<PublicContactConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`${getCustomerApiBaseUrl()}/api/v1/public/contact`, { headers: { Accept: "application/json" } })
      .then(responsePayload)
      .then((payload) => {
        if (active) setContact(parse(payload.data));
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Public contact details could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [reloadToken]);

  const value = useMemo(() => ({ contact, loading, error, reload: () => setReloadToken((token) => token + 1) }), [contact, loading, error]);
  return <PublicContactContext.Provider value={value}>{children}</PublicContactContext.Provider>;
}

export function usePublicContact() {
  return useContext(PublicContactContext);
}
