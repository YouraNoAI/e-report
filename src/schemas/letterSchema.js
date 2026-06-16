import { z } from "zod";
import { LETTER_TYPES } from "../constants";

const letterTypeValues = Object.values(LETTER_TYPES);

export const letterSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  type: z.enum(letterTypeValues, {
    required_error: "Tipe surat wajib dipilih",
  }),
  templateId: z.string().optional(),
  notes: z.string().optional(),
});
