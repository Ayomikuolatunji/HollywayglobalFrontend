"use client";

type BusinessUpgradeLoadErrorProps = {
  message: string;
  onRetry: () => void;
};

export default function BusinessUpgradeLoadError({
  message,
  onRetry,
}: BusinessUpgradeLoadErrorProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-4 py-3 text-xs leading-5 text-[#6b5a3d]"
      role="alert"
    >
      <span>{message}</span>
      <button
        className="font-extrabold text-[#b8560d] hover:underline"
        type="button"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}
