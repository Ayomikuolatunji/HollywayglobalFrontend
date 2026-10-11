"use client";

import { useEffect, useRef, useState } from "react";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import { showToast } from "../../../components/ui/ToastProvider";
import type { EscrowPartyRole, EscrowPurpose } from "../data/escrow";
import {
  fetchCurrentEscrowParticipant,
  findEscrowParticipants,
  type EscrowParticipant,
} from "../data/participantApi";

type PartyRole = EscrowPartyRole;

type EscrowParties = {
  initiatorRole: PartyRole;
  currentParticipant: EscrowParticipant | null;
  counterparty: EscrowParticipant | null;
  counterpartyEmail: string;
  counterpartyConfirmed: boolean;
};

type EscrowPartySelectorProps = {
  purpose: EscrowPurpose;
  initialRole?: PartyRole;
  initialOtherEmail?: string;
  onChange: (parties: EscrowParties) => void;
};

const roleOptions: Record<EscrowPurpose, DropdownOption[]> = {
  goods_sale: [
    { value: "buyer", label: "I am the buyer", tip: "Your Hollyway account will be recorded as the buyer." },
    { value: "seller", label: "I am the seller", tip: "Your Hollyway account will be recorded as the seller." },
  ],
  service_agreement: [
    { value: "client", label: "I am the client", tip: "Your Hollyway account will be recorded as the client." },
    { value: "provider", label: "I am the provider", tip: "Your Hollyway account will be recorded as the provider." },
  ],
  general_agreement: [
    { value: "party_a", label: "I am Party A", tip: "Your Hollyway account will be recorded as Party A." },
    { value: "party_b", label: "I am Party B", tip: "Your Hollyway account will be recorded as Party B." },
  ],
};

const defaultRoles: Record<EscrowPurpose, PartyRole> = {
  goods_sale: "buyer",
  service_agreement: "client",
  general_agreement: "party_a",
};

function counterpartyLabel(purpose: EscrowPurpose, role: PartyRole) {
  if (purpose === "goods_sale") return role === "buyer" ? "Find the seller" : "Find the buyer";
  if (purpose === "service_agreement") return role === "client" ? "Find the provider" : "Find the client";
  return role === "party_a" ? "Find Party B" : "Find Party A";
}

function participantLabel(participant: EscrowParticipant | null) {
  if (!participant) return "Account not loaded";
  if (!participant.name) return participant.email;
  return `${participant.name} · ${participant.email}`;
}

