import { z } from "zod";

export const categorySchema = z.object({
  code: z.string().min(2, "Kode minimal 2 karakter"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  points: z.number().min(1, "Poin minimal 1"),
  severity: z.enum(["ringan", "sedang", "berat"], {
    required_error: "Tingkat severity wajib dipilih",
  }),
  description: z.string().optional(),
});
