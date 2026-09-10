"use client";

import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import BusinessUpgradeField, {
  BusinessUpgradeSection,
} from "./BusinessUpgradeField";
import type { BusinessUpgradeDraft } from "../data/businessUpgrade";

const stateOptions: DropdownOption[] = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Abuja (FCT)",
].map((state) => ({ value: state, label: state }));

type BusinessUpgradeCompanyFieldsProps = {
  draft: BusinessUpgradeDraft;
  onChange: (field: keyof BusinessUpgradeDraft, value: string) => void;
};

export default function BusinessUpgradeCompanyFields({
  draft,
  onChange,
}: BusinessUpgradeCompanyFieldsProps) {
  return (
    <>
      <BusinessUpgradeSection
        icon="store"
        title="Company identity"
        description="Use the registered company details that Hollyway Admin can verify."
      >
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <BusinessUpgradeField
            label="Registered company name"
            value={draft.companyName}
            placeholder="Registered company name"
            onChange={(value) => onChange("companyName", value)}
          />
          <BusinessUpgradeField
            label="CAC RC or BN number"
            value={draft.registrationNumber}
            placeholder="RC or BN number"
            onChange={(value) => onChange("registrationNumber", value)}
          />
          <BusinessUpgradeField
            label="Company email"
            value={draft.companyEmail}
            placeholder="company@example.com"
            type="email"
            inputMode="email"
            onChange={(value) => onChange("companyEmail", value)}
          />
          <BusinessUpgradeField
            label="Company phone number"
            value={draft.companyPhone}
            placeholder="+234 801 234 5678"
            type="tel"
            inputMode="tel"
            hint="Include the international country code."
            onChange={(value) => onChange("companyPhone", value)}
          />
          <BusinessUpgradeField
            label="Your position"
            value={draft.position}
            placeholder="Director, owner or representative"
            onChange={(value) => onChange("position", value)}
          />
          <BusinessUpgradeField
            label="TIN"
            value={draft.tin}
            placeholder="Tax Identification Number"
            required={false}
            hint="Optional now; provide it if it is available for the business."
            onChange={(value) => onChange("tin", value)}
          />
        </div>
      </BusinessUpgradeSection>

      <BusinessUpgradeSection
        icon="grid"
        title="Business address"
        description="Provide the physical address of the registered business."
      >
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <BusinessUpgradeField
            label="Street"
            value={draft.addressStreet}
            placeholder="Street and building number"
            onChange={(value) => onChange("addressStreet", value)}
          />
          <BusinessUpgradeField
            label="City"
            value={draft.addressCity}
            placeholder="City"
            onChange={(value) => onChange("addressCity", value)}
          />
          <Dropdown
            label="State"
            name="addressState"
            options={stateOptions}
            value={draft.addressState}
            onChange={(value) => onChange("addressState", value)}
            hint="Select the state where the business address is located."
          />
        </div>
      </BusinessUpgradeSection>
    </>
  );
}
