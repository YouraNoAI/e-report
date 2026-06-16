import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  Upload,
  X,
  File,
  Image,
  Loader2,
  Calendar,
} from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { useCategories } from "../../hooks/useCategories";
import { useCreateViolation } from "../../hooks/useViolations";
import { uploadEvidence } from "../../services/violationService";
import { violationSchema } from "../../schemas/violationSchema";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";
import PageHeader from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "../../components/ui/toast";

export default function AddViolationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId");
  const { userData } = useAuth();

  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createViolation = useCreateViolation();

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(violationSchema),
    defaultValues: {
      studentId: preselectedStudentId || "",
      categoryId: "",
      description: "",
      violationDate: new Date(),
      evidence: null,
    },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedStudentId = watch("studentId");

  const selectedCategory = useMemo(() => {
    if (!categories || !selectedCategoryId) return null;
    return categories.find((c) => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const selectedStudent = useMemo(() => {
    if (!students || !selectedStudentId) return null;
    return students.find((s) => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!studentSearch) return students;
    const q = studentSearch.toLowerCase();
    return students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(q) ||
        s.nis?.toLowerCase().includes(q)
    );
  }, [students, studentSearch]);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }, []);

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      let evidenceUrl = null;
      if (selectedFile) {
        setUploading(true);
        const path = `evidence/${Date.now()}_${selectedFile.name}`;
        evidenceUrl = await uploadEvidence(selectedFile, path);
        setUploading(false);
      }

      const violationData = {
        studentId: data.studentId,
        categoryId: data.categoryId,
        categoryName: selectedCategory?.name || "",
        points: selectedCategory?.points || 0,
        description: data.description,
        violationDate: data.violationDate,
        evidence: evidenceUrl,
        reportedBy: userData?.uid,
        reportedByName: userData?.fullName || userData?.email || "Unknown",
      };

      await createViolation.mutateAsync(violationData);
      toast({
        title: "Berhasil",
        description: "Pelanggaran berhasil dicatat",
      });
      navigate("/violations");
    } catch (err) {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/violations")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Tambah Pelanggaran
            </h1>
          </div>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Pelanggaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Siswa *</Label>
                  <Controller
                    name="studentId"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <div className="relative mb-2">
                          <Input
                            placeholder="Cari nama atau NIS..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="mb-0"
                          />
                        </div>
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Pilih siswa</option>
                          {filteredStudents.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.fullName} ({s.nis}) - {s.className}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />
                  {errors.studentId && (
                    <p className="text-xs text-danger">
                      {errors.studentId.message}
                    </p>
                  )}
                  {selectedStudent && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2">
                      <span className="font-medium">{selectedStudent.fullName}</span>
                      <span>•</span>
                      <span>{selectedStudent.nis}</span>
                      <span>•</span>
                      <span>{selectedStudent.className}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori Pelanggaran *</Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name} ({cat.points} poin)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.categoryId && (
                      <p className="text-xs text-danger">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Pelanggaran *</Label>
                    <Controller
                      name="violationDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          value={
                            field.value
                              ? format(
                                  field.value instanceof Date
                                    ? field.value
                                    : new Date(field.value),
                                  "yyyy-MM-dd"
                                )
                              : format(new Date(), "yyyy-MM-dd")
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      )}
                    />
                    {errors.violationDate && (
                      <p className="text-xs text-danger">
                        {errors.violationDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {selectedCategory && (
                  <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">
                        {selectedCategory.points}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedCategory.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Poin: {selectedCategory.points} •{" "}
                        {selectedCategory.description || "Tidak ada deskripsi"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Pelanggaran *</Label>
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={4}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground resize-y"
                    placeholder="Jelaskan kronologi pelanggaran secara detail..."
                  />
                  {errors.description && (
                    <p className="text-xs text-danger">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bukti Pelanggaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors",
                    selectedFile ? "bg-primary/5 border-primary/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                >
                  {selectedFile ? (
                    <div className="w-full space-y-3">
                      {filePreview ? (
                        <div className="relative mx-auto max-h-48 overflow-hidden rounded-lg">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="max-h-48 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-4">
                          <File className="h-10 w-10 text-primary" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="w-full"
                      >
                        <X className="h-4 w-4" />
                        Hapus File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Upload Bukti
                      </p>
                      <p className="text-xs text-gray-400 mt-1 mb-3">
                        PNG, JPG, PDF (max. 5 MB)
                      </p>
                      <label>
                        <span className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors">
                          Pilih File
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Siswa</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedStudent?.fullName || "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Kategori</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedCategory?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Poin</span>
                  <span className="font-bold text-warning">
                    {selectedCategory?.points || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Pelapor</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {userData?.fullName || userData?.email || "-"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/violations")}
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting || uploading}>
                {submitting || uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {uploading ? "Mengupload..." : "Menyimpan..."}
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
