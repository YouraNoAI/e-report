import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { fetchDashboardData } from "@/services/dashboardService";
import { Users, AlertTriangle, FileText, Mail, TrendingUp } from "lucide-react";

const STAT_CARDS = [
  { title: "Total Siswa", key: "totalSiswa", icon: Users, color: "text-primary" },
  { title: "Pelanggaran Hari Ini", key: "pelanggaranHariIni", icon: AlertTriangle, color: "text-warning" },
  { title: "Kasus Aktif", key: "kasusAktif", icon: FileText, color: "text-info" },
  { title: "Surat Bulan Ini", key: "suratBulanIni", icon: Mail, color: "text-success" },
];

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map(() => (
            <Card key={Math.random()} className="p-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-1/2 mt-2" />
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4"><Skeleton className="h-64 w-full" /></Card>
          <Card className="p-4"><Skeleton className="h-64 w-full" /></Card>
          <Card className="p-4"><Skeleton className="h-64 w-full" /></Card>
        </div>
        <Card className="p-4"><Skeleton className="h-64 w-full" /></Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Gagal memuat dashboard
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  const { stats, trenPelanggaran, topKategori, siswaPoinTertinggi } = data || {};

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ title, key, icon: Icon, color }) => (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.[key] ?? 0}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-primary/10 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tren Pelanggaran 12 Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trenPelanggaran || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="bulan" className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                    labelFormatter={(label) => `Bulan ${label}`}
                    formatter={(value) => [`${value} pelanggaran`, "Jumlah"]}
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
                <BarChart data={topKategori || []} layout="vertical">
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
                    formatter={(value) => [`${value} kasus`, "Jumlah"]}
                  />
                  <Bar dataKey="jumlah" fill="#0F766E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Status Kasus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex flex-col justify-center items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>Sedang Diproses: {stats?.kasusAktif ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Selesai: {stats?.totalSurat ?? 0}</span>
              </div>
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
                {(siswaPoinTertinggi || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted">
                      Tidak ada data poin siswa
                    </td>
                  </tr>
                ) : (
                  (siswaPoinTertinggi || []).map((siswa, i) => (
                    <tr key={siswa.nama} className="border-b border-border last:border-0">
                      <td className="py-3 text-muted">{i + 1}</td>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {siswa.nama}
                      </td>
                      <td className="py-3 text-muted">{siswa.kelas}</td>
                      <td className="py-3 text-right font-semibold text-destructive">
                        {siswa.poin}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}