export default function EscrowPartySelector({
  purpose,
  initialRole = "buyer",
  initialOtherEmail = "",
  onChange,
}: EscrowPartySelectorProps) {
  const [role, setRole] = useState<PartyRole>(
    roleOptions[purpose].some((option) => option.value === initialRole)
      ? initialRole
      : defaultRoles[purpose],
  );
  const [currentParticipant, setCurrentParticipant] = useState<EscrowParticipant | null>(null);
  const [otherParticipant, setOtherParticipant] = useState<EscrowParticipant | null>(null);
  const [pendingParticipants, setPendingParticipants] = useState<EscrowParticipant[]>([]);
  const [otherSearch, setOtherSearch] = useState(initialOtherEmail);
  const [selectionTouched, setSelectionTouched] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const purposeMounted = useRef(false);

  useEffect(() => {
    let active = true;
    fetchCurrentEscrowParticipant()
      .then((participant) => {
        if (active) setCurrentParticipant(participant);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Your Hollyway account could not be loaded.");
      })
      .finally(() => {
        if (active) setLoadingCurrent(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectionTouched) return;
    onChange({
      initiatorRole: role,
      currentParticipant,
      counterparty: otherParticipant,
      counterpartyEmail: otherParticipant?.email || "",
      counterpartyConfirmed: Boolean(otherParticipant),
    });
  }, [currentParticipant, onChange, otherParticipant, role, selectionTouched]);

  useEffect(() => {
    if (!purposeMounted.current) {
      purposeMounted.current = true;
      return;
    }
    const nextRole = defaultRoles[purpose];
    setRole(nextRole);
    setOtherParticipant(null);
    setPendingParticipants([]);
    setOtherSearch("");
    setSelectionTouched(true);
    setError("");
  }, [purpose]);

  async function searchOtherParty() {
    if (!otherSearch.trim()) {
      setError("Enter the other party's Hollyway name or email address.");
      return;
    }
    setSearching(true);
    setSelectionTouched(true);
    setError("");
    setOtherParticipant(null);
    setPendingParticipants([]);
    try {
      const participants = await findEscrowParticipants(otherSearch);
      setPendingParticipants(participants);
      showToast("success", participants.length === 1 ? "Hollyway account found. Confirm the party before continuing." : `${participants.length} verified Hollyway accounts found. Choose the correct party.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "That Hollyway account could not be used for this escrow.");
    } finally {
      setSearching(false);
    }
  }

  function changeRole(value: string) {
    setRole(value as PartyRole);
    setOtherParticipant(null);
    setPendingParticipants([]);
    setOtherSearch("");
    setSelectionTouched(true);
    setError("");
  }

  function addPendingParticipant(participant: EscrowParticipant) {
    setOtherParticipant(participant);
    setPendingParticipants([]);
    setError("");
    showToast("success", "Other party added to this escrow.");
  }

  function removeOtherParticipant() {
    setOtherParticipant(null);
    setPendingParticipants([]);
    setOtherSearch("");
    setSelectionTouched(true);
    setError("");
  }

  return (
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 sm:p-5">
      <div>
        <h3 className="font-[Manrope] text-base font-extrabold tracking-[-.03em] text-[#0b1830]">Verified parties</h3>
        <p className="mt-1 max-w-2xl text-[10px] leading-4 text-[#8490a4]">Select your role, then find the other party by their verified legal name or Hollyway email. Names and reachable numbers are taken from Hollyway records instead of being typed manually.</p>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Dropdown label="Your role in this transaction" name="initiatorRole" options={roleOptions[purpose]} value={role} onChange={changeRole} />
        <div className="rounded-lg border border-[#e3eaf4] bg-[#f7faff] p-3">
          <span className="text-[9px] font-extrabold tracking-[.12em] text-[#1453bb]">YOUR HOLLYWAY ACCOUNT</span>
          <p className="mt-2 text-xs font-extrabold text-[#0b1830]">{loadingCurrent ? "Loading your account…" : participantLabel(currentParticipant)}</p>
          <p className="mt-1 text-[10px] leading-4 text-[#53627a]">{currentParticipant?.identityVerified && currentParticipant.phone ? `Approved identity · reachable number: ${currentParticipant.phone}` : "Approved identity and a reachable international number are required."}</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-[#eef1f4] p-3">
        <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]">
          <span>{counterpartyLabel(purpose, role)}</span>
          <small className="text-[10px] font-medium leading-4 text-[#8995a8]">The other person must already have a Hollyway account and approved identity details.</small>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input className="h-10 min-w-0 flex-1 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" disabled={Boolean(otherParticipant)} onChange={(event) => { setOtherSearch(event.currentTarget.value); setOtherParticipant(null); setPendingParticipants([]); setSelectionTouched(true); setError(""); }} placeholder="Legal name or Hollyway email" type="text" value={otherSearch} />
            <button className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-[#1453bb] px-3 text-xs font-extrabold text-[#1453bb] hover:bg-[#edf4ff] disabled:cursor-wait disabled:opacity-60" disabled={searching || loadingCurrent || Boolean(otherParticipant)} onClick={searchOtherParty} type="button">{searching ? "Searching…" : "Find account"}</button>
          </div>
        </label>
        {pendingParticipants.length > 0 && <div className="mt-3 rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-3"><span className="text-[9px] font-extrabold tracking-[.12em] text-[#1453bb]">CHOOSE THE VERIFIED ACCOUNT</span><p className="mt-1 text-[10px] leading-4 text-[#53627a]">Confirm the name and email before adding the party to this escrow.</p><div className="mt-3 grid gap-2">{pendingParticipants.map((participant) => <div className="flex flex-col gap-2 rounded-lg border border-[#dbe7f7] bg-white p-3 sm:flex-row sm:items-center sm:justify-between" key={participant.email}><div><p className="text-xs font-extrabold text-[#0b1830]">{participantLabel(participant)}</p><p className="mt-1 text-[10px] text-[#53627a]">Reachable number: {participant.phone}</p></div><button className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white" onClick={() => addPendingParticipant(participant)} type="button">Add this party</button></div>)}</div><button className="mt-3 text-[10px] font-extrabold text-[#a32929] hover:underline" onClick={removeOtherParticipant} type="button">Remove search results</button></div>}
        {otherParticipant && <div className="mt-3 rounded-lg border border-[#bfe5d0] bg-[#f5fcf7] p-3"><div className="flex items-start justify-between gap-3"><div><span className="text-[9px] font-extrabold tracking-[.12em] text-[#14733d]">PARTY ADDED</span><p className="mt-1 text-xs font-extrabold text-[#0b1830]">{participantLabel(otherParticipant)}</p><p className="mt-1 text-[10px] text-[#53627a]">Reachable number: {otherParticipant.phone}</p></div><button className="shrink-0 text-[10px] font-extrabold text-[#a32929] hover:underline" onClick={removeOtherParticipant} type="button">Remove</button></div></div>}
        {error && <p className="mt-2 text-[10px] font-semibold leading-4 text-[#a32929]" role="alert">{error}</p>}
      </div>
      <input name="counterpartyEmail" type="hidden" value={otherParticipant?.email || ""} readOnly />
    </section>
  );
}
