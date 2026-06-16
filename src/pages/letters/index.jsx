import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Download, Eye, Calendar } from "lucide-react";
import { useLetters } from "../../hooks/useLetters";
import { useStudents } from "../../hooks/useStudents";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import StatusBadge from "../../components/shared/StatusBadge";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LETTER_TYPE_LABELS, LETTER_TYPES } from "../../constants/roles";

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

const COLUMNS = [
  {
    accessorKey: "letterNumber",
    header: "No. Surat",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="font-medium text-gray-900 dark:text-white text-sm">
          {row.original.letterNumber || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Jenis",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {LETTER_TYPE_LABELS[row.original.type] || row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "studentName",
    header: "Siswa",
    cell: ({ row }) => (
      <span className="text-gray-700 dark:text-gray-300">
        {row.original.studentName || "-"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{formatDate(row.original.createdAt)}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status === "FINAL" ? (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Final
        </Badge>
      ) : (
        <Badge variant="secondary">Draft</Badge>
      );
    },
  },
  {
    accessorKey: "createdByName",
    header: "Dibuat Oleh",
    cell: ({ row }) => (
      <span className="text-gray-600 dark:text-gray-400 text-sm">
        {row.original.createdByName || "-"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/letters/${row.original.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
        {row.original.fileUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              window.open(row.original.fileUrl, "_blank");
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
];

export default function LettersPage() {
  const navigate = useNavigate();
  const { data: lettersData, isLoading, error, refetch } = useLetters();
  const { data: students } = useStudents();

  const studentMap = useMemo(() => {
    if (!students) return {};
    return students.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [students]);

  const enrichedData = useMemo(() => {
    if (!lettersData) return [];
    return lettersData.map((item) => {
      const student = studentMap[item.studentId] || {};
      return {
        ...item,
        studentName: student.name || student.nama || "-",
      };
    });
  }, [lettersData, studentMap]);

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Arsip Surat"
        description="Kelola surat peringatan, perjanjian, dan panggilan orang tua"
        actions={
          <Button onClick={() => navigate("/letters/generate")}>
            <Plus className="h-4 w-4" />
            Buat Surat
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState message="Memuat arsip surat..." />
      ) : (
        <DataTable
          columns={COLUMNS}
          data={enrichedData}
          searchPlaceholder="Cari nomor surat atau siswa..."
          pageSize={10}
        />
      )}
    </div>
  );
}
