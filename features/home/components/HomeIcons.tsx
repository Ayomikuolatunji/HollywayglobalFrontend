export { Arrow } from "../../../components/ui/Arrow";
import BrandIcon from "../../../components/ui/BrandIcon";

export function SocialIcon({ name }: { name: string }) {
  const iconName = ["whatsapp", "instagram", "x", "facebook", "linkedin", "tiktok", "group"].includes(name) ? name as "whatsapp" | "instagram" | "x" | "facebook" | "linkedin" | "tiktok" | "group" : "group";
  return <BrandIcon name={iconName} className="h-4 w-4" />;
}
