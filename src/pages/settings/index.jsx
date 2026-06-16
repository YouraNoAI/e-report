import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  Search,
  ToggleLeft,
  ToggleRight,
  School,
  Tags,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
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
import PageHeader from "../../components/shared/PageHeader";
import EmptyState from "../../components/shared/EmptyState";
import LoadingState from "../../components/shared/LoadingState";
import ErrorState from "../../components/shared/ErrorState";
import DataTable from "../../components/shared/DataTable";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../../hooks/useCategories";
import { useUsers, useUpdateUser } from "../../hooks/useUsers";
import { categorySchema } from "../../schemas/categorySchema";
import { ROLE_LABELS, ROLES } from "../../constants/roles";
import { toast } from "../../components/ui/toast";

// ─── School Settings Schema ──────────────────────────────────────────
const schoolSchema = z.object({
  schoolName: z.string().min(2, "Nama sekolah minimal 2 karakter"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  phone: z.string().min(8, "Nomor telepon minimal 8 karakter"),
  email: z.string().email("Email tidak valid"),
  principalName: z.string().min(3, "Nama kepala sekolah minimal 3 karakter"),
});

// ─── Severity Badge Styles ───────────────────────────────────────────
const SEVERITY_STYLES = {
  ringan: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  sedang: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  berat: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const ROLE_BADGE_STYLES = {
  [ROLES.ADMIN]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  [ROLES.GURU_BK]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  [ROLES.STP2K]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  [ROLES.WALI_KELAS]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  [ROLES.KESISWAAN]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  [ROLES.ORANG_TUA]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  [ROLES.SISWA]: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

// ─── General Settings Tab ────────────────────────────────────────────
function GeneralTab() {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      schoolName: "SMK Texmaco",
      address: "Jl. Raya Texmaco No. 1, Semarang",
      phone: "024-12345678",
      email: "info@smktexmaco.sch.id",
      principalName: "Dr. H. Ahmad Fauzi, M.Pd.",
    },
  });

  const [poinThresholds, setPoinThresholds] = useState({
    pembinaanMin: 25,
    bkMin: 50,
    kesiswaanMin: 75,
    suratMin: 100,
  });

  const [letterFormat, setLetterFormat] = useState("{no}/{type}/SMK-TEX/{month}/{year}");

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast({ title: "Berhasil", description: "Pengaturan umum telah disimpan" });
  };

  return (
    <div className="space-y-6">
      {/* School Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil Sekolah</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schoolName">Nama Sekolah</Label>
                <Input id="schoolName" {...register("schoolName")} />
                {errors.schoolName && (
                  <p className="text-xs text-danger">{errors.schoolName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-xs text-danger">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="principalName">Kepala Sekolah</Label>
                <Input id="principalName" {...register("principalName")} />
                {errors.principalName && (
                  <p className="text-xs text-danger">{errors.principalName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <textarea
                id="address"
                {...register("address")}
                className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.address && (
                <p className="text-xs text-danger">{errors.address.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Point Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Konfigurasi Ambang Batas Poin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Pembinaan STP2K (min)</Label>
              <Input
                type="number"
                value={poinThresholds.pembinaanMin}
                onChange={(e) => setPoinThresholds((p) => ({ ...p, pembinaanMin: +e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Konseling BK (min)</Label>
              <Input
                type="number"
                value={poinThresholds.bkMin}
                onChange={(e) => setPoinThresholds((p) => ({ ...p, bkMin: +e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Proses Kesiswaan (min)</Label>
              <Input
                type="number"
                value={poinThresholds.kesiswaanMin}
                onChange={(e) => setPoinThresholds((p) => ({ ...p, kesiswaanMin: +e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Pembuatan Surat (min)</Label>
              <Input
                type="number"
                value={poinThresholds.suratMin}
                onChange={(e) => setPoinThresholds((p) => ({ ...p, suratMin: +e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              toast({ title: "Berhasil", description: "Ambang batas poin telah disimpan" });
            }}>
              <Save className="h-4 w-4" />
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Letter Number Format */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Format Nomor Surat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Format</Label>
            <Input
              value={letterFormat}
              onChange={(e) => setLetterFormat(e.target.value)}
            />
            <p className="text-xs text-muted">
              Gunakan {"{no}"}, {"{type}"}, {"{month}"}, {"{year}"} sebagai placeholder
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted">
              Contoh: <span className="font-mono text-foreground">001/SP1/SMK-TEX/VI/2026</span>
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              toast({ title: "Berhasil", description: "Format nomor surat telah disimpan" });
            }}>
              <Save className="h-4 w-4" />
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Category Form Schema ────────────────────────────────────────────
const categoryFormSchema = z.object({
  code: z.string().min(2, "Kode minimal 2 karakter"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  points: z.coerce.number().min(1, "Poin minimal 1"),
  severity: z.enum(["ringan", "sedang", "berat"]),
  description: z.string().optional(),
});

// ─── Categories Tab ──────────────────────────────────────────────────
function CategoriesTab() {
  const { data: categories, isLoading, error, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { severity: "ringan" },
  });

  const openAdd = () => {
    setEditingCategory(null);
    reset({ code: "", name: "", points: "", severity: "ringan", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    reset({
      code: cat.code,
      name: cat.name,
      points: cat.points,
      severity: cat.severity,
      description: cat.description || "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data: formData });
        toast({ title: "Berhasil", description: "Kategori diperbarui" });
      } else {
        await createCategory.mutateAsync(formData);
        toast({ title: "Berhasil", description: "Kategori ditambahkan" });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast({ title: "Berhasil", description: "Kategori dihapus" });
      setDeleteConfirm(null);
    } catch {
      toast({ title: "Gagal", description: "Gagal menghapus kategori", variant: "destructive" });
    }
  };

  const columns = [
    { accessorKey: "code", header: "Kode" },
    { accessorKey: "name", header: "Nama Kategori" },
    {
      accessorKey: "points",
      header: "Poin",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.original.points}</span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLES[row.original.severity] || ""}`}>
          {row.original.severity}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(row.original)}>
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </div>
      ),
    },
  ];

  if (error) return <ErrorState message="Gagal memuat kategori" onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <DataTable columns={columns} data={categories || []} loading={isLoading} searchPlaceholder="Cari kategori..." />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Ubah data kategori pelanggaran" : "Tambahkan kategori pelanggaran baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Kode</Label>
                <Input {...register("code")} placeholder="TLB" />
                {errors.code && <p className="text-xs text-danger">{errors.code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Poin</Label>
                <Input type="number" {...register("points")} placeholder="10" />
                {errors.points && <p className="text-xs text-danger">{errors.points.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input {...register("name")} placeholder="Terlambat" />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <select
                {...register("severity")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ringan">Ringan</option>
                <option value="sedang">Sedang</option>
                <option value="berat">Berat</option>
              </select>
              {errors.severity && <p className="text-xs text-danger">{errors.severity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Deskripsi (Opsional)</Label>
              <textarea
                {...register("description")}
                className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Deskripsi kategori..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCategory ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori "{deleteConfirm?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirm?.id)}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── User Form Schema ────────────────────────────────────────────────
const userFormSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  role: z.string().min(1, "Pilih role"),
});

// ─── Users Tab ───────────────────────────────────────────────────────
function UsersTab() {
  const { data: users, isLoading, error, refetch } = useUsers();
  const updateUser = useUpdateUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userFormSchema),
  });

  const openAdd = () => {
    setEditingUser(null);
    reset({ fullName: "", email: "", password: "", role: "" });
    setDialogOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    reset({ fullName: user.fullName, email: user.email, password: "", role: user.role });
    setDialogOpen(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const data = { ...formData };
      if (!data.password) delete data.password;
      if (editingUser) {
        await updateUser.mutateAsync({ id: editingUser.id, data });
        toast({ title: "Berhasil", description: "Data pengguna diperbarui" });
      } else {
        toast({ title: "Info", description: "Fitur tambah pengguna akan segera tersedia" });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user) => {
    setTogglingId(user.id);
    try {
      await updateUser.mutateAsync({ id: user.id, data: { isActive: !user.isActive } });
      toast({ title: "Berhasil", description: `Pengguna ${user.isActive ? "dinonaktifkan" : "diaktifkan"}` });
    } catch {
      toast({ title: "Gagal", description: "Gagal mengubah status", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const columns = [
    { accessorKey: "fullName", header: "Nama" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE_STYLES[row.original.role] || ""}`}>
          {ROLE_LABELS[row.original.role] || row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.original.isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {row.original.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Terakhir Login",
      cell: ({ row }) => (
        <span className="text-muted text-xs">{formatDate(row.original.lastLogin)}</span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleActive(row.original)}
            disabled={togglingId === row.original.id}
          >
            {togglingId === row.original.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : row.original.isActive ? (
              <ToggleRight className="h-4 w-4 text-warning" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-muted" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  if (error) return <ErrorState message="Gagal memuat pengguna" onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <DataTable columns={columns} data={users || []} loading={isLoading} searchPlaceholder="Cari pengguna..." />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit Pengguna" : "Tambah Pengguna"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Ubah data pengguna" : "Tambahkan pengguna baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input {...register("fullName")} placeholder="John Doe" />
              {errors.fullName && <p className="text-xs text-danger">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} placeholder="john@example.com" />
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{editingUser ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}</Label>
              <Input type="password" {...register("password")} placeholder="Minimal 6 karakter" />
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                {...register("role")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Pilih Role</option>
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {errors.role && <p className="text-xs text-danger">{errors.role.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingUser ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Settings Page ──────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola pengaturan aplikasi, kategori, dan pengguna"
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <School className="h-4 w-4" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tags className="h-4 w-4" />
            Kategori Pelanggaran
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4" />
            Pengguna
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
