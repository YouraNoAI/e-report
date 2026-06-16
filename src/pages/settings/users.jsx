import { Card, CardContent } from "../../components/ui/card";
import { Users } from "lucide-react";

export default function UserManagementPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manajemen Pengguna
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Kelola akun pengguna, atur peran dan izin akses untuk setiap
            pengguna. Fitur ini akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
