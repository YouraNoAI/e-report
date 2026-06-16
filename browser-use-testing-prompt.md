# Browser-Use Testing Prompt — E-Report SMK Texmaco Subang

## URL Aplikasi
```
https://e-report-4olu3rzlk-youranoais-projects.vercel.app
```

## Akun Test (semua password: `Password123!`)

| Role | Email | Name | Tugas Test |
|------|-------|------|------------|
| **Admin** | admin@smktexmaco.sch.id | Ahmad Hidayat | Full access, manage users & settings |
| **Guru BK 1** | gurubk1@smktexmaco.sch.id | Dewi Sartika | Melihat semua pelanggaran, manage kasus |
| **Guru BK 2** | gurubk2@smktexmaco.sch.id | Bambang Hermawan | Sama seperti Guru BK 1 |
| **STP2K 1** | stp2k1@smktexmaco.sch.id | Rina Marlina | Input pelanggaran, pembinaan, lihat siswa |
| **STP2K 2** | stp2k2@smktexmaco.sch.id | Hendra Gunawan | Sama seperti STP2K 1 |
| **Wali Kelas 1** | walikelas1@smktexmaco.sch.id | Siti Nurjanah | Lihat siswa kelasnya saja |
| **Wali Kelas 2** | walikelas2@smktexmaco.sch.id | Agus Prasetyo | Sama seperti Wali Kelas 1 |
| **Wali Kelas 3** | walikelas3@smktexmaco.sch.id | Fitri Handayani | Sama seperti Wali Kelas 1 |
| **Kesiswaan** | kesiswaan@smktexmaco.sch.id | Drs. H. Supriyono | Manage semua, edit/delete pelanggaran |
| **Orang Tua 1** | ortu1@smktexmaco.sch.id | Asep Rudi | Lihat anak: Rizky Pratama |
| **Orang Tua 2** | ortu2@smktexmaco.sch.id | Nina Marlina | Lihat anak: Anisa Putri |
| **Orang Tua 3** | ortu3@smktexmaco.sch.id | Cecep Hermawan | Lihat anak: Doni Saputra |
| **Siswa 1** | siswa1@smktexmaco.sch.id | Rizky Pratama | Lihat poin & kasus sendiri |
| **Siswa 2** | siswa2@smktexmaco.sch.id | Anisa Putri | Sama seperti Siswa 1 |
| **Siswa 3** | siswa3@smktexmaco.sch.id | Doni Saputra | Sama seperti Siswa 1 |

---

## Skenario Test Lengkap

### Test 1: Auth & RBAC

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 1.1 | Buka halaman login | Lihat form email + password + tombol "Masuk" |
| 1.2 | Login sebagai `admin@smktexmaco.sch.id` / `Password123!` | Redirect ke dashboard, lihat sidebar menu lengkap |
| 1.3 | Logout, login sebagai `siswa1@smktexmaco.sch.id` / `Password123!` | Sidebar terbatas (hanya lihat data sendiri) |
| 1.4 | Coba akses langsung `/admin/users` saat login sebagai siswa | Redirect ke halaman forbidden atau dashboard |
| 1.5 | Login sebagai `walikelas1@smktexmaco.sch.id` / `Password123!` | Sidebar Wali Kelas, hanya lihat siswa kelasnya |

### Test 2: Manajemen Pelanggaran (STP2K)

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 2.1 | Login sebagai `stp2k1@smktexmaco.sch.id` | Dashboard muncul |
| 2.2 | Klik menu "Catat Pelanggaran" | Form input pelanggaran muncul |
| 2.3 | Pilih siswa "Rizky Pratama", pilih kategori "Terlambat", submit | Toast sukses, data tersimpan |
| 2.4 | Buka halaman daftar pelanggaran | Pelanggaran baru muncul di tabel |
| 2.5 | Cek halaman profil siswa Rizky Pratama | Poin bertambah sesuai kategori |

