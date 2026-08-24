export { Arrow } from "../../../components/ui/Arrow";

export function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    whatsapp: "WA",
    instagram: "IG",
    x: "X",
    facebook: "f",
    linkedin: "in",
    tiktok: "♪",
    group: "◎",
  };
  return (
    <span aria-hidden="true" className="text-[10px] font-extrabold">
      {icons[name] || name}
    </span>
  );
}
