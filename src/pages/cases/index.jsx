import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { useCases } from "../../hooks/useCases";
import { useStudents } from "../../hooks/useStudents";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import StatusBadge from "../../components/shared/StatusBadge";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import { Badge } from "../../components/ui/badge";

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

const COLUMNS = [
  {
    accessorKey: "studentName",
    header: "Siswa",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-400" />
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.original.studentName || "-"}
          </p>
          <p className="text-xs text-gray-500">
            {row.original.studentNis || ""}
            {row.original.studentKelas && ` — ${row.original.studentKelas}`}
            {row.original.studentJurusan && ` ${row.original.studentJurusan}`}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "totalPoints",
    header: "Total Poin",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={
          row.original.totalPoints >= 100
            ? "bg-danger/10 text-danger"
            : row.original.totalPoints >= 50
              ? "bg-warning/10 text-warning"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
        }
      >
        {row.original.totalPoints ?? 0} Poin
      </Badge>
    ),
  },
  {
    accessorKey: "lastViolation",
    header: "Pelanggaran Terakhir",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{formatDate(row.original.lastViolation)}</span>
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Terakhir Update",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{formatDate(row.original.updatedAt)}</span>
      </div>
    ),
  },
];

export default function CasesPage() {
  const navigate = useNavigate();
  const { data: casesData, isLoading, error, refetch } = useCases();
  const { data: students } = useStudents();

  const studentMap = useMemo(() => {
    if (!students) return {};
    return students.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [students]);

  const enrichedData = useMemo(() => {
    if (!casesData) return [];
    return casesData.map((item) => {
      const student = studentMap[item.studentId] || {};
      return {
        ...item,
        studentName: student.name || student.nama || "-",
        studentNis: student.nis || "-",
        studentKelas: student.kelas || "",
        studentJurusan: student.jurusan || "",
      };
    });
  }, [casesData, studentMap]);

  const handleRowClick = (row) => {
    navigate(`/cases/${row.original.studentId}`);
  };

  const columnsWithClick = COLUMNS.map((col) => ({
    ...col,
    cell: (props) => (
      <div className="cursor-pointer" onClick={() => handleRowClick(props.row)}>
        {col.cell ? col.cell(props) : props.getValue()}
      </div>
    ),
  }));

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Tracking Kasus"
        description="Pantau perkembangan kasus siswa secara menyeluruh"
      />

      {isLoading ? (
        <LoadingState message="Memuat data kasus..." />
      ) : (
        <DataTable
          columns={columnsWithClick}
          data={enrichedData}
          searchPlaceholder="Cari siswa..."
          pageSize={10}
        />
      )}
    </div>
  );
}
