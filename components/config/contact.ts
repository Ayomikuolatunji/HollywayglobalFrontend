export const whatsappGroup = "https://chat.whatsapp.com/Ij8dR9bkwppHQq77srTSqx";
export const whatsappChannel = "https://whatsapp.com/channel/0029VbDn9GO30LKWJNk81P2M";
export const facebookPage = "https://www.facebook.com/Hollywayglobal/";
export const facebookGroup = "https://www.facebook.com/groups/hollywayglobal";

export const contactEmail = "contact@hollywayglobal.com";
export const supportEmail = "support@hollywayglobal.com";
export const adminPhone = "+234 701 558 5967";
export const adminPhoneHref = "tel:+2347015585967";
export const adminWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I would like to make an enquiry.")}`;
export const sellWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I want to sell an item.")}`;
export const wantedWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I want to post a wanted item request.")}`;

export const socialChannels = [
  { icon: "whatsapp", shortIcon: "WA", title: "WhatsApp marketplace", detail: "Join the trading community", href: whatsappGroup },
  { icon: "whatsapp", shortIcon: "WA", title: "WhatsApp channel", detail: "Follow new updates", href: whatsappChannel },
  { icon: "instagram", shortIcon: "IG", title: "Instagram", detail: "@hollywayglobal", href: "https://www.instagram.com/hollywayglobal/" },
  { icon: "x", shortIcon: "X", title: "X", detail: "@hollywayglobal", href: "https://x.com/hollywayglobal" },
  { icon: "facebook", shortIcon: "f", title: "Facebook", detail: "Hollyway Global", href: facebookPage },
  { icon: "linkedin", shortIcon: "in", title: "LinkedIn", detail: "Hollyway Global", href: "https://www.linkedin.com/in/hollyway-global/" },
  { icon: "tiktok", shortIcon: "tiktok", title: "TikTok", detail: "@hollywayglobal", href: "https://www.tiktok.com/@hollywayglobal" },
  { icon: "group", shortIcon: "group", title: "Facebook group", detail: "Open community marketplace", href: facebookGroup },
] as const;
