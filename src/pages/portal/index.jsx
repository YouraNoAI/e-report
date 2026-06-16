import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  GraduationCap,
  AlertTriangle,
  FileText,
  Bell,
  Clock,
  Download,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import PageHeader from "../../components/shared/PageHeader";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import StatusBadge from "../../components/shared/StatusBadge";
import { useAuth } from "../../contexts/AuthContext";
import { useViolationsByStudent } from "../../hooks/useViolations";
import { useCaseByStudent } from "../../hooks/useCases";
import { useNotifications } from "../../hooks/useNotifications";
import { ROLES, NOTIFICATION_TYPES, CASE_STATUS_LABELS, POINT_THRESHOLDS } from "../../constants/roles";

// ─── Mock Parents Data ───────────────────────────────────────────────
const MOCK_CHILDREN = [
  { id: "s1", fullName: "Ahmad Rizki", className: "XI RPL 1", totalPoints: 65, jurusan: "RPL", nis: "12345", caseStatus: "KONSELING_BK" },
  { id: "s2", fullName: "Siti Rahma", className: "X AKL 2", totalPoints: 22, jurusan: "AKL", nis: "12346", caseStatus: "PELANGGARAN_DICATAT" },
];

const MOCK_VIOLATIONS_S1 = [
  { id: "v1", description: "Terlambat masuk sekolah", points: 10, categoryName: "Terlambat", createdAt: new Date("2026-06-10"), status: "DICATAT" },
  { id: "v2", description: "Tidak memakai seragam lengkap", points: 5, categoryName: "Seragam", createdAt: new Date("2026-06-08"), status: "DICATAT" },
  { id: "v3", description: "Bolos jam pelajaran", points: 15, categoryName: "Bolos", createdAt: new Date("2026-06-05"), status: "DIPROSES" },
  { id: "v4", description: "Merokok di lingkungan sekolah", points: 25, categoryName: "Merokok", createdAt: new Date("2026-06-01"), status: "DIPROSES" },
  { id: "v5", description: "Membuang sampah sembarangan", points: 5, categoryName: "Kebersihan", createdAt: new Date("2026-05-28"), status: "SELESAI" },
];

const MOCK_VIOLATIONS_S2 = [
  { id: "v6", description: "Terlambat masuk sekolah", points: 10, categoryName: "Terlambat", createdAt: new Date("2026-06-09"), status: "DICATAT" },
  { id: "v7", description: "Tidak mengerjakan PR", points: 5, categoryName: "Tugas", createdAt: new Date("2026-06-07"), status: "SELESAI" },
  { id: "v8", description: "Menggunakan HP saat jam pelajaran", points: 7, categoryName: "HP", createdAt: new Date("2026-06-03"), status: "SELESAI" },
];

const MOCK_LETTERS = [
  { id: "l1", letterNumber: "001/SP1/SMK-TEX/VI/2026", type: "SP1", status: "DITERBITKAN", createdAt: new Date("2026-06-10"), description: "Surat Peringatan 1 - Terlambat" },
  { id: "l2", letterNumber: "002/SP2/SMK-TEX/VI/2026", type: "SP2", status: "DRAFT", createdAt: new Date("2026-06-12"), description: "Surat Peringatan 2 - Merokok" },
];

const MOCK_NOTIFICATIONS = [
  { id: "n1", title: "Pelanggaran Baru", message: "Ahmad Rizki mencatat pelanggaran baru: Terlambat (10 poin)", type: "violation", read: false, createdAt: new Date("2026-06-10") },
  { id: "n2", title: "Update Status Kasus", message: "Kasus Ahmad Rizki diproses ke tahap Konseling BK", type: "case_update", read: false, createdAt: new Date("2026-06-09") },
  { id: "n3", title: "Surat Diterbitkan", message: "Surat SP1 untuk Ahmad Rizki telah diterbitkan", type: "letter", read: true, createdAt: new Date("2026-06-08") },
  { id: "n4", title: "Pembinaan Terjadwal", message: "Jadwal pembinaan STP2K untuk Siti Rahma", type: "coaching", read: true, createdAt: new Date("2026-06-07") },
];

