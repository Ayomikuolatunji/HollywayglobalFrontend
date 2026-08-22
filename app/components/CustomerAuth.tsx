import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, Brand } from "./SiteHeader";

export const customerApiBaseUrl = (process.env.NEXT_PUBLIC_HOLLYWAY_API_BASE_URL || "https://staging-api.hollywayglobal.com").replace(/\/$/, "");

export function AuthShell({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return <main className="customerLoginPage"><header className="customerLoginHeader"><Brand /><Link href="/" className="customerLoginBack">Return to website <Arrow /></Link></header><section className="customerLoginBody"><div className="customerLoginIntro"><span className="sectionKicker">HOLLYWAY USER ACCOUNT</span><h1>Your marketplace,<br /><em>all in one place.</em></h1><p>Track listings, wanted requests, orders, deliveries, escrow, services, and account verification from your user dashboard.</p><div className="customerLoginPoints"><span>✓ One secure user account</span><span>✓ Track every Hollyway reference</span><span>✓ Get help from the Admin desk</span></div></div><div className="customerLoginCard"><span className="customerLoginCardMark">H</span><span className="sectionKicker">{kicker}</span><h2>{title}</h2><p>{description}</p>{children}</div></section></main>;
}

export function AuthField({ label, name, type = "text", autoComplete, required = true }: { label: string; name: string; type?: string; autoComplete?: string; required?: boolean }) {
  return <label className="customerAuthField"><span>{label}</span><input name={name} type={type} autoComplete={autoComplete} required={required} /></label>;
}

export function AuthError({ message }: { message: string }) {
  return message ? <p className="customerAuthMessage error" role="alert">{message}</p> : null;
}

export function AuthSuccess({ message }: { message: string }) {
  return message ? <p className="customerAuthMessage success" role="status">{message}</p> : null;
}

export function GoogleButton() {
  return <a className="customerGoogleButton" href={`${customerApiBaseUrl}/auth/google`}><span className="googleMark">G</span>Continue with Google</a>;
}
