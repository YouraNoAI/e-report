import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  HeartHandshake,
  FileText,
  Loader2,
  Send,
  BadgeCheck,
  User,
  Mail,
} from "lucide-react";
import { useCaseByStudent, useUpdateCaseStatus } from "../../hooks/useCases";
import { useViolationsByStudent } from "../../hooks/useViolations";
import { useCoachingByStudent } from "../../hooks/useCoaching";
import { useStudent } from "../../hooks/useStudents";
import { useAuth } from "../../contexts/AuthContext";
import { CASE_STATUS, CASE_STATUS_LABELS } from "../../constants/roles";
import { toast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button";
import StatusBadge from "../../components/shared/StatusBadge";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(timestamp) {
  if (!timestamp) return "-";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

const TIMELINE_STYLES = {
  violation: {
    dot: "bg-danger border-danger/30",
    line: "bg-danger/20",
    icon: AlertTriangle,
    label: "Pelanggaran",
  },
  coaching: {
    dot: "bg-blue-500 border-blue-500/30",
    line: "bg-blue-500/20",
    icon: HeartHandshake,
    label: "Pembinaan",
  },
  status: {
    dot: "bg-purple-500 border-purple-500/30",
    line: "bg-purple-500/20",
    icon: BadgeCheck,
    label: "Perubahan Status",
  },
  letter: {
    dot: "bg-emerald-500 border-emerald-500/30",
    line: "bg-emerald-500/20",
    icon: FileText,
    label: "Surat",
  },
};

function TimelineItem({ type, data, isLast }) {
  const style = TIMELINE_STYLES[type] || TIMELINE_STYLES.status;
  const Icon = style.icon;

  return (
    <div className="relative pb-8 last:pb-0">
      {!isLast && (
        <div
          className={`absolute left-[15px] top-8 h-full w-px ${style.line}`}
        />
      )}
      <div className="flex gap-4">
        <div
          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${style.dot}`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {style.label}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(data.date || data.createdAt)}
            </p>
          </div>
          {type === "violation" && (
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {data.description || data.notes || "-"}
              </p>
              {data.points != null && (
                <Badge variant="destructive" className="text-xs">
                  {data.points} Poin
                </Badge>
              )}
            </div>
          )}
          {type === "coaching" && (
            <div className="mt-1 space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {data.type === "STP2K" ? "Pembinaan STP2K" : "Konseling BK"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.notes || "-"}
              </p>
              {data.followUp && (
                <p className="text-xs text-gray-500 italic">
                  Tindak lanjut: {data.followUp}
                </p>
              )}
              {data.createdByName && (
                <p className="text-xs text-gray-400">
                  Oleh: {data.createdByName}
                </p>
              )}
            </div>
          )}
          {type === "status" && (
            <div className="mt-1">
              <StatusBadge status={data.newStatus || data.status} />
              {data.notes && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {data.notes}
                </p>
              )}
            </div>
          )}
          {type === "letter" && (
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {data.letterNumber || data.type || "Surat"}
              </p>
              <StatusBadge status={data.status || "DRAFT"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS_ORDER = [
  CASE_STATUS.PELANGGARAN_DICATAT,
  CASE_STATUS.PEMBINAAN_STP2K,
  CASE_STATUS.KONSELING_BK,
  CASE_STATUS.PROSES_KESISWAAN,
  CASE_STATUS.SURAT_DIBUAT,
  CASE_STATUS.ORANG_TUA_DIPANGGIL,
  CASE_STATUS.SELESAI,
];

export default function CaseDetailPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { userData, hasRole } = useAuth();

  const { data: caseData, isLoading: caseLoading, error: caseError, refetch: refetchCase } = useCaseByStudent(studentId);
  const { data: violations, isLoading: violationsLoading } = useViolationsByStudent(studentId);
  const { data: coachingData, isLoading: coachingLoading } = useCoachingByStudent(studentId);
  const { data: student, isLoading: studentLoading } = useStudent(studentId);
  const updateStatus = useUpdateCaseStatus();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const isLoading = caseLoading || violationsLoading || coachingLoading || studentLoading;
  const error = caseError;

  const timeline = useMemo(() => {
    const events = [];

    if (violations) {
      violations.forEach((v) => {
        events.push({ type: "violation", data: v, date: v.date || v.createdAt });
      });
    }

    if (coachingData) {
      coachingData.forEach((c) => {
        events.push({ type: "coaching", data: c, date: c.date || c.createdAt });
      });
    }

    if (caseData?.statusHistory) {
      caseData.statusHistory.forEach((sh) => {
        events.push({ type: "status", data: sh, date: sh.date || sh.createdAt });
      });
    }

    if (caseData?.letters) {
      caseData.letters.forEach((l) => {
        events.push({ type: "letter", data: l, date: l.date || l.createdAt });
      });
    }

    events.sort((a, b) => {
      const da = a.date ? (a.date.toDate ? a.date.toDate() : new Date(a.date)) : new Date(0);
      const db = b.date ? (b.date.toDate ? b.date.toDate() : new Date(b.date)) : new Date(0);
      return da - db;
    });

    return events;
  }, [violations, coachingData, caseData]);

  const totalPoints = useMemo(() => {
    if (!violations) return 0;
    return violations.reduce((sum, v) => sum + (v.points || 0), 0);
  }, [violations]);

  const handleStatusUpdate = useCallback(async () => {
    if (!selectedStatus) return;
    setUpdating(true);
    try {
      await updateStatus.mutateAsync({
        progressId: caseData?.id,
        status: selectedStatus,
        userId: userData?.uid,
        notes: `Status diperbarui oleh ${userData?.name || userData?.displayName || "User"}`,
      });
      toast({
        title: "Berhasil",
        description: `Status kasus diperbarui ke ${CASE_STATUS_LABELS[selectedStatus]}`,
      });
      setStatusDialogOpen(false);
      setSelectedStatus("");
      refetchCase();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: err.message || "Gagal memperbarui status",
      });
    } finally {
      setUpdating(false);
    }
  }, [selectedStatus, caseData, userData, updateStatus, refetchCase]);

  const availableStatuses = useMemo(() => {
    if (!caseData?.status) return STATUS_ORDER;
    const idx = STATUS_ORDER.indexOf(caseData.status);
    if (idx === -1) return STATUS_ORDER;
    return STATUS_ORDER.slice(idx + 1);
  }, [caseData?.status]);

  if (error) {
    return <ErrorState message={error.message} onRetry={refetchCase} />;
  }

  const handleAddCoaching = (type) => {
    navigate(`/coaching/new?studentId=${studentId}&type=${type}`);
  };

  const handleGenerateLetter = () => {
    navigate(`/letters/generate?studentId=${studentId}`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cases")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {isLoading ? "Memuat..." : (student?.name || student?.nama || "Detail Kasus")}
            </h1>
            {caseData?.status && <StatusBadge status={caseData.status} />}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {student?.nis || ""} — {student?.kelas || ""} {student?.jurusan || ""}
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat detail kasus..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timeline Kasus</CardTitle>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                      <AlertTriangle className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Belum ada aktivitas
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Timeline akan muncul setelah ada pelanggaran atau pembinaan
                    </p>
                  </div>
                ) : (
                  <div className="pl-2">
                    {timeline.map((event, idx) => (
                      <TimelineItem
                        key={idx}
                        type={event.type}
                        data={event.data}
                        isLast={idx === timeline.length - 1}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Poin</span>
                  <Badge
                    variant="secondary"
                    className={
                      totalPoints >= 100
                        ? "bg-danger/10 text-danger"
                        : totalPoints >= 50
                          ? "bg-warning/10 text-warning"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }
                  >
                    {totalPoints} Poin
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={caseData?.status || "DRAFT"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pelanggaran</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {violations?.length || 0} kali
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pembinaan</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {coachingData?.length || 0} kali
                  </span>
                </div>
              </CardContent>
            </Card>

            {(hasRole("admin", "stp2k", "guru_bk", "kesiswaan")) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasRole("admin", "stp2k") && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddCoaching("STP2K")}
                    >
                      <HeartHandshake className="h-4 w-4" />
                      Input Pembinaan STP2K
                    </Button>
                  )}
                  {hasRole("admin", "guru_bk") && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddCoaching("BK")}
                    >
                      <HeartHandshake className="h-4 w-4" />
                      Input Konseling BK
                    </Button>
                  )}
                  {hasRole("admin", "kesiswaan") && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setStatusDialogOpen(true)}
                      >
                        <BadgeCheck className="h-4 w-4" />
                        Update Status
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleGenerateLetter}
                      >
                        <FileText className="h-4 w-4" />
                        Generate Surat
                      </Button>
                    </>
                  )}
                  {hasRole("admin") && (
                    <>
                      <div className="border-t border-border pt-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Akses Admin</p>
                        {hasRole("admin") && !hasRole("stp2k") && (
                          <Button
                            variant="outline"
                            className="w-full justify-start text-xs"
                            onClick={() => handleAddCoaching("STP2K")}
                          >
                            <HeartHandshake className="h-4 w-4" />
                            Input Pembinaan STP2K
                          </Button>
                        )}
                        {hasRole("admin") && !hasRole("guru_bk") && (
                          <Button
                            variant="outline"
                            className="w-full justify-start text-xs mt-2"
                            onClick={() => handleAddCoaching("BK")}
                          >
                            <HeartHandshake className="h-4 w-4" />
                            Input Konseling BK
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Kasus</DialogTitle>
            <DialogDescription>
              Pilih status baru untuk kasus {student?.name || student?.nama || "siswa"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status baru..." />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {CASE_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!selectedStatus || updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
