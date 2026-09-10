"use client";

import { useState, type FormEvent } from "react";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import { createSupportTicket, type HelpCategory, type HelpTicket } from "../data/helpApi";
import HelpIcon from "./HelpIcon";

export default function SupportRequestForm({
  categories,
  onSubmitted,
}: {
  categories: HelpCategory[];
  onSubmitted: (ticket: HelpTicket) => void;
}) {
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const options: DropdownOption[] = categories.map((item) => ({
    value: item.id,
    label: item.label,
    tip: item.description,
  }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const subject = String(form.get("subject") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (!category) {
      setError("Choose a help topic.");
      return;
    }
    if (subject.length < 4 || message.length < 10) {
      setError(
        "Add a short subject and enough detail for Hollyway to understand the issue.",
      );
      return;
    }
    setSaving(true);
    try {
      const ticket = await createSupportTicket({
        category,
        subject,
        message,
        relatedReference: String(form.get("relatedReference") || "").trim(),
      });
      onSubmitted(ticket);
      formElement.reset();
      setCategory("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Your support request could not be sent.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#e4e2da] bg-white p-5 shadow-[0_1px_2px_rgba(18,20,28,.03)]">
      <div className="flex items-start gap-3 border-b border-[#eef1f4] pb-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fbe9da] text-[#b8560d] [&>svg]:h-4 [&>svg]:w-4">
          <HelpIcon name="message" />
        </span>
        <div>
          <h2 className="font-[Manrope] text-base font-semibold text-[#12141c]">
            Contact Hollyway support
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#5c5f6b]">
            If the answers do not resolve it, send one clear request and keep your reference.
          </p>
        </div>
      </div>
      <form className="mt-4 grid gap-4" onSubmit={submit}>
        <Dropdown
          label="Help topic"
          options={options}
          value={category}
          onChange={setCategory}
          placeholder="Choose a topic"
          hint="Choose the area closest to your question."
          required={false}
        />
        <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
          <span>Subject</span>
          <input
            className="h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10"
            name="subject"
            placeholder="What do you need help with?"
            maxLength={160}
            required
          />
        </label>
        <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
          <span>What happened?</span>
          <textarea
            className="min-h-28 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium leading-5 text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10"
            name="message"
            placeholder="Share the relevant steps and what you expected to happen."
            maxLength={4000}
            required
          />
        </label>
        <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
          <span>
            Hollyway reference <em className="font-medium not-italic text-[#8995a8]">(optional)</em>
          </span>
          <input
            className="h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10"
            name="relatedReference"
            placeholder="For example, an order or listing code"
            maxLength={120}
          />
        </label>
        {error && (
          <p
            className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-3 py-2 text-xs font-semibold leading-5 text-[#6b5a3d]"
            role="alert"
          >
            {error}
          </p>
        )}
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14213d] px-4 text-xs font-bold text-white hover:bg-[#24325a] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {saving ? "Sending…" : "Send support request"}
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-[10px] leading-4 text-[#8995a8]">
          Do not include passwords, identity numbers, one-time codes or private documents.
        </p>
      </form>
    </section>
  );
}
