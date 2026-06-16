export const ROLES = {
  ADMIN: "admin",
  GURU_BK: "guru_bk",
  STP2K: "stp2k",
  WALI_KELAS: "wali_kelas",
  KESISWAAN: "kesiswaan",
  ORANG_TUA: "orang_tua",
  SISWA: "siswa",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.GURU_BK]: "Guru BK",
  [ROLES.STP2K]: "STP2K",
  [ROLES.WALI_KELAS]: "Wali Kelas",
  [ROLES.KESISWAAN]: "Kesiswaan",
  [ROLES.ORANG_TUA]: "Orang Tua",
  [ROLES.SISWA]: "Siswa",
};

export const CASE_STATUS = {
  DRAFT: "DRAFT",
  PELANGGARAN_DICATAT: "PELANGGARAN_DICATAT",
  PEMBINAAN_STP2K: "PEMBINAAN_STP2K",
  KONSELING_BK: "KONSELING_BK",
  PROSES_KESISWAAN: "PROSES_KESISWAAN",
  SURAT_DIBUAT: "SURAT_DIBUAT",
  ORANG_TUA_DIPANGGIL: "ORANG_TUA_DIPANGGIL",
  SELESAI: "SELESAI",
};

export const CASE_STATUS_LABELS = {
  [CASE_STATUS.DRAFT]: "Draft",
  [CASE_STATUS.PELANGGARAN_DICATAT]: "Pelanggaran Dicatat",
  [CASE_STATUS.PEMBINAAN_STP2K]: "Pembinaan STP2K",
  [CASE_STATUS.KONSELING_BK]: "Konseling BK",
  [CASE_STATUS.PROSES_KESISWAAN]: "Proses Kesiswaan",
  [CASE_STATUS.SURAT_DIBUAT]: "Surat Dibuat",
  [CASE_STATUS.ORANG_TUA_DIPANGGIL]: "Orang Tua Dipanggil",
  [CASE_STATUS.SELESAI]: "Selesai",
};

export const LETTER_TYPES = {
  SP1: "SP1",
  SP2: "SP2",
  SP3: "SP3",
  PERJANJIAN: "PERJANJIAN",
  PANGGILAN_ORANG_TUA: "PANGGILAN_ORANG_TUA",
  LAINNYA: "LAINNYA",
};

export const LETTER_TYPE_LABELS = {
  [LETTER_TYPES.SP1]: "Surat Peringatan 1",
  [LETTER_TYPES.SP2]: "Surat Peringatan 2",
  [LETTER_TYPES.SP3]: "Surat Peringatan 3",
  [LETTER_TYPES.PERJANJIAN]: "Surat Perjanjian",
  [LETTER_TYPES.PANGGILAN_ORANG_TUA]: "Panggilan Orang Tua",
  [LETTER_TYPES.LAINNYA]: "Lainnya",
};

export const NOTIFICATION_TYPES = {
  VIOLATION: "violation",
  CASE_UPDATE: "case_update",
  LETTER: "letter",
  PARENT_CALL: "parent_call",
  COACHING: "coaching",
};

export const POINT_THRESHOLDS = {
  PELANGGARAN_DICATAT: { min: 0, max: 24 },
  PEMBINAAN_STP2K: { min: 25, max: 49 },
  KONSELING_BK: { min: 50, max: 74 },
  PROSES_KESISWAAN: { min: 75, max: 99 },
  SURAT_DIBUAT: { min: 100, max: Infinity },
};
