import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Users, AlertTriangle, FolderKanban, FileText } from "lucide-react";

const STATS_DATA = {
  totalSiswa: 1280,
  pelanggaranHariIni: 12,
  kasusAktif: 48,
  suratBulanIni: 35,
};

const TREN_PELANGGARAN = [
  { bulan: "Jan", jumlah: 45 },
  { bulan: "Feb", jumlah: 52 },
  { bulan: "Mar", jumlah: 38 },
  { bulan: "Apr", jumlah: 61 },
  { bulan: "Mei", jumlah: 55 },
  { bulan: "Jun", jumlah: 72 },
  { bulan: "Jul", jumlah: 48 },
  { bulan: "Agu", jumlah: 65 },
  { bulan: "Sep", jumlah: 80 },
  { bulan: "Okt", jumlah: 58 },
  { bulan: "Nov", jumlah: 43 },
  { bulan: "Des", jumlah: 67 },
];

const TOP_KATEGORI = [
  { kategori: "Terlambat", jumlah: 120 },
  { kategori: "Seragam", jumlah: 95 },
  { kategori: "Bolos", jumlah: 78 },
  { kategori: "Merokok", jumlah: 52 },
  { kategori: "HP/Smartphone", jumlah: 45 },
];

const SISWA_POIN_TERTINGGI = [
  { nama: "Ahmad Rizki", kelas: "XII RPL 1", poin: 185 },
  { nama: "Siti Nurhaliza", kelas: "XII AKL 2", poin: 162 },
  { nama: "Budi Santoso", kelas: "XI BDP 1", poin: 148 },
  { nama: "Dewi Lestari", kelas: "XI RPL 2", poin: 134 },
  { nama: "Fajar Pratama", kelas: "X OTKP 1", poin: 120 },
];

function fetchDashboardData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: STATS_DATA,
        trenPelanggaran: TREN_PELANGGARAN,
        topKategori: TOP_KATEGORI,
        siswaPoinTertinggi: SISWA_POIN_TERTINGGI,
      });
    }, 500);
  });
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-muted">
          Ringkasan data pelanggaran dan pembinaan siswa
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Siswa"
          value={data.stats.totalSiswa.toLocaleString()}
          icon={Users}
          color="bg-primary"
        />
        <StatCard
          title="Pelanggaran Hari Ini"
          value={data.stats.pelanggaranHariIni}
          icon={AlertTriangle}
          color="bg-warning"
        />
        <StatCard
          title="Kasus Aktif"
          value={data.stats.kasusAktif}
          icon={FolderKanban}
          color="bg-danger"
        />
        <StatCard
          title="Surat Bulan Ini"
          value={data.stats.suratBulanIni}
          icon={FileText}
          color="bg-accent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tren Pelanggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trenPelanggaran}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="bulan"
                    className="text-xs text-muted"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs text-muted"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="jumlah"
                    stroke="#0F766E"
                    strokeWidth={2}
                    dot={{ fill: "#0F766E", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Kategori Pelanggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topKategori} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="kategori"
                    type="category"
                    width={120}
                    className="text-xs text-muted"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="jumlah" fill="#0F766E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Siswa dengan Poin Tertinggi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-3 font-medium">No</th>
                  <th className="pb-3 font-medium">Nama</th>
                  <th className="pb-3 font-medium">Kelas</th>
                  <th className="pb-3 font-medium text-right">Poin</th>
                </tr>
              </thead>
              <tbody>
                {data.siswaPoinTertinggi.map((siswa, i) => (
                  <tr key={siswa.nama} className="border-b border-border last:border-0">
                    <td className="py-3 text-muted">{i + 1}</td>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">
                      {siswa.nama}
                    </td>
                    <td className="py-3 text-muted">{siswa.kelas}</td>
                    <td className="py-3 text-right font-semibold text-danger">
                      {siswa.poin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
