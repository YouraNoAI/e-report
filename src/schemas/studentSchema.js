import { z } from "zod";

export const studentSchema = z.object({
  nis: z.string().min(3, "NIS minimal 3 karakter"),
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  className: z.string().min(1, "Kelas wajib diisi"),
  major: z.string().min(1, "Jurusan wajib diisi"),
  gender: z.enum(["L", "P"], { required_error: "Jenis kelamin wajib dipilih" }),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z
    .union([z.string().email("Email tidak valid"), z.literal("")])
    .optional(),
});
