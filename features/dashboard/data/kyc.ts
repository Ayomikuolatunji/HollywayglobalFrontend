export const kycStorageKey = "hollyway-kyc-draft";

export type KycStatus = "not-started" | "draft" | "submitted";

export type KycDraft = {
  dateOfBirth: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  documentName: string;
  address: string;
  city: string;
  state: string;
  consent: boolean;
};

export const emptyKycDraft: KycDraft = {
  dateOfBirth: "",
  phone: "",
  documentType: "NIN",
  documentNumber: "",
  documentName: "",
  address: "",
  city: "",
  state: "",
  consent: false,
};

export const kycSteps = ["Personal details", "Identity document", "Address", "Review"] as const;
