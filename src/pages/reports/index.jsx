import PageHeader from "../../components/shared/PageHeader";
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
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LineChart as LineChartIcon,
  BarChart3,
  AlertTriangle,
  FileText,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import LoadingState from "../../components/shared/LoadingState";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import { fetchReportData } from "../../services/reportsService";

const PIE_COLORS = [
  "#0F766E",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#DC2626",
  "#10B981",
  "#EC4899",
];

const STATUS_BADGE = {
  Dicatat: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  STP2K: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  BK: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Kesiswaan: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Selesai: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const CHART_TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "13px",
};

function StatCard({ title, value, icon: Icon, color, loading }) {
  if (loading) {
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

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72 w-full" />
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReportData,
  });

  if (error) {
    return <ErrorState message="Gagal memuat data laporan" onRetry={refetch} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard loading />
          <StatCard loading />
          <StatCard loading />
          <StatCard loading />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan & Statistik"
        description="Analisis data pelanggaran, pembinaan, dan kasus siswa"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-muted">Periode</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Harian</option>
                <option>Bulanan</option>
                <option>Semester</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-muted">Tanggal Mulai</label>
              <input type="date" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-muted">Tanggal Akhir</label>
              <input type="date" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-muted">Kelas</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Semua Kelas</option>
                <option>X RPL 1</option>
                <option>X RPL 2</option>
                <option>XI RPL 1</option>
                <option>XI RPL 2</option>
                <option>XII RPL 1</option>
                <option>XII RPL 2</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-muted">Jurusan</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Semua Jurusan</option>
                <option>RPL</option>
                <option>AKL</option>
                <option>BDP</option>
                <option>OTKP</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-muted">Kategori</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Semua Kategori</option>
                <option>Terlambat</option>
                <option>Seragam</option>
                <option>Bolos</option>
                <option>Merokok</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="default" size="sm">Terapkan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pelanggaran"
          value={data.stats.totalPelanggaran.toLocaleString()}
          icon={AlertTriangle}
          color="bg-warning"
        />
        <StatCard
          title="Rata-rata Poin"
          value={data.stats.rataPoin}
          icon={BarChart3}
          color="bg-primary"
        />
        <StatCard
          title="Siswa Terlibat"
          value={data.stats.siswaTerlibat}
          icon={LineChartIcon}
          color="bg-accent"
        />
        <StatCard
          title="Surat Terbit"
          value={data.stats.suratTerbit}
          icon={FileText}
          color="bg-danger"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tren Pelanggaran per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.tren}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="bulan" className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="jumlah" stroke="#0F766E" strokeWidth={2} dot={{ fill: "#0F766E", r: 4 }} name="Jumlah" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 Kategori Pelanggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topKategori} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="kategori" type="category" width={130} className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="jumlah" fill="#0F766E" radius={[0, 4, 4, 0]} name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Status Kasus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusDistribusi}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.statusDistribusi.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pelanggaran per Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.perKelas}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="kelas" className="text-xs text-muted" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis className="text-xs text-muted" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="jumlah" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Detail Laporan</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.detail.length === 0 ? (
            <EmptyState title="Tidak ada data" description="Belum ada laporan yang tersedia." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted">
                    <th className="pb-3 font-medium px-2">Tanggal</th>
                    <th className="pb-3 font-medium px-2">Siswa</th>
                    <th className="pb-3 font-medium px-2">Kelas</th>
                    <th className="pb-3 font-medium px-2">Kategori</th>
                    <th className="pb-3 font-medium px-2 text-right">Poin</th>
                    <th className="pb-3 font-medium px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detail.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-2 text-muted">{row.tanggal}</td>
                      <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{row.siswa}</td>
                      <td className="py-3 px-2 text-muted">{row.kelas}</td>
                      <td className="py-3 px-2 text-muted">{row.kategori}</td>
                      <td className="py-3 px-2 text-right font-semibold text-gray-900 dark:text-white">{row.poin}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[row.statusKasus] || ""}`}>
                          {row.statusKasus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
