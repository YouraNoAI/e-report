# E-Report Siswa SMK Texmaco

## Deskripsi Singkat

E-Report merupakan aplikasi pelaporan siswa berbasis web yang digunakan untuk mencatat pelanggaran siswa, mengelola poin pelanggaran, memantau perkembangan kasus siswa, membuat surat secara otomatis, serta membantu proses administrasi sekolah melalui sistem notifikasi dan pelaporan digital.

---

# Fitur Utama

## 1. Manajemen Pelanggaran Siswa

### Tujuan

Mempermudah proses pencatatan dan monitoring pelanggaran siswa secara terpusat.

### Fitur

- Input pelanggaran siswa
- Edit pelanggaran
- Riwayat pelanggaran siswa
- Kategori pelanggaran
- Upload bukti pelanggaran (opsional)
- Pencatatan waktu dan petugas

### Output

- Data pelanggaran tersimpan
- Riwayat pelanggaran siswa

---

## 2. Sistem Poin Pelanggaran

### Tujuan

Mengotomatisasi perhitungan poin berdasarkan jenis pelanggaran.

### Fitur

- Akumulasi poin otomatis
- Kategori pelanggaran dan poin
- Riwayat poin siswa
- Monitoring batas poin

### Output

- Total poin siswa
- Rekap poin per semester

---

## 3. Pembinaan dan Tindak Lanjut

### Tujuan

Mencatat proses pembinaan yang dilakukan kepada siswa.

### Fitur

- Catatan pembinaan siswa
- Catatan konseling
- Riwayat tindak lanjut
- Monitoring perkembangan kasus

### Output

- Riwayat pembinaan siswa
- Dokumentasi tindak lanjut

---

## 4. Status Progress / Log Kasus

### Tujuan

Memantau proses penanganan kasus siswa dari awal hingga selesai.

### Fitur

- Tracking status kasus
- Timeline penanganan
- Catatan setiap proses

### Contoh Status

- Pelanggaran Dicatat
- Pembinaan STP2K
- Konseling BK
- Diproses Kesiswaan
- Surat Dibuat
- Orang Tua Dipanggil
- Selesai

### Output

- Timeline perkembangan kasus

---

## 5. Generator Surat Otomatis

### Tujuan

Mengurangi pekerjaan administratif sekolah.

### Jenis Surat

- Surat Peringatan
- Surat Perjanjian
- Surat Panggilan Orang Tua

### Fitur

- Generate surat otomatis
- Template surat sekolah
- Export PDF
- Arsip surat

### Output

- Dokumen PDF siap cetak

---

## 6. Notifikasi

### Tujuan

Menyampaikan informasi secara cepat kepada pihak terkait.

### Penerima

- Guru BK
- Wali Kelas
- Kesiswaan
- Orang Tua
- Siswa

### Contoh Notifikasi

- Pelanggaran baru dicatat
- Status kasus berubah
- Surat telah dibuat
- Pemanggilan orang tua

---

## 7. Rekap dan Laporan

### Tujuan

Mempermudah proses pelaporan dan evaluasi pelanggaran siswa.

### Fitur

- Rekap harian
- Rekap bulanan
- Rekap semester
- Export PDF
- Export Excel
- Statistik pelanggaran

### Output

- Laporan pelanggaran siswa
- Statistik pelanggaran sekolah

---

# Workflow Sistem

## Workflow Penanganan Pelanggaran

```
Guru / Wali Kelas
        │
        ▼
Input Pelanggaran
        │
        ▼
Sistem Menambahkan Poin
        │
        ▼
STP2K
(Pembinaan Awal)
        │
        ▼
BK
(Konseling)
        │
        ▼
Kesiswaan
(Penentuan Tindakan)
        │
        ├── Surat Peringatan
        ├── Surat Perjanjian
        └── Pemanggilan Orang Tua
        │
        ▼
Kasus Ditutup
```

---

## Workflow Pembuatan Surat

