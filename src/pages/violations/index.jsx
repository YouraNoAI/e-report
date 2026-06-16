import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Plus,
  Search,
  Eye,
  AlertTriangle,
  Filter,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useViolations } from "../../hooks/useViolations";
import { useCategories } from "../../hooks/useCategories";
import { useStudents } from "../../hooks/useStudents";
import { ROLES } from "../../constants";
import { cn } from "../../lib/utils";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

function formatDate(date) {
  if (!date) return "-";
  const d = date.toDate ? date.toDate() : new Date(date);
  return format(d, "dd MMM yyyy", { locale: id });
}

export default function ViolationsPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canAdd = hasRole(ROLES.ADMIN, ROLES.GURU_BK, ROLES.STP2K, ROLES.WALI_KELAS);

  const { data: violations, isLoading, error, refetch } = useViolations();
  const { data: categories } = useCategories();
  const { data: students } = useStudents();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");

  const classes = useMemo(() => {
    if (!students) return [];
    return [...new Set(students.map((s) => s.className))].sort();
  }, [students]);

  const studentMap = useMemo(() => {
    if (!students) return {};
    return students.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [students]);

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return categories.reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
  }, [categories]);

  const filteredViolations = useMemo(() => {
    if (!violations) return [];
    return violations.filter((v) => {
      const student = studentMap[v.studentId];
      const matchSearch =
        !searchTerm ||
        student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.nis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = !categoryFilter || v.categoryId === categoryFilter;
      const matchClass = !classFilter || student?.className === classFilter;
      return matchSearch && matchCategory && matchClass;
    });
  }, [violations, searchTerm, categoryFilter, classFilter, studentMap]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "student",
        header: "Siswa",
        cell: ({ row }) => {
          const student = studentMap[row.original.studentId];
          return (
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {student?.fullName || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">{student?.nis || ""}</p>
            </div>
          );
        },
      },
      {
        id: "category",
        header: "Kategori",
        cell: ({ row }) => {
          const cat = categoryMap[row.original.categoryId];
          return (
            <Badge variant="outline" className="whitespace-nowrap">
              {cat?.name || row.original.categoryId || "-"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "points",
        header: "Poin",
        cell: ({ row }) => (
          <span className="font-semibold text-warning">
            {row.original.points || 0}
          </span>
        ),
      },
      {
        id: "reportedBy",
        header: "Pelapor",
        cell: ({ row }) => (
          <span>{row.original.reportedByName || row.original.reportedBy || "-"}</span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/violations/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [navigate, studentMap, categoryMap]
  );

  if (isLoading) {
    return <LoadingState message="Memuat data pelanggaran..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Data Pelanggaran"
        description="Catat dan kelola pelanggaran siswa"
        actions={
          canAdd && (
            <Button onClick={() => navigate("/violations/new")}>
              <Plus className="h-4 w-4" />
              Tambah Pelanggaran
            </Button>
          )
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari siswa atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex h-9 rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Semua Kategori</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="flex h-9 rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Semua Kelas</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredViolations}
        searchPlaceholder="Cari di tabel..."
      />
    </div>
  );
}
