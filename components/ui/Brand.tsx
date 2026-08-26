import Image from "next/image";
import Link from "next/link";

export default function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" aria-label="Hollyway Global home" className="flex shrink-0 items-center gap-2">
      <span className="relative h-10 w-10 overflow-hidden">
        <Image src="/brand-logo.png" alt="Hollyway Global Quick Sales logo" width={80} height={80} priority={!footer} className="absolute -left-3 -top-0.5 max-w-none" />
      </span>
      <span className="flex flex-col leading-none tracking-[-.04em]">
        <strong className="font-[Manrope] text-[15px] font-extrabold text-[#0a3271]">HOLLYWAY</strong>
        <small className="mt-1 text-[8px] font-extrabold tracking-[.29em] text-[#ff8a00]">GLOBAL</small>
      </span>
    </Link>
  );
}