```
Pilih Siswa
      │
      ▼
Pilih Jenis Surat
      │
      ▼
Isi Data Surat
      │
      ▼
Generate PDF
      │
      ▼
Review
      │
      ▼
Kirim ke Orang Tua
```

---

## Workflow Notifikasi

```
Perubahan Data
      │
      ▼
Sistem Membuat Notifikasi
      │
      ▼
Notifikasi Dikirim
      │
      ├── Guru
      ├── Orang Tua
      └── Siswa
```

---

# Role dan Hak Akses

## Admin

- Kelola pengguna
- Kelola master data
- Kelola template surat
- Monitoring sistem

## Guru BK

- Melihat seluruh pelanggaran
- Melakukan konseling
- Mengelola pembinaan
- Membuat surat
- Melihat laporan

## STP2K

- Melihat pelanggaran
- Melakukan pembinaan awal
- Mengelola tindak lanjut
- Memperbarui status kasus

## Wali Kelas

- Melihat siswa di kelasnya
- Monitoring poin siswa
- Melihat riwayat pelanggaran

## Kesiswaan

- Menentukan tindakan lanjutan
- Membuat keputusan kasus
- Membuat surat
- Melihat laporan sekolah

## Orang Tua

- Melihat riwayat pelanggaran anak
- Melihat surat
- Menerima notifikasi

## Siswa

- Melihat poin pribadi
- Melihat riwayat pelanggaran
- Melihat surat yang diterbitkan
- Menerima notifikasi

---

# Sitemap E-Report Siswa SMK Texmaco

```
E-REPORT SISWA
│
├── Login
│
├── Dashboard
│
├── Data Siswa
│   │
│   ├── Daftar Siswa
│   ├── Detail Siswa
│   └── Riwayat Pelanggaran
│
├── Pelanggaran
│   │
│   ├── Daftar Pelanggaran
│   ├── Tambah Pelanggaran
│   ├── Detail Pelanggaran
│   └── Kategori Pelanggaran
│
├── Pembinaan
│   │
│   ├── Daftar Pembinaan
│   ├── Tambah Pembinaan
│   └── Detail Pembinaan
│
├── Kasus
│   │
│   ├── Daftar Kasus
│   ├── Detail Kasus
│   └── Progress Kasus
│
├── Surat
│   │
│   ├── Surat Peringatan
│   ├── Surat Perjanjian
│   ├── Surat Panggilan Orang Tua
│   ├── Buat Surat
│   └── Arsip Surat
│
├── Notifikasi
│
├── Laporan
│   │
│   ├── Rekap Harian
│   ├── Rekap Bulanan
│   ├── Rekap Semester
│   └── Statistik Pelanggaran
│
├── Manajemen User
│   │
│   ├── Admin
│   ├── Guru BK
│   ├── STP2K
│   ├── Wali Kelas
│   ├── Kesiswaan
│   ├── Orang Tua
│   └── Siswa
│
├── Profil
│
└── Pengaturan
```

---

## Struktur Firestore Collection

```jsx
users
│
├── userId
│   ├── fullName
│   ├── email
│   ├── role
│   ├── position
│   ├── phone
│   ├── isActive
│   ├── createdAt
│   └── updatedAt
```

```jsx
students
│
├── studentId
│   ├── nis
│   ├── fullName
│   ├── className
│   ├── major
│   ├── gender
│   ├── parentName
│   ├── parentPhone
│   ├── totalPoints
│   ├── status
│   ├── createdAt
│   └── updatedAt
```

```jsx
violation_categories
│
├── categoryId
│   ├── code
│   ├── name
│   ├── points
│   ├── severity
│   └── description
```

```jsx
violations
│
├── violationId
│   ├── studentId
│   ├── categoryId
│   ├── reportedBy
│   ├── description
│   ├── evidenceUrl
│   ├── violationDate
│   ├── status
│   ├── createdAt
│   └── updatedAt
```

```jsx
case_progress
│
├── progressId
│   ├── violationId
│   ├── status
│   ├── notes
│   ├── updatedBy
│   └── createdAt
```

