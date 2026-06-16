import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ErrorState({
  message = "Terjadi kesalahan",
  onRetry,
  className,
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <AlertCircle className="h-8 w-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Oops!
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