### Test 3: Daftar Pelanggaran & Filter

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 3.1 | Login sebagai `admin@smktexmaco.sch.id` | Dashboard muncul |
| 3.2 | Buka menu "Pelanggaran" | Tabel dengan kolom: Nama, Kategori, Poin, Tanggal, Pelapor |
| 3.3 | Gunakan search field, cari "Rizky" | Tabel filter menampilkan data Rizky saja |
| 3.4 | Gunakan filter kategori (dropdown), pilih "Terlambat" | Tabel hanya menampilkan pelanggaran Terlambat |
| 3.5 | Klik sorting pada kolom "Tanggal" | Data terurut ascending/descending |
| 3.6 | Cek pagination — jika banyak data, navigasi halaman | Pindah halaman dengan benar |

### Test 4: Edit & Delete Pelanggaran (Role Check)

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 4.1 | Login sebagai `stp2k1@smktexmaco.sch.id` | — |
| 4.2 | Buka detail pelanggaran | Tombol edit/delete **tidak muncul** untuk STP2K |
| 4.3 | Login sebagai `admin@smktexmaco.sch.id` | — |
| 4.4 | Buka detail pelanggaran yang sama | Tombol edit dan delete muncul |
| 4.5 | Klik edit, ubah kategori, submit | Data berubah, toast sukses |
| 4.6 | Klik delete, konfirmasi | Data hilang, toast sukses |

### Test 5: Manajemen Kasus & Surat SP (BK)

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 5.1 | Login sebagai `gurubk1@smktexmaco.sch.id` | Dashboard muncul |
| 5.2 | Buka menu "Kasus" | Daftar kasus dengan status (terbuka/diproses/selesai) |
| 5.3 | Klik kasus yang ada | Detail kasus muncul: riwayat pelanggaran, poin total, pembinaan |
| 5.4 | Cari tombol "Buat Surat SP1" | Dialog konfirmasi muncul |
| 5.5 | Generate surat | Surat SP1 terbuat, status kasus berubah |
| 5.6 | Buka menu "Surat" | Surat SP1 muncul di daftar, bisa di-download/preview |

### Test 6: Dashboard & Grafik

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 6.1 | Login sebagai `admin@smktexmaco.sch.id` | Dashboard dengan kartu statistik: total siswa, total pelanggaran, total kasus, rata-rata poin |
| 6.2 | Cek grafik batang (pelanggaran per bulan) | Grafik muncul, sumbu X bulan, sumbu Y jumlah |
| 6.3 | Cek grafik pie (distribusi severity) | Pie chart: ringan/sedang/berat |
| 6.4 | Cek tabel "Pelanggaran Terbaru" | 5-10 baris terakhir muncul | 

### Test 7: Manajemen Siswa

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 7.1 | Login sebagai `admin@smktexmaco.sch.id` | — |
| 7.2 | Buka menu "Data Siswa" | Tabel semua siswa: NIS, Nama, Kelas, Jurusan, Poin Total |
| 7.3 | Klik salah satu siswa | Profil detail: data pribadi, riwayat pelanggaran, riwayat kasus, poin akumulasi |
| 7.4 | Search "RPL" di filter kelas | Hanya siswa RPL yang tampil |
| 7.5 | Klik sorting poin descending | Siswa dengan poin tertinggi di atas |

### Test 8: Notifikasi

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 8.1 | Login sebagai `walikelas1@smktexmaco.sch.id` | Icon bel notifikasi muncul di navbar |
| 8.2 | Klik icon bel | Dropdown notifikasi muncul (jika ada pelanggaran baru siswa di kelasnya) |
| 8.3 | Klik salah satu notifikasi | Redirect ke halaman relevan |