```jsx
coaching_notes
│
├── noteId
│   ├── studentId
│   ├── violationId
│   ├── createdBy
│   ├── title
│   ├── notes
│   └── createdAt
```

```jsx
letters
│
├── letterId
│   ├── studentId
│   ├── violationId
│   ├── templateId
│   ├── letterNumber
│   ├── type
│   ├── status
│   ├── pdfUrl
│   ├── generatedBy
│   └── createdAt
```

```jsx
letter_templates
│
├── templateId
│   ├── name
│   ├── type
│   ├── content
│   └── createdAt
```

```jsx
notifications
│
├── notificationId
│   ├── userId
│   ├── title
│   ├── message
│   ├── type
│   ├── isRead
│   └── createdAt
```

---

## DB Diagram

!dbdiagram.png

---

---

## Role Permission Matrix

| Fitur | Admin | BK | Wali Kelas | STP2K | Kesiswaan | Orang Tua | Siswa |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lihat Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Kelola User | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kelola Data Siswa | ✅ | ✅ | 👁️ | 👁️ | 👁️ | ❌ | ❌ |
| Lihat Detail Siswa | ✅ | ✅ | ✅ | ✅ | ✅ | Anak Sendiri | Diri Sendiri |
| Input Pelanggaran | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Pelanggaran | ✅ | ✅ | Milik Sendiri | Milik Sendiri | ❌ | ❌ | ❌ |
| Hapus Pelanggaran | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lihat Semua Pelanggaran | ✅ | ✅ | Kelas Sendiri | Semua | Semua | ❌ | ❌ |
| Kelola Kategori Pelanggaran | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Input Pembinaan | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Lihat Catatan Pembinaan | ✅ | ✅ | ✅ | ✅ | ✅ | Anak Sendiri | Diri Sendiri |
| Update Progress Kasus | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Generate Surat | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Download Surat | ✅ | ✅ | ✅ | ❌ | ✅ | Anak Sendiri | Diri Sendiri |
| Kelola Template Surat | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lihat Rekap Data | ✅ | ✅ | Kelas Sendiri | Semua | Semua | ❌ | ❌ |
| Export PDF | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Export Excel | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Kirim Notifikasi | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Terima Notifikasi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Assistant | ✅ | ✅ | ✅ | ✅ | ✅ | Terbatas | Terbatas |

---

## Daftar Status Kasus

Status Flow

```jsx
DRAFT
↓
PELANGGARAN_DICATAT
↓
PEMBINAAN_STP2K
↓
KONSELING_BK
↓
PROSES_KESISWAAN
↓
SURAT_DIBUAT
↓
ORANG_TUA_DIPANGGIL
↓
SELESAI
```

### Enum

```jsx
const CASE_STATUS = [
"DRAFT",
"PELANGGARAN_DICATAT",
"PEMBINAAN_STP2K",
"KONSELING_BK",
"PROSES_KESISWAAN",
"SURAT_DIBUAT",
"ORANG_TUA_DIPANGGIL",
"SELESAI",
];
```

---

## Daftar Kategori Pelanggaran

#### Karena data resmi sekolah belum ada, sementara gunakan data dummy.

| Kategori | Poin |
| --- | --- |
| Terlambat | 5 |
| Tidak memakai atribut lengkap | 5 |
| Rambut tidak sesuai aturan | 5 |
| Tidak membawa perlengkapan belajar | 5 |

---

## Daftar Jenis Surat

## Surat Peringatan

Digunakan untuk:

```
Akumulasi poin tertentu
Pelanggaran berulang
```

---

## Surat Perjanjian

Digunakan untuk:

```
Pelanggaran sedang
Pelanggaran berat
```

---

## Surat Panggilan Orang Tua

Digunakan untuk:

```
Kasus yang memerlukan kehadiran orang tua
```

---

## Enum

```
constLETTER_TYPES= [
"SURAT_PERINGATAN",
"SURAT_PERJANJIAN",
"SURAT_PANGGILAN_ORANG_TUA",
];
```
