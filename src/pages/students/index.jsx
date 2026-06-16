import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  Pencil,
  GraduationCap,
  Users,
  BookOpen,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "../../hooks/useStudents";
import { studentSchema } from "../../schemas/studentSchema";
import { ROLES, POINT_THRESHOLDS } from "../../constants";
import { cn } from "../../lib/utils";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import StatusBadge from "../../components/shared/StatusBadge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { toast } from "../../components/ui/toast";

const CLASSES = [
  "X-1", "X-2", "X-3", "X-4", "X-5",
  "XI-1", "XI-2", "XI-3", "XI-4", "XI-5",
  "XII-1", "XII-2", "XII-3", "XII-4", "XII-5",
];

const MAJORS = ["RPL", "TKJ", "MM", "AKL", "OTKP", "BDP"];

function getPointColor(points) {
  if (points >= 100) return "text-danger font-bold";
  if (points >= 75) return "text-warning font-bold";
  if (points >= 50) return "text-orange-500 font-semibold";
  if (points >= 25) return "text-yellow-600 font-semibold";
  return "text-green-600 dark:text-green-400";
}

function getPointThreshold(points) {
  if (points >= 100) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  if (points >= 75) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
  if (points >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
}

function StudentFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  loading,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: defaultValues || {
      nis: "",
      fullName: "",
      className: "",
      major: "",
      gender: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data, () => {
      reset();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Siswa" : "Tambah Siswa"}
          </DialogTitle>
          <DialogDescription>
            Masukkan data siswa dengan lengkap dan benar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS</Label>
                <Input id="nis" {...register("nis")} />
                {errors.nis && (
                  <p className="text-xs text-danger">{errors.nis.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Pilih...</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-danger">{errors.gender.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-xs text-danger">{errors.fullName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="className">Kelas</Label>
                <select
                  id="className"
                  {...register("className")}
                  className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Pilih Kelas</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                {errors.className && (
                  <p className="text-xs text-danger">
                    {errors.className.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Jurusan</Label>
                <select
                  id="major"
                  {...register("major")}
                  className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Pilih Jurusan</option>
                  {MAJORS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {errors.major && (
                  <p className="text-xs text-danger">{errors.major.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentName">Nama Orang Tua (opsional)</Label>
              <Input id="parentName" {...register("parentName")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentPhone">No. Telepon (opsional)</Label>
                <Input id="parentPhone" {...register("parentPhone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email (opsional)</Label>
                <Input id="parentEmail" type="email" {...register("parentEmail")} />
                {errors.parentEmail && (
                  <p className="text-xs text-danger">
                    {errors.parentEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({ open, onOpenChange, student, onConfirm, loading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Hapus Siswa</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus <strong>{student?.fullName}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(student.id)}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StudentsPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(ROLES.ADMIN);

  const { data: students, isLoading, error, refetch } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => {
      const matchSearch =
        !searchTerm ||
        s.nis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = !classFilter || s.className === classFilter;
      const matchMajor = !majorFilter || s.major === majorFilter;
      return matchSearch && matchClass && matchMajor;
    });
  }, [students, searchTerm, classFilter, majorFilter]);

  const handleCreate = async (data, onSuccess) => {
    setFormLoading(true);
    try {
      await createStudent.mutateAsync(data);
      toast({ title: "Berhasil", description: "Siswa berhasil ditambahkan" });
      onSuccess();
    } catch (err) {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data, onSuccess) => {
    setFormLoading(true);
    try {
      await updateStudent.mutateAsync({
        id: editingStudent.id,
        data,
      });
      toast({ title: "Berhasil", description: "Data siswa berhasil diperbarui" });
      setEditingStudent(null);
      onSuccess();
    } catch (err) {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setFormLoading(true);
    try {
      await deleteStudent.mutateAsync(id);
      toast({ title: "Berhasil", description: "Siswa berhasil dihapus" });
      setDeleteDialogOpen(false);
      setDeletingStudent(null);
    } catch (err) {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const openEditDialog = (student) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingStudent(null);
    setDialogOpen(true);
  };

  const openDeleteDialog = (student) => {
    setDeletingStudent(student);
    setDeleteDialogOpen(true);
  };

  const getCaseStatusForPoints = (points) => {
    if (points >= 100) return "SURAT_DIBUAT";
    if (points >= 75) return "PROSES_KESISWAAN";
    if (points >= 50) return "KONSELING_BK";
    if (points >= 25) return "PEMBINAAN_STP2K";
    return null;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "nis",
        header: "NIS",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.nis}</span>
        ),
      },
      {
        accessorKey: "fullName",
        header: "Nama",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {row.original.fullName}
          </span>
        ),
      },
      {
        accessorKey: "className",
        header: "Kelas",
      },
      {
        accessorKey: "major",
        header: "Jurusan",
      },
      {
        accessorKey: "totalPoints",
        header: "Total Poin",
        cell: ({ row }) => {
          const points = row.original.totalPoints || 0;
          return (
            <span className={cn("font-semibold", getPointColor(points))}>
              {points}
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Status Kasus",
        cell: ({ row }) => {
          const points = row.original.totalPoints || 0;
          const status = getCaseStatusForPoints(points);
          if (!status) {
            return (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                -
              </span>
            );
          }
          return <StatusBadge status={status} />;
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/students/${row.original.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(row.original)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteDialog(row.original)}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [navigate, isAdmin]
  );

  if (isLoading) {
    return <LoadingState message="Memuat data siswa..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Data Siswa"
        description="Kelola data siswa sekolah"
        actions={
          isAdmin && (
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4" />
              Tambah Siswa
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
                placeholder="Cari NIS atau nama siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="flex h-9 rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Semua Kelas</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <select
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="flex h-9 rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Semua Jurusan</option>
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredStudents}
        searchPlaceholder="Cari di tabel..."
      />

      <StudentFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingStudent(null);
          }
        }}
        defaultValues={editingStudent}
        onSubmit={editingStudent ? handleUpdate : handleCreate}
        loading={formLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        student={deletingStudent}
        onConfirm={handleDelete}
        loading={formLoading}
      />
    </div>
  );
}