const MOCK_TIMELINE = [
  { id: "t1", type: "violation", title: "Pelanggaran Dicatat", description: "Terlambat (10 poin)", date: new Date("2026-06-10"), studentName: "Ahmad Rizki" },
  { id: "t2", type: "case_update", title: "Kasus Diupdate", description: "Masuk tahap Konseling BK", date: new Date("2026-06-09"), studentName: "Ahmad Rizki" },
  { id: "t3", type: "letter", title: "Surat Diterbitkan", description: "SP1 - Surat Peringatan 1", date: new Date("2026-06-08"), studentName: "Ahmad Rizki" },
  { id: "t4", type: "coaching", title: "Pembinaan STP2K", description: "Pembinaan kedisiplinan", date: new Date("2026-06-07"), studentName: "Siti Rahma" },
  { id: "t5", type: "violation", title: "Pelanggaran Dicatat", description: "Bolos (15 poin)", date: new Date("2026-06-05"), studentName: "Ahmad Rizki" },
];

function fetchProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fullName: "Ahmad Rizki",
        nis: "12345",
        className: "XI RPL 1",
        jurusan: "Rekayasa Perangkat Lunak",
        totalPoints: 65,
        email: "ahmad@student.smktexmaco.sch.id",
      });
    }, 400);
  });
}

