import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { coachingSchema } from "../../schemas/coachingSchema";
import { useCreateCoachingNote } from "../../hooks/useCoaching";
import { useStudents } from "../../hooks/useStudents";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

export default function AddCoachingPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const createCoachingNote = useCreateCoachingNote();
  const [studentSearch, setStudentSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(coachingSchema),
    defaultValues: {
      type: "STP2K",
      date: new Date(),
      notes: "",
      followUp: "",
      studentId: "",
    },
  });

  const selectedType = watch("type");
  const selectedStudentId = watch("studentId");

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!studentSearch) return students;
    const q = studentSearch.toLowerCase();
    return students.filter(
      (s) =>
        (s.name || s.nama || "").toLowerCase().includes(q) ||
        (s.nis || "").toLowerCase().includes(q)
    );
  }, [students, studentSearch]);

  const selectedStudent = useMemo(() => {
    if (!students || !selectedStudentId) return null;
    return students.find((s) => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const onSubmit = async (data) => {
    try {
      await createCoachingNote.mutateAsync({
        data: {
          ...data,
          date: data.date || new Date(),
          createdBy: userData?.uid || "",
          createdByName: userData?.name || userData?.displayName || "",
        },
        type: data.type,
      });
      toast({
        title: "Berhasil",
        description: "Catatan pembinaan berhasil ditambahkan",
      });
      navigate("/coaching");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: err.message || "Gagal menambahkan catatan pembinaan",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/coaching")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Tambah Catatan Pembinaan/Konseling
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Buat catatan pembinaan STP2K atau konseling BK untuk siswa
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Pembinaan</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="radio"
                    value="STP2K"
                    {...register("type")}
                    className="text-primary accent-primary"
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">STP2K</p>
                    <p className="text-xs text-gray-500">Pembinaan oleh tim STP2K</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="radio"
                    value="BK"
                    {...register("type")}
                    className="text-primary accent-primary"
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">BK</p>
                    <p className="text-xs text-gray-500">Konseling oleh Guru BK</p>
                  </div>
                </label>
              </div>
              {errors.type && (
                <p className="text-xs text-danger">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Siswa</Label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari siswa..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="max-h-40 overflow-y-auto rounded-lg border border-border">
                  {studentsLoading ? (
                    <div className="p-3 text-sm text-gray-500">Memuat siswa...</div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">Tidak ada siswa</div>
                  ) : (
                    filteredStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setValue("studentId", s.id, { shouldValidate: true });
                          setStudentSearch(s.name || s.nama || "");
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent/10 transition-colors ${
                          selectedStudentId === s.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {s.name || s.nama} — {s.nis || ""}
                        <span className="text-xs text-gray-400 ml-2">
                          {s.kelas || ""} {s.jurusan || ""}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
              {selectedStudent && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
                  <p className="text-sm font-medium text-primary">
                    {selectedStudent.name || selectedStudent.nama}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedStudent.nis} — {selectedStudent.kelas} {selectedStudent.jurusan}
                  </p>
                </div>
              )}
              <input type="hidden" {...register("studentId")} />
              {errors.studentId && (
                <p className="text-xs text-danger">{errors.studentId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <input
                type="date"
                id="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                onChange={(e) => setValue("date", new Date(e.target.value), { shouldValidate: true })}
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.date && (
                <p className="text-xs text-danger">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Pembinaan</Label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Deskripsikan catatan pembinaan atau konseling..."
                {...register("notes")}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
              {errors.notes && (
                <p className="text-xs text-danger">{errors.notes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUp">Tindak Lanjut (opsional)</Label>
              <textarea
                id="followUp"
                rows={3}
                placeholder="Rencana tindak lanjut..."
                {...register("followUp")}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
              {errors.followUp && (
                <p className="text-xs text-danger">{errors.followUp.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Catatan"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/coaching")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
