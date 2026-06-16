import { z } from "zod";

export const coachingSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  type: z.enum(["STP2K", "BK"], {
    required_error: "Tipe pembinaan wajib dipilih",
  }),
  notes: z.string().min(10, "Catatan minimal 10 karakter"),
  followUp: z.string().optional(),
  date: z.date({ required_error: "Tanggal wajib diisi" }),
});
