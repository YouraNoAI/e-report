import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 dark:bg-dark-bg">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
          <ShieldX className="h-10 w-10 text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Akses Ditolak
        </h1>
        <p className="max-w-sm text-muted">
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi
          administrator jika Anda memerlukan akses.
        </p>
        <Button onClick={() => navigate("/")} className="mt-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
