import BrandIcon from "../../../components/ui/BrandIcon";
import {
  adminPhone,
  adminPhoneHref,
  adminWhatsApp,
  contactEmail,
  socialChannels,
  supportEmail,
} from "../../../components/config/contact";
import HelpIcon from "./HelpIcon";

const contactMethods = [
  {
    icon: "mail" as const,
    label: "General enquiries",
    value: contactEmail,
    href: `mailto:${contactEmail}`,
  },
  {
    icon: "mail" as const,
    label: "Support email",
    value: supportEmail,
    href: `mailto:${supportEmail}`,
  },
  {
    icon: "phone" as const,
    label: "Phone support",
    value: adminPhone,
    href: adminPhoneHref,
  },
  {
    icon: "whatsapp" as const,
    label: "WhatsApp support",
    value: adminPhone,
    href: adminWhatsApp,
  },
];

export default function SupportChannels() {
  return (
    <section
      className="rounded-xl border border-[#e4e2da] bg-white p-3 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-4"
      aria-labelledby="support-channels-title"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#eef1f4] pb-3">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#b8560d]">
            SUPPORT &amp; FEEDBACK
          </span>
          <h2
            className="mt-1 font-[Manrope] text-base font-semibold text-[#12141c]"
            id="support-channels-title"
          >
            Contact Hollyway
          </h2>
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#fbe9da] text-[#b8560d] [&>svg]:h-4 [&>svg]:w-4">
          <HelpIcon name="message" />
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {contactMethods.map((method) => (
          <a
            className="flex min-w-0 items-center gap-2 rounded-lg border border-[#eef1f4] bg-[#fbfcfe] px-2.5 py-2 transition hover:border-[#9fbbe4]"
            href={method.href}
            target={method.icon === "whatsapp" ? "_blank" : undefined}
            rel={method.icon === "whatsapp" ? "noreferrer" : undefined}
            key={method.label}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4">
              {method.icon === "whatsapp" ? <BrandIcon name="whatsapp" /> : <HelpIcon name={method.icon} />}
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-[10px] font-bold text-[#12141c]">{method.label}</strong>
              <span className="mt-0.5 block truncate text-[9px] text-[#687895]">{method.value}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="mt-3 border-t border-[#eef1f4] pt-3">
        <span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9498a3]">
          OFFICIAL SOCIALS
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {socialChannels.map((channel) => (
            <a
              className="flex min-w-0 items-center gap-2 rounded-lg border border-[#eef1f4] px-2 py-2 transition hover:border-[#9fbbe4] hover:bg-[#fbfcfe]"
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              key={channel.title}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#f3f4f7] text-[#14213d] [&>svg]:h-4 [&>svg]:w-4">
                <BrandIcon name={channel.icon} />
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-[9px] font-bold text-[#12141c]">{channel.title}</strong>
                <span className="mt-0.5 block truncate text-[8px] text-[#687895]">{channel.detail}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
