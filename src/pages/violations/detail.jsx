import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowLeft,
  AlertTriangle,
  Trash2,
  Pencil,
  Calendar,
  User,
  Scale,
  FileText,
  Image as ImageIcon,
  File,
  Clock,
  Shield,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useViolation, useDeleteViolation } from "../../hooks/useViolations";
import { useStudent } from "../../hooks/useStudents";
import { useCategories } from "../../hooks/useCategories";
import { useCaseByStudent } from "../../hooks/useCases";
import { ROLES, CASE_STATUS_LABELS } from "../../constants";
import { cn } from "../../lib/utils";
import PageHeader from "../../components/shared/PageHeader";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import StatusBadge from "../../components/shared/StatusBadge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { toast } from "../../components/ui/toast";

function formatDateTime(date) {
  if (!date) return "-";
  const d = date.toDate ? date.toDate() : new Date(date);
  return format(d, "dd MMM yyyy HH:mm", { locale: id });
}

function formatDate(date) {
  if (!date) return "-";
  const d = date.toDate ? date.toDate() : new Date(date);
  return format(d, "dd MMM yyyy", { locale: id });
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1 space-y-0.5">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({ date, title, description, status, isLast }) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            status === "SELESAI"
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-primary/10"
          )}
        >
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              status === "SELESAI"
                ? "bg-green-500"
                : "bg-primary"
            )}
          />
        </div>
        {!isLast && (
          <div className="mt-1 w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
      <div className="flex-1 space-y-1 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </p>
          {status && <StatusBadge status={status} />}
        </div>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {date && (
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {date}
          </p>
        )}
      </div>
    </div>
  );
}

function DeleteConfirmDialog({ open, onOpenChange, onConfirm, loading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Hapus Pelanggaran</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pelanggaran ini? Tindakan ini tidak
            dapat dibatalkan dan poin siswa akan dikurangi.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ViolationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(ROLES.ADMIN);

  const { data: violation, isLoading, error, refetch } = useViolation(id);
  const { data: student } = useStudent(violation?.studentId);
  const { data: categories } = useCategories();
  const { data: cases } = useCaseByStudent(violation?.studentId);
  const deleteViolation = useDeleteViolation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const category = useMemo(() => {
    if (!categories || !violation) return null;
    return categories.find((c) => c.id === violation.categoryId);
  }, [categories, violation]);

  const caseTimeline = useMemo(() => {
    if (!cases || !violation) return [];
    return cases.filter((c) => c.violationId === id);
  }, [cases, violation, id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteViolation.mutateAsync(id);
      toast({
        title: "Berhasil",
        description: "Pelanggaran berhasil dihapus",
      });
      navigate("/violations");
    } catch (err) {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Memuat data pelanggaran..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (!violation) {
    return (
      <ErrorState
        message="Pelanggaran tidak ditemukan"
        onRetry={() => navigate("/violations")}
      />
    );
  }

  const isImage = violation.evidence?.match(/\.(jpg|jpeg|png|gif|webp)/i);
  const isPdf = violation.evidence?.match(/\.pdf$/i);

  return (
    <div>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/violations")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Detail Pelanggaran
              </h1>
              <p className="text-sm text-gray-500">
                {formatDateTime(violation.createdAt)}
              </p>
            </div>
          </div>
        }
        actions={
          isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </div>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pelanggaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border dark:divide-gray-700">
                <DetailRow
                  icon={AlertTriangle}
                  label="Kategori"
                  value={
                    <Badge variant="outline">
                      {category?.name || violation.categoryName || violation.categoryId}
                    </Badge>
                  }
                />
                <DetailRow
                  icon={Scale}
                  label="Poin"
                  value={
                    <span className="font-bold text-warning">
                      {violation.points || 0}
                    </span>
                  }
                />
                <DetailRow
                  icon={Calendar}
                  label="Tanggal Pelanggaran"
                  value={formatDate(violation.violationDate)}
                />
                <DetailRow
                  icon={Calendar}
                  label="Dicatat Pada"
                  value={formatDateTime(violation.createdAt)}
                />
                <DetailRow
                  icon={User}
                  label="Pelapor"
                  value={violation.reportedByName || violation.reportedBy || "-"}
                />
                <DetailRow
                  icon={FileText}
                  label="Deskripsi"
                  value={
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {violation.description || "Tidak ada deskripsi"}
                    </p>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {violation.evidence && (
            <Card>
              <CardHeader>
                <CardTitle>Bukti Pelanggaran</CardTitle>
              </CardHeader>
              <CardContent>
                {isImage ? (
                  <a
                    href={violation.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={violation.evidence}
                      alt="Evidence"
                      className="max-h-96 w-auto rounded-lg border border-border object-contain"
                    />
                  </a>
                ) : isPdf ? (
                  <a
                    href={violation.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10">
                      <File className="h-5 w-5 text-danger" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Lihat Dokumen PDF
                      </p>
                      <p className="text-xs text-gray-400">
                        Klik untuk membuka di tab baru
                      </p>
                    </div>
                  </a>
                ) : (
                  <a
                    href={violation.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Lihat File Bukti
                      </p>
                      <p className="text-xs text-gray-400">
                        Klik untuk membuka di tab baru
                      </p>
                    </div>
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {caseTimeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline Kasus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {caseTimeline.map((c, idx) => (
                    <TimelineItem
                      key={c.id}
                      date={formatDateTime(c.createdAt)}
                      title={CASE_STATUS_LABELS[c.status] || c.status}
                      description={c.description}
                      status={c.status}
                      isLast={idx === caseTimeline.length - 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              {student ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-gray-400">NIS: {student.nis}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kelas</span>
                      <span className="font-medium">{student.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Jurusan</span>
                      <span className="font-medium">{student.major}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Poin</span>
                      <span className="font-bold text-warning">
                        {student.totalPoints || 0}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    <BookOpen className="h-4 w-4" />
                    Lihat Detail Siswa
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Data siswa tidak tersedia</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Lainnya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">ID Pelanggaran</span>
                <span className="font-mono text-xs text-gray-400">{id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">ID Siswa</span>
                <span className="font-mono text-xs text-gray-400">
                  {violation.studentId}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
