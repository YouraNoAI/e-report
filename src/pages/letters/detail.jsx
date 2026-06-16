import { Card, CardContent } from "../../components/ui/card";
import { Eye } from "lucide-react";

export default function LetterDetailPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Eye className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detail Surat
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Lihat dan unduh dokumen surat yang telah dibuat.
            Fitur ini akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
