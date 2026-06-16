import { z } from "zod";

export const violationSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  violationDate: z.date({ required_error: "Tanggal pelanggaran wajib diisi" }),
  evidence: z.any().optional(),
});