### Test 9: Pembinaan & Konseling

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 9.1 | Login sebagai `stp2k1@smktexmaco.sch.id` | — |
| 9.2 | Buka detail kasus siswa | Lihat tab "Pembinaan" |
| 9.3 | Klik "Tambah Pembinaan" | Form muncul: jenis (STP2K/BK), catatan, tindak lanjut |
| 9.4 | Isi form, submit | Catatan pembinaan tersimpan |
| 9.5 | Login sebagai `gurubk1@smktexmaco.sch.id` | — |
| 9.6 | Buka kasus yang sama, tab "Pembinaan" | Catatan STP2K terlihat (read-only) |
| 9.7 | Tambah catatan BK | Catatan BK tersimpan |

### Test 10: Settings & Konfigurasi

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 10.1 | Login sebagai `admin@smktexmaco.sch.id` | — |
| 10.2 | Buka menu "Pengaturan" | Halaman settings: kategor pelanggaran, template surat, batas poin |
| 10.3 | Edit batas poin SP1/SP2/SP3 | Simpan, data berubah |
| 10.4 | Tambah kategori pelanggaran baru | Kategori baru muncul di form input pelanggaran |

### Test 11: Dark Mode

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 11.1 | Login sebagai `admin@smktexmaco.sch.id` | — |
| 11.2 | Cari toggle dark/light mode di navbar/header | Toggle ada |
| 11.3 | Klik toggle ke dark mode | Semua halaman berubah ke dark theme |
| 11.4 | Refresh halaman | Dark mode persist (local storage atau cookie) |
| 11.5 | Klik toggle kembali ke light mode | Kembali ke light theme |

### Test 12: Laporan & Ekspor

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 12.1 | Login sebagai `admin@smktexmaco.sch.id` | — |
| 12.2 | Buka menu "Laporan" | Halaman laporan dengan filter periode, kelas, jenis |
| 12.3 | Filter laporan per bulan, submit | Data laporan muncul |
| 12.4 | Cari tombol ekspor (jika ada) | File ter-download |

### Test 13: Orang Tua View

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 13.1 | Login sebagai `ortu1@smktexmaco.sch.id` / `Password123!` | Dashboard orang tua |
| 13.2 | Lihat dashboard | Kartu info anak: nama, kelas, total poin, status |
| 13.3 | Buka menu "Pelanggaran Anak" | Tabel pelanggaran anak (Rizky Pratama) |
| 13.4 | Buka menu "Kasus Anak" | Riwayat kasus dan surat yang diterbitkan |

### Test 14: Responsive Design

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 14.1 | Buka aplikasi di viewport mobile (375x812) | Sidebar collapse jadi hamburger menu |
| 14.2 | Buka halaman dashboard | Kartu statistik stacking vertikal |
| 14.3 | Buka tabel pelanggaran | Tabel horizontal scroll atau card view |
| 14.4 | Buka aplikasi di tablet (768x1024) | Layout menyesuaikan, tidak broken |

### Test 15: Error Handling

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 15.1 | Login dengan email salah | Error message: "Email tidak terdaftar" atau "User not found" |
| 15.2 | Login dengan password salah | Error message: "Password salah" atau "Invalid password" |
| 15.3 | Submit form pelanggaran tanpa data | Validasi form: field wajib di-highlight, error message muncul |
| 15.4 | Akses route invalid `/halaman-tidak-ada` | Halaman 404 muncul |

---

## Format Laporan Hasil Test

Untuk setiap skenario, catat:

```
## Skenario: [Nama Skenario]

| Langkah | Status (✅/❌) | Catatan |
|---------|--------------|---------|
| 1.1 | ✅ | — |
| 1.2 | ❌ | Redirect ke halaman kosong, bukan dashboard |
| ... | ... | ... |

**Total:** X/XX lulus
**Issues Ditemukan:**
1. [URL/halaman] — [deskripsi issue]
2. ...
```

---

## Catatan Penting
- Semua akun sudah terdaftar di Firebase Auth dengan password `Password123!`
- Data seed sudah ada di Firestore (15 users, 12 students, 38 violations, dll.)
- Role diatur via Firebase Custom Claims
- Jika ada test yang gagal, catat URL, screenshot, dan console error
