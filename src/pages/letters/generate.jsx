import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save, FileDown, Eye } from "lucide-react";
import { letterSchema } from "../../schemas/letterSchema";
import { useCreateLetter, useUpdateLetterStatus } from "../../hooks/useLetters";
import { useStudents } from "../../hooks/useStudents";
import { useAuth } from "../../contexts/AuthContext";
import { LETTER_TYPE_LABELS, LETTER_TYPES } from "../../constants/roles";
import { generateLetterNumber } from "../../services/letterService";
import { toast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

const LETTER_TYPE_OPTIONS = [
  { value: LETTER_TYPES.SP1, label: LETTER_TYPE_LABELS[LETTER_TYPES.SP1] },
  { value: LETTER_TYPES.SP2, label: LETTER_TYPE_LABELS[LETTER_TYPES.SP2] },
  { value: LETTER_TYPES.SP3, label: LETTER_TYPE_LABELS[LETTER_TYPES.SP3] },
  { value: LETTER_TYPES.PERJANJIAN, label: LETTER_TYPE_LABELS[LETTER_TYPES.PERJANJIAN] },
  { value: LETTER_TYPES.PANGGILAN_ORANG_TUA, label: LETTER_TYPE_LABELS[LETTER_TYPES.PANGGILAN_ORANG_TUA] },
];

const LETTER_CONTENT_TEMPLATES = {
  [LETTER_TYPES.SP1]: {
    subject: "Surat Peringatan Pertama (SP-1)",
    body: `Dengan ini memberikan peringatan pertama kepada siswa yang bersangkutan atas pelanggaran yang telah dilakukan. Diharapkan siswa yang bersangkutan dapat memperbaiki sikap dan perilaku serta tidak mengulangi pelanggaran yang sama.`,
  },
  [LETTER_TYPES.SP2]: {
    subject: "Surat Peringatan Kedua (SP-2)",
    body: `Dengan ini memberikan peringatan kedua kepada siswa yang bersangkutan. Mengingat surat peringatan pertama telah diberikan namun belum menunjukkan perubahan perilaku yang signifikan, maka dengan ini diberikan peringatan kedua.`,
  },
  [LETTER_TYPES.SP3]: {
    subject: "Surat Peringatan Ketiga (SP-3)",
    body: `Dengan ini memberikan peringatan ketiga dan terakhir kepada siswa yang bersangkutan. Apabila masih terjadi pelanggaran, maka akan dikenakan sanksi tegas sesuai dengan ketentuan yang berlaku di SMK Texmaco Subang.`,
  },
  [LETTER_TYPES.PERJANJIAN]: {
    subject: "Surat Perjanjian Siswa",
    body: `Yang bertanda tangan di bawah ini, siswa atas nama tersebut di atas, dengan ini menyatakan kesanggupan untuk mematuhi seluruh tata tertib SMK Texmaco Subang dan tidak akan mengulangi pelanggaran yang telah dilakukan. Apabila melanggar kembali, bersedia menerima sanksi sesuai ketentuan yang berlaku.`,
  },
  [LETTER_TYPES.PANGGILAN_ORANG_TUA]: {
    subject: "Panggilan Orang Tua/Wali Siswa",
    body: `Dengan ini mengharapkan kehadiran Bapak/Ibu Orang Tua/Wali dari siswa tersebut di atas untuk dapat hadir ke SMK Texmaco Subang guna membahas perkembangan dan permasalahan yang dihadapi oleh putra/putri Bapak/Ibu.`,
  },
};

function formatDateRoman(date) {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function LetterPreview({ type, student, date, notes, letterNumber, printRef }) {
  const template = LETTER_CONTENT_TEMPLATES[type] || { subject: "", body: "" };
  const displayDate = date ? formatDateRoman(date instanceof Date ? date : new Date(date)) : "...";
  const studentName = student?.name || student?.nama || "...";
  const studentNis = student?.nis || "...";
  const studentKelas = student?.kelas || "...";
  const studentJurusan = student?.jurusan || "...";

  return (
    <div ref={printRef} className="bg-white rounded-lg border border-border p-8 print:p-0 print:border-0 shadow-sm">
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
          Pemerintah Provinsi Jawa Barat
        </h1>
        <h2 className="text-xl font-bold text-gray-900 mt-1">
          SMK Texmaco Subang
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Jl. Raya Subang-Purwadadi Km. 18, Subang, Jawa Barat 41281
        </p>
        <p className="text-xs text-gray-600">
          Telp. (0260) 123456 | Email: info@smktexmacosubang.sch.id
        </p>
        <p className="text-xs text-gray-500 mt-1">
          NPSN: 20212345 | NSS: 401026301001
        </p>
      </div>

      <div className="mb-6 text-center">
        <h3 className="text-base font-bold text-gray-900 uppercase underline underline-offset-4">
          {template.subject}
        </h3>
        {letterNumber && (
          <p className="text-sm text-gray-600 mt-2">
            Nomor: {letterNumber}
          </p>
        )}
      </div>

      <div className="text-sm text-gray-900 space-y-2 mb-6">
        <p className="text-right">{displayDate}</p>
        <div className="mt-6 space-y-1">
          <p>Kepada Yth.</p>
          <p className="font-semibold">{studentName}</p>
          <p>NIS: {studentNis}</p>
          <p>Kelas: {studentKelas} {studentJurusan}</p>
          <p className="mt-4">di Tempat</p>
        </div>
      </div>

      <div className="text-sm text-gray-900 text-justify leading-relaxed space-y-3">
        <p>Dengan hormat,</p>
        <p className="indent-8">{template.body}</p>
        {notes && (
          <p className="indent-8 mt-2">
            Catatan tambahan: {notes}
          </p>
        )}
        <p className="indent-8 mt-2">
          Demikian surat ini dibuat untuk diketahui dan dilaksanakan dengan penuh tanggung jawab.
        </p>
      </div>

      <div className="mt-10 text-right">
        <p className="text-sm text-gray-900">Subang, {displayDate}</p>
        <div className="mt-16">
          <p className="text-sm font-semibold text-gray-900 underline underline-offset-4">
            Kepala SMK Texmaco Subang
          </p>
          <p className="text-sm text-gray-600 mt-8">_________________________</p>
          <p className="text-sm font-semibold text-gray-900">NIP. 19650101 199001 1 001</p>
        </div>
      </div>
    </div>
  );
}

export default function LetterGeneratePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userData } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const createLetter = useCreateLetter();
  const updateLetterStatus = useUpdateLetterStatus();
  const printRef = useRef(null);

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [letterNumber, setLetterNumber] = useState("");
  const [generatingNumber, setGeneratingNumber] = useState(false);
  const [previewTab, setPreviewTab] = useState("preview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(letterSchema),
    defaultValues: {
      type: searchParams.get("type") || "",
      studentId: searchParams.get("studentId") || "",
      notes: "",
    },
  });

  const selectedStudentId = watch("studentId");
  const notes = watch("notes");

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

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (selectedStudentId && selectedStudent && studentSearch !== (selectedStudent.name || selectedStudent.nama)) {
      setStudentSearch(selectedStudent.name || selectedStudent.nama || "");
    }
  }, [selectedStudentId, selectedStudent]);

  const fetchLetterNumber = useCallback(async (type) => {
    if (!type) return;
    setGeneratingNumber(true);
    try {
      const num = await generateLetterNumber(type);
      setLetterNumber(num);
    } catch {
      setLetterNumber("Error generating number");
    } finally {
      setGeneratingNumber(false);
    }
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetchLetterNumber(selectedType);
    } else {
      setLetterNumber("");
    }
  }, [selectedType, fetchLetterNumber]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setValue("type", type, { shouldValidate: true });
  };

  const saveLetter = async (status) => {
    if (!selectedStudentId || !selectedType) {
      toast({
        variant: "destructive",
        title: "Lengkapi Data",
        description: "Pilih siswa dan jenis surat terlebih dahulu",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const letterData = {
        studentId: selectedStudentId,
        type: selectedType,
        notes: notes || "",
        date: date,
        letterNumber: letterNumber,
        createdBy: userData?.uid || "",
        createdByName: userData?.name || userData?.displayName || "",
      };

      const result = await createLetter.mutateAsync(letterData);

      if (status === "FINAL") {
        await updateLetterStatus.mutateAsync({ id: result.id, status: "FINAL" });
      }

      toast({
        title: "Berhasil",
        description: `Surat berhasil ${status === "FINAL" ? "difinalisasi" : "disimpan sebagai draft"}`,
      });

      navigate("/letters");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: err.message || "Gagal menyimpan surat",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    saveLetter("DRAFT");
  };

  const handleFinalize = () => {
    saveLetter("FINAL");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/letters")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Generate Surat
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Buat surat peringatan, perjanjian, atau panggilan orang tua
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Surat</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label>Jenis Surat</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LETTER_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleTypeChange(opt.value)}
                        className={`text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                          selectedType === opt.value
                            ? "border-primary bg-primary/5 text-primary font-medium"
                            : "border-border text-gray-700 dark:text-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="text-xs text-danger">{errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentSearch">Siswa</Label>
                  <input
                    type="text"
                    id="studentSearch"
                    placeholder="Cari siswa..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <div className="max-h-36 overflow-y-auto rounded-lg border border-border divide-y divide-border">
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
                  <input type="hidden" {...register("studentId")} />
                  {errors.studentId && (
                    <p className="text-xs text-danger">{errors.studentId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nomor Surat</Label>
                  <div className="flex h-9 w-full items-center rounded-md border border-border bg-muted/30 px-3 text-sm text-gray-700 dark:text-gray-300">
                    {generatingNumber ? (
                      <span className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      letterNumber || "Pilih jenis surat terlebih dahulu"
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal Surat</Label>
                  <input
                    type="date"
                    id="date"
                    value={date.toISOString().split("T")[0]}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Tambahan (opsional)</Label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Catatan tambahan untuk surat..."
                    {...register("notes")}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Simpan Draft
                  </Button>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    className="flex-1"
                    onClick={handleFinalize}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )}
                    Finalisasi & Export
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 self-start">
          <div className="hidden lg:flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Pratinjau Surat
            </h3>
            <Button variant="ghost" size="sm" onClick={handlePrint}>
              <Eye className="h-4 w-4" />
              Cetak
            </Button>
          </div>

          <Tabs value={previewTab} onValueChange={setPreviewTab} className="mb-3">
            <TabsList className="w-full lg:hidden">
              <TabsTrigger value="preview" className="flex-1">
                <Eye className="h-4 w-4" />
                Pratinjau
              </TabsTrigger>
              <TabsTrigger value="form" className="flex-1">
                Form
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-0">
              {selectedType && selectedStudent ? (
                <LetterPreview
                  type={selectedType}
                  student={selectedStudent}
                  date={date}
                  notes={notes}
                  letterNumber={letterNumber}
                  printRef={printRef}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-border">
                  <FileDown className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-500">
                    Belum ada pratinjau
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Pilih jenis surat dan siswa untuk melihat pratinjau
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
