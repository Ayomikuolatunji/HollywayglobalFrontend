"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "../../../components/api/apiFetch";
import { Arrow, SocialIcon } from "./HomeIcons";
import Dropdown from "../../../components/forms/Dropdown";
import {
  adminPhone,
  adminPhoneHref,
  adminWhatsApp,
  audienceRelayBaseUrl,
  audienceRelayTokens,
  channels,
  contactEmail,
  supportEmail,
  whatsappChannel,
} from "../data";

type Status = "idle" | "sending" | "sent" | "error";

function socialIconName(icon: string) {
  if (icon === "WA") return "whatsapp";
  if (icon === "IG") return "instagram";
  if (icon === "X") return "x";
  if (icon === "f") return "facebook";
  if (icon === "in") return "linkedin";
  if (icon === "tiktok") return "tiktok";
  return "group";
}

export function NewsletterSection() {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") || "");
    setStatus("sending");
    try {
      await submitForm("newsletter", { email, marketing_consent: true });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-[#e4e8f1] py-16">
      <div className="mx-auto grid w-[calc(100%-40px)] max-w-[1180px] items-center gap-8 lg:w-[calc(100%-64px)] lg:grid-cols-[1fr_.9fr]">
        <div>
          <span className="text-[10px] font-extrabold tracking-[.16em] text-[#6b45c7]">
            NEWS & INFORMATION
          </span>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
            Stay close to the <em className="not-italic text-[#ff8a00]">next opportunity.</em>
          </h2>
          <p className="mt-3 max-w-xl text-xs leading-6 text-[#667085]">
            Subscribe for Hollyway marketplace updates, new listings, buyer requests and practical
            buying or selling information.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-lg shadow-[#0a1d37]/5"
        >
          <label className="text-[10px] font-extrabold text-[#344054]" htmlFor="subscriberEmail">
            Email address
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="subscriberEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="min-w-0 flex-1 rounded-lg border border-[#dfe5ed] bg-[#fbfcfe] px-3 py-3 text-[11px] outline-none focus:border-[#4d86d8]"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#ff8a00] to-[#ffb01c] px-4 py-3 text-[10px] font-extrabold text-[#142039] disabled:opacity-60"
            >
              {status === "sending" ? (
                "Subscribing…"
              ) : (
                <>
                  Subscribe <Arrow />
                </>
              )}
            </button>
          </div>
          <label className="mt-3 flex items-start gap-2 text-[9px] leading-4 text-[#667085]">
            <input
              name="marketingConsent"
              type="checkbox"
              required
              className="mt-0.5 accent-[#ff8a00]"
            />
            I agree to receive Hollyway email updates and can unsubscribe later.
          </label>
          <small className="mt-3 block text-[9px] text-[#8995a8]">
            For instant updates,{" "}
            <a
              className="font-bold text-[#1453bb]"
              href={whatsappChannel}
              target="_blank"
              rel="noreferrer"
            >
              follow our WhatsApp channel
            </a>
            .
          </small>
          {status === "sent" && (
            <p
              className="mt-2 rounded-lg bg-[#e9f8ef] p-2 text-[10px] font-bold text-[#126b3b]"
              role="status"
            >
              You are subscribed. Welcome to Hollyway updates.
            </p>
          )}
          {status === "error" && (
            <p
              className="mt-2 rounded-lg bg-[#fff0ee] p-2 text-[10px] font-bold text-[#a12b24]"
              role="alert"
            >
              We could not subscribe you right now. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default function HomeContact() {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus("sending");
    try {
      await submitForm("contact", {
        name: String(values.get("name") || ""),
        email: String(values.get("email") || ""),
        topic: String(values.get("topic") || "General enquiry"),
        message: String(values.get("message") || ""),
      });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto grid w-[calc(100%-40px)] max-w-[1180px] gap-10 py-20 lg:w-[calc(100%-64px)] lg:grid-cols-[1fr_.9fr] lg:gap-16"
    >
      <div>
        <span className="text-[10px] font-extrabold tracking-[.16em] text-[#8995a8]">
          WE ARE HERE TO HELP
        </span>
        <h2 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
          Let&apos;s talk about your <span className="text-[#ff8a00]">buying or selling goal.</span>
        </h2>
        <p className="mt-4 max-w-xl text-xs leading-6 text-[#667085]">
          Business actions go directly to the Hollyway Admin WhatsApp DM. Use email for general
          contact, support and formal enquiries.
        </p>
        <div className="mt-7 grid gap-3">
          <ContactLink
            icon="✉"
            title="Email support"
            text={contactEmail}
            href={`mailto:${contactEmail}`}
          />
          <ContactLink
            icon="WA"
            title="Admin WhatsApp DM"
            text={adminPhone}
            href={adminWhatsApp}
          />
          <ContactLink
            icon="☎"
            title="Phone support"
            text={adminPhone}
            href={adminPhoneHref}
          />
        </div>
        <section className="mt-6 rounded-xl border border-[#dfe4ed] bg-white p-4" aria-labelledby="contact-social-title">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-[9px] font-extrabold tracking-[.14em] text-[#8995a8]">
                SOCIAL CONTACT
              </span>
              <h3 className="mt-1 text-sm font-bold text-[#0b1830]" id="contact-social-title">
                Find Hollyway across our official channels.
              </h3>
            </div>
            <SocialIcon name="group" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {channels.map(([icon, title, text, href]) => (
              <a
                className="flex min-w-0 items-center gap-2 rounded-lg border border-[#eef1f4] bg-[#fbfcfe] p-2.5 hover:border-[#9fbbe4]"
                href={href}
                target="_blank"
                rel="noreferrer"
                key={title}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#eef5ff] text-[#1453bb]">
                  <SocialIcon name={socialIconName(icon)} />
                </span>
                <span className="min-w-0">
                  <b className="block truncate text-[10px] text-[#0b1830]">{title}</b>
                  <small className="mt-0.5 block truncate text-[8px] text-[#8490a4]">{text}</small>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
      <form
        onSubmit={submit}
        className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-xl shadow-[#0a1d37]/5"
      >
        <h3 className="text-lg font-bold text-[#0b1830]">Send us a message</h3>
        <p className="mt-2 text-[10px] leading-5 text-[#667085]">
          Tell us what you need and we&apos;ll help you find the right next step.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-[10px] font-extrabold text-[#344054]">
            Name
            <input
              name="name"
              type="text"
              placeholder="Your name"
              required
              className="mt-1 w-full rounded-lg border border-[#dfe5ed] px-3 py-3 text-[11px] font-normal outline-none focus:border-[#4d86d8]"
            />
          </label>
          <label className="text-[10px] font-extrabold text-[#344054]">
            Email
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="mt-1 w-full rounded-lg border border-[#dfe5ed] px-3 py-3 text-[11px] font-normal outline-none focus:border-[#4d86d8]"
            />
          </label>
        </div>
        <Dropdown
          label="What can we help with?"
          name="topic"
          defaultValue="General enquiry"
          options={[
            { value: "General enquiry", label: "General enquiry", tip: "Use this for a question that does not fit another topic." },
            { value: "Company information", label: "Company information", tip: "Ask about Hollyway Global, its work or how the platform operates." },
            { value: "Support or dispute", label: "Support or dispute", tip: "Choose this when you need help with a transaction or want to report a dispute." },
            { value: "Partnership", label: "Partnership", tip: "Choose this for referral, reseller or business collaboration enquiries." },
            { value: "Business enquiry", label: "Business enquiry", tip: "Use this for a company request, supply need or commercial opportunity." },
          ]}
        />
        <label className="mt-3 block text-[10px] font-extrabold text-[#344054]">
          Message
          <textarea
            name="message"
            rows={4}
            placeholder="How can Hollyway help?"
            required
            className="mt-1 w-full resize-y rounded-lg border border-[#dfe5ed] px-3 py-3 text-[11px] font-normal outline-none focus:border-[#4d86d8]"
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#ff8a00] to-[#ffb01c] px-4 text-[10px] font-extrabold text-[#142039] disabled:opacity-60"
        >
          {status === "sending" ? (
            "Sending…"
          ) : (
            <>
              Send message <Arrow />
            </>
          )}
        </button>
        <small className="mt-3 block text-[9px] text-[#8995a8]">
          Your message is sent securely to Hollyway.
        </small>
        {status === "sent" && (
          <p
            className="mt-2 rounded-lg bg-[#e9f8ef] p-2 text-[10px] font-bold text-[#126b3b]"
            role="status"
          >
            Your message was sent. Our team will respond soon.
          </p>
        )}
        {status === "error" && (
          <p
            className="mt-2 rounded-lg bg-[#fff0ee] p-2 text-[10px] font-bold text-[#a12b24]"
            role="alert"
          >
            We could not send your message. Please try again or email us directly.
          </p>
        )}
      </form>
    </section>
  );
}

function ContactLink({
  icon,
  title,
  text,
  href,
}: {
  icon: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-center gap-3 rounded-lg border border-[#dfe4ed] p-3 hover:border-[#9fbbe4]"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eef5ff] text-[10px] font-extrabold text-[#1453bb]">
        {icon === "WA" ? <SocialIcon name="whatsapp" /> : icon}
      </span>
      <span>
        <b className="block text-[10px] text-[#0b1830]">{title}</b>
        <small className="mt-1 block text-[9px] text-[#8490a4]">{text}</small>
      </span>
    </a>
  );
}

async function submitForm(type: "contact" | "newsletter", data: Record<string, string | boolean>) {
  const token = audienceRelayTokens[type];
  if (!token) throw new Error("AudienceRelay form token is not configured");
  const response = await apiFetch(
    `${audienceRelayBaseUrl}/api/v1/forms/${encodeURIComponent(token)}/submissions`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) },
    {
      successMessage: type === "contact" ? "Message sent successfully." : "Subscription saved successfully.",
      errorMessage: type === "contact" ? "Message could not be sent. Please try again." : "Subscription could not be saved. Please try again.",
    },
  );
  if (!response.ok) throw new Error("AudienceRelay submission failed");
}
