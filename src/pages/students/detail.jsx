import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowLeft,
  Plus,
  Calendar,
  AlertTriangle,
  FileText,
  MessageSquare,
  Clock,
  User,
  BookOpen,
  Shield,
  Scale,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useStudent } from "../../hooks/useStudents";
import { useViolationsByStudent } from "../../hooks/useViolations";
import { useCoachingByStudent } from "../../hooks/useCoaching";
import { useLetters } from "../../hooks/useLetters";
import { useCaseByStudent } from "../../hooks/useCases";
import { ROLES, CASE_STATUS, CASE_STATUS_LABELS, LETTER_TYPE_LABELS } from "../../constants";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

function formatDate(date) {
  if (!date) return "-";
  const d = date.toDate ? date.toDate() : new Date(date);
  return format(d, "dd MMM yyyy", { locale: id });
}

function formatDateTime(date) {
  if (!date) return "-";
  const d = date.toDate ? date.toDate() : new Date(date);
  return format(d, "dd MMM yyyy HH:mm", { locale: id });
}

function SummaryCard({ icon: Icon, label, value, className }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            className || "bg-primary/10"
          )}
        >
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ date, title, description, status, icon: Icon, color }) {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            color || "bg-primary/10"
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
        </div>
        <div className="mt-1 w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 last:hidden" />
      </div>
      <div className="flex-1 space-y-1 pb-4">
        <div className="flex items-center gap-2">
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

function ViolationsTab({ studentId }) {
  const { data: violations, isLoading, error } = useViolationsByStudent(studentId);

  if (isLoading) return <LoadingState message="Memuat pelanggaran..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!violations?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tidak ada riwayat pelanggaran
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Poin</TableHead>
            <TableHead>Pelapor</TableHead>
            <TableHead>Deskripsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="whitespace-nowrap">
                {formatDateTime(v.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{v.categoryName || v.categoryId}</Badge>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-warning">{v.points}</span>
              </TableCell>
              <TableCell>{v.reportedByName || v.reportedBy || "-"}</TableCell>
              <TableCell className="max-w-xs truncate">
                {v.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CoachingTab({ studentId }) {
  const { data: coaching, isLoading, error } = useCoachingByStudent(studentId);

  if (isLoading) return <LoadingState message="Memuat pembinaan..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!coaching?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum ada catatan pembinaan atau konseling
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {coaching.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={c.type === "STP2K" ? "secondary" : "default"}>
                    {c.type === "STP2K" ? "Pembinaan STP2K" : "Konseling BK"}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {formatDateTime(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {c.notes || c.description}
                </p>
                {c.officerName && (
                  <p className="text-xs text-gray-400">
                    Oleh: {c.officerName}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LettersTab({ studentId }) {
  const { data: letters, isLoading, error } = useLetters();

  const studentLetters = letters?.filter((l) => l.studentId === studentId);

  if (isLoading) return <LoadingState message="Memuat surat..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!studentLetters?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum ada surat yang diterbitkan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {studentLetters.map((l) => (
        <Card key={l.id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge>{LETTER_TYPE_LABELS[l.letterType] || l.letterType}</Badge>
                  {l.letterNumber && (
                    <span className="text-xs text-gray-400">
                      {l.letterNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {l.description || "-"}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(l.createdAt)}
                </p>
              </div>
              {l.status && <StatusBadge status={l.status} />}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TimelineTab({ studentId }) {
  const { data: cases, isLoading, error } = useCaseByStudent(studentId);

  if (isLoading) return <LoadingState message="Memuat timeline..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!cases?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum ada aktivitas kasus
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-0">
          {cases.map((c, idx) => (
            <TimelineItem
              key={c.id}
              date={formatDateTime(c.createdAt)}
              title={CASE_STATUS_LABELS[c.status] || c.status}
              description={c.description}
              status={c.status}
              icon={AlertTriangle}
              color={
                c.status === CASE_STATUS.SELESAI
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-primary/10"
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const { data: student, isLoading, error, refetch } = useStudent(id);
  const canAddViolation = hasRole(
    ROLES.ADMIN,
    ROLES.GURU_BK,
    ROLES.STP2K,
    ROLES.WALI_KELAS
  );

  if (isLoading) return <LoadingState message="Memuat data siswa..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!student) {
    return (
      <ErrorState message="Data siswa tidak ditemukan" onRetry={() => navigate("/students")} />
    );
  }

  const points = student.totalPoints || 0;
  const getPointColorClass = () => {
    if (points >= 100) return "bg-red-50 dark:bg-red-900/20";
    if (points >= 75) return "bg-orange-50 dark:bg-orange-900/20";
    if (points >= 50) return "bg-yellow-50 dark:bg-yellow-900/20";
    if (points >= 25) return "bg-amber-50 dark:bg-amber-900/20";
    return "bg-green-50 dark:bg-green-900/20";
  };

  const getPointTextColor = () => {
    if (points >= 100) return "text-red-600 dark:text-red-400";
    if (points >= 75) return "text-orange-600 dark:text-orange-400";
    if (points >= 50) return "text-yellow-600 dark:text-yellow-400";
    if (points >= 25) return "text-amber-600 dark:text-amber-400";
    return "text-green-600 dark:text-green-400";
  };

  const getCaseStatus = () => {
    if (points >= 100) return "SURAT_DIBUAT";
    if (points >= 75) return "PROSES_KESISWAAN";
    if (points >= 50) return "KONSELING_BK";
    if (points >= 25) return "PEMBINAAN_STP2K";
    return null;
  };

  const caseStatus = getCaseStatus();

  return (
    <div>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/students")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {student.fullName}
              </h1>
              <p className="text-sm text-gray-500">NIS: {student.nis}</p>
            </div>
          </div>
        }
        actions={
          canAddViolation && (
            <Button onClick={() => navigate(`/violations/new?studentId=${id}`)}>
              <Plus className="h-4 w-4" />
              Tambah Pelanggaran
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <SummaryCard
          icon={Scale}
          label="Total Poin"
          value={
            <span className={getPointTextColor()}>{points}</span>
          }
          className={getPointColorClass()}
        />
        <SummaryCard
          icon={Shield}
          label="Status Kasus"
          value={
            caseStatus ? (
              <StatusBadge status={caseStatus} />
            ) : (
              <span className="text-sm text-gray-400">Normal</span>
            )
          }
          className="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard
          icon={BookOpen}
          label="Kelas / Jurusan"
          value={
            <span className="text-base">
              {student.className} / {student.major}
            </span>
          }
          className="bg-purple-50 dark:bg-purple-900/20"
        />
        <SummaryCard
          icon={User}
          label="Jenis Kelamin"
          value={student.gender === "L" ? "Laki-laki" : "Perempuan"}
          className="bg-teal-50 dark:bg-teal-900/20"
        />
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Nama Orang Tua</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.parentName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">No. Telepon</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.parentPhone || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.parentEmail || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="violations">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="violations">Riwayat Pelanggaran</TabsTrigger>
          <TabsTrigger value="coaching">Pembinaan / Konseling</TabsTrigger>
          <TabsTrigger value="letters">Surat</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Kasus</TabsTrigger>
        </TabsList>

        <TabsContent value="violations">
          <ViolationsTab studentId={id} />
        </TabsContent>

        <TabsContent value="coaching">
          <CoachingTab studentId={id} />
        </TabsContent>

        <TabsContent value="letters">
          <LettersTab studentId={id} />
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineTab studentId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