function TimelineIcon({ type }) {
  const styles = {
    violation: "bg-warning/10 text-warning",
    case_update: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    letter: "bg-primary/10 text-primary",
    coaching: "bg-accent/10 text-accent",
  };
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${styles[type] || "bg-gray-100 text-gray-500"}`}>
      <Clock className="h-4 w-4" />
    </div>
  );
}

function getThresholdInfo(points) {
  const thresholds = [
    { max: 24, label: "Aman", color: "bg-green-500" },
    { max: 49, label: "Pengawasan", color: "bg-yellow-500" },
    { max: 74, label: "Pembinaan", color: "bg-orange-500" },
    { max: 99, label: "Serius", color: "bg-red-500" },
    { max: Infinity, label: "Kritis", color: "bg-danger" },
  ];
  for (const t of thresholds) {
    if (points <= t.max) return t;
  }
  return thresholds[0];
}

function formatDate(date) {
  if (!date) return "-";
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function NotificationIcon({ type }) {
  const icons = {
    violation: AlertTriangle,
    case_update: Clock,
    letter: FileText,
    coaching: GraduationCap,
  };
  const Icon = icons[type] || Bell;
  return <Icon className="h-5 w-5" />;
}

// ─── POINT COLOR ─────────────────────────────────────────────────────
function getPointColor(points) {
  if (points <= 24) return "text-green-600 dark:text-green-400";
  if (points <= 49) return "text-yellow-600 dark:text-yellow-400";
  if (points <= 74) return "text-orange-600 dark:text-orange-400";
  if (points <= 99) return "text-red-600 dark:text-red-400";
  return "text-danger";
}

// ─── Parent View ─────────────────────────────────────────────────────
function ParentView() {
  const [selectedChild, setSelectedChild] = useState(null);

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted">Pilih anak untuk melihat detail pelanggaran dan perkembangan:</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {MOCK_CHILDREN.map((child) => {
            const threshold = getThresholdInfo(child.totalPoints);
            return (
              <Card key={child.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedChild(child)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{child.fullName}</h3>
                        <p className="text-sm text-muted">{child.className} • NIS: {child.nis}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted">Total Poin</p>
                      <p className={`text-lg font-bold ${getPointColor(child.totalPoints)}`}>
                        {child.totalPoints}
                      </p>
                    </div>
                    <StatusBadge status={child.caseStatus} />
                  </div>
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full transition-all ${threshold.color}`}
                        style={{ width: `${Math.min((child.totalPoints / 100) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted">Status: {threshold.label}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <Eye className="h-4 w-4" />
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {MOCK_TIMELINE.length === 0 ? (
              <EmptyState title="Belum ada aktivitas" description="Belum ada aktivitas yang tercatat" />
            ) : (
              <div className="space-y-4">
                {MOCK_TIMELINE.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <TimelineIcon type={item.type} />
                    <div className="flex-1 border-b border-border pb-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-muted">{item.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted">{item.studentName}</span>
                        <span className="text-xs text-muted">•</span>
                        <span className="text-xs text-muted">{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            {MOCK_NOTIFICATIONS.length === 0 ? (
              <EmptyState title="Tidak ada notifikasi" description="Belum ada notifikasi" icon={Bell} />
            ) : (
              <div className="space-y-2">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
                      notif.read ? "opacity-60" : "bg-primary/5"
                    }`}
                  >
                    <div className={`mt-0.5 ${notif.read ? "text-muted" : "text-primary"}`}>
                      <NotificationIcon type={notif.type} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${notif.read ? "text-muted" : "text-gray-900 dark:text-white"}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted">{notif.message}</p>
                      <p className="mt-1 text-xs text-muted">{formatDate(notif.createdAt)}</p>
                    </div>
                    {!notif.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Selected child detail view
  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => setSelectedChild(null)}>
        ← Kembali
      </Button>

      {/* Child Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedChild.fullName}</h2>
                <p className="text-sm text-muted">{selectedChild.className} • {selectedChild.jurusan}</p>
                <p className="text-sm text-muted">NIS: {selectedChild.nis}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Total Poin</p>
              <p className={`text-3xl font-bold ${getPointColor(selectedChild.totalPoints)}`}>
                {selectedChild.totalPoints}
              </p>
              <StatusBadge status={selectedChild.caseStatus} className="mt-1" />
            </div>
          </div>
          <div className="mt-4">
            {(() => {
              const threshold = getThresholdInfo(selectedChild.totalPoints);
              return (
                <>
                  <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded-full transition-all ${threshold.color}`}
                      style={{ width: `${Math.min((selectedChild.totalPoints / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">Ambang Batas: {threshold.label}</p>
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Violations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Pelanggaran</CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_VIOLATIONS_S1.length === 0 ? (
            <EmptyState title="Tidak ada pelanggaran" description="Siswa ini tidak memiliki catatan pelanggaran" icon={AlertTriangle} />
          ) : (
            <div className="space-y-2">
              {MOCK_VIOLATIONS_S1.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{v.description}</p>
                    <p className="text-xs text-muted">{v.categoryName} • {formatDate(v.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getPointColor(v.points)}`}>{v.points} poin</span>
                    <Badge variant={v.status === "SELESAI" ? "secondary" : "default"} className="text-[10px]">
                      {v.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Letters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Surat</CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_LETTERS.length === 0 ? (
            <EmptyState title="Belum ada surat" description="Belum ada surat yang diterbitkan" icon={FileText} />
          ) : (
            <div className="space-y-2">
              {MOCK_LETTERS.map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{l.letterNumber}</p>
                    <p className="text-xs text-muted">{l.description}</p>
                    <p className="text-xs text-muted">{formatDate(l.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={l.status === "DITERBITKAN" ? "default" : "secondary"} className="text-[10px]">
                      {l.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifikasi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <EmptyState title="Tidak ada notifikasi" description="Belum ada notifikasi" icon={Bell} />
          ) : (
            <div className="space-y-2">
              {MOCK_NOTIFICATIONS.slice(0, 3).map((notif) => (
                <div key={notif.id} className={`flex items-start gap-3 rounded-lg p-3 ${notif.read ? "" : "bg-primary/5"}`}>
                  <div className={`mt-0.5 ${notif.read ? "text-muted" : "text-primary"}`}>
                    <NotificationIcon type={notif.type} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${notif.read ? "text-muted" : "text-gray-900 dark:text-white"}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Student View ────────────────────────────────────────────────────
function StudentView() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["portal", "profile"],
    queryFn: fetchProfile,
  });

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const threshold = getThresholdInfo(profile.totalPoints);

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
                <p className="text-sm text-muted">{profile.className} • {profile.jurusan}</p>
                <p className="text-sm text-muted">NIS: {profile.nis}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Total Poin</p>
              <p className={`text-3xl font-bold ${getPointColor(profile.totalPoints)}`}>
                {profile.totalPoints}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">Progress Poin</span>
              <span className={`text-sm font-semibold ${getPointColor(profile.totalPoints)}`}>
                {threshold.label}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-3 rounded-full transition-all ${threshold.color}`}
                style={{ width: `${Math.min((profile.totalPoints / 100) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>0</span>
              <span>25 (STP2K)</span>
              <span>50 (BK)</span>
              <span>75 (Kesiswaan)</span>
              <span>100+ (Surat)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="violations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="violations">
            <AlertTriangle className="h-4 w-4" />
            Pelanggaran
          </TabsTrigger>
          <TabsTrigger value="letters">
            <FileText className="h-4 w-4" />
            Surat
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="violations">
          <Card>
            <CardContent className="p-0">
              {MOCK_VIOLATIONS_S1.length === 0 ? (
                <EmptyState title="Tidak ada pelanggaran" description="Anda tidak memiliki catatan pelanggaran" icon={AlertTriangle} />
              ) : (
                <div className="divide-y divide-border">
                  {MOCK_VIOLATIONS_S1.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{v.description}</p>
                        <p className="text-xs text-muted">{v.categoryName} • {formatDate(v.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getPointColor(v.points)}`}>{v.points} poin</span>
                        <Badge variant={v.status === "SELESAI" ? "secondary" : "default"} className="text-[10px]">
                          {v.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="letters">
          <Card>
            <CardContent className="p-0">
              {MOCK_LETTERS.length === 0 ? (
                <EmptyState title="Belum ada surat" description="Belum ada surat yang diterbitkan untuk Anda" icon={FileText} />
              ) : (
                <div className="divide-y divide-border">
                  {MOCK_LETTERS.map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{l.letterNumber}</p>
                        <p className="text-xs text-muted">{l.description}</p>
                        <p className="text-xs text-muted">{formatDate(l.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={l.status === "DITERBITKAN" ? "default" : "secondary"} className="text-[10px]">
                          {l.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-0">
              {MOCK_NOTIFICATIONS.length === 0 ? (
                <EmptyState title="Tidak ada notifikasi" description="Belum ada notifikasi" icon={Bell} />
              ) : (
                <div className="divide-y divide-border">
                  {MOCK_NOTIFICATIONS.map((notif) => (
                    <div key={notif.id} className={`p-4 ${notif.read ? "" : "bg-primary/5"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${notif.read ? "text-muted" : "text-primary"}`}>
                          <NotificationIcon type={notif.type} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${notif.read ? "text-muted" : "text-gray-900 dark:text-white"}`}>
                              {notif.title}
                            </p>
                            {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <p className="text-xs text-muted">{notif.message}</p>
                          <p className="mt-1 text-xs text-muted">{formatDate(notif.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_TIMELINE.length === 0 ? (
            <EmptyState title="Belum ada aktivitas" description="Belum ada aktivitas yang tercatat" />
          ) : (
            <div className="space-y-4">
              {MOCK_TIMELINE.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <TimelineIcon type={item.type} />
                  <div className="flex-1 border-b border-border pb-3 last:border-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-muted">{item.description}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Loading State ───────────────────────────────────────────────────
function PortalLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-1 h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ─── Main Portal Page ────────────────────────────────────────────────
export default function PortalPage() {
  const { userData } = useAuth();
  const isParent = userData?.role === ROLES.ORANG_TUA;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isParent ? "Portal Orang Tua" : "Portal Siswa"}
        description={
          isParent
            ? "Pantau perkembangan dan pelanggaran putra/putri Anda"
            : "Lihat perkembangan dan riwayat pelanggaran Anda"
        }
      />

      {isParent ? <ParentView /> : <StudentView />}
    </div>
  );
}
