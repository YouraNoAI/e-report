import { CASE_STATUS_LABELS } from "../../constants/roles";
import { cn } from "../../lib/utils";

const STATUS_STYLES = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  PELANGGARAN_DICATAT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PEMBINAAN_STP2K:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  KONSELING_BK:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROSES_KESISWAAN:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  SURAT_DIBUAT:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  ORANG_TUA_DIPANGGIL:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  SELESAI:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export default function StatusBadge({ status, className }) {
  const label = CASE_STATUS_LABELS[status] || status;
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
