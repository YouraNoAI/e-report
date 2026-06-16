import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, User, FileText, Shield, HeartHandshake } from "lucide-react";
import { useCoachingNotes } from "../../hooks/useCoaching";
import { useStudents } from "../../hooks/useStudents";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

const COLUMNS = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{formatDate(row.original.date)}</span>
      </div>
    ),
  },
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
          {row.original.studentNis && (
            <p className="text-xs text-gray-500">{row.original.studentNis}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipe",
    cell: ({ row }) => {
      const type = row.original.type;
      return type === "STP2K" ? (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
          STP2K
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          BK
        </Badge>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Catatan",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="truncate max-w-[200px] block">
          {row.original.notes || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdByName",
    header: "Dilakukan Oleh",
    cell: ({ row }) => (
      <span className="text-gray-700 dark:text-gray-300">
        {row.original.createdByName || "-"}
      </span>
    ),
  },
];

export default function CoachingPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { data: coachingData, isLoading, error, refetch } = useCoachingNotes();
  const { data: students } = useStudents();
  const [activeTab, setActiveTab] = useState("all");

  const studentMap = useMemo(() => {
    if (!students) return {};
    return students.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [students]);

  const enrichedData = useMemo(() => {
    if (!coachingData) return [];
    return coachingData.map((item) => {
      const student = studentMap[item.studentId] || {};
      return {
        ...item,
        studentName: student.name || student.nama || "-",
        studentNis: student.nis || "-",
      };
    });
  }, [coachingData, studentMap]);

  const filteredData = useMemo(() => {
    if (activeTab === "all") return enrichedData;
    return enrichedData.filter((item) => item.type === activeTab);
  }, [enrichedData, activeTab]);

  const canAdd = hasRole("admin", "stp2k", "guru_bk");

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Pembinaan & Konseling"
        description="Kelola catatan pembinaan STP2K dan konseling BK"
        actions={
          canAdd && (
            <Button onClick={() => navigate("/coaching/new")}>
              <Plus className="h-4 w-4" />
              Tambah Catatan
            </Button>
          )
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            Semua
          </TabsTrigger>
          <TabsTrigger value="STP2K" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Pembinaan STP2K
          </TabsTrigger>
          <TabsTrigger value="BK" className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            Konseling BK
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <LoadingState message="Memuat data pembinaan..." />
      ) : (
        <DataTable
          columns={COLUMNS}
          data={filteredData}
          searchPlaceholder="Cari siswa..."
          pageSize={10}
        />
      )}
    </div>
  );
}
