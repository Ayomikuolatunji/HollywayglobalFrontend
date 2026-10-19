type PaginationControlsProps = {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between border-t border-[#eef1f4] pt-3">
      <button
        className="text-[10px] font-extrabold text-[#1453bb] disabled:text-[#b2bdcc]"
        type="button"
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-[10px] font-semibold text-[#687895]">
        Page {page} of {totalPages}
      </span>
      <button
        className="text-[10px] font-extrabold text-[#1453bb] disabled:text-[#b2bdcc]"
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
