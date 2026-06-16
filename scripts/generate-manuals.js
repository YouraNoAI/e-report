import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, ShadingType, WidthType,
  PageNumber, Header, Footer, PageBreak,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DELIVERABLES = path.resolve(__dirname, '..', 'deliverables');

const C = {
  primary: '#0F766E',
  primaryDark: '#115E59',
  accent: '#14B8A6',
  danger: '#DC2626',
  warning: '#F59E0B',
  success: '#16A34A',
  white: '#FFFFFF',
  black: '#1E293B',
  gray: '#64748B',
  lightGray: '#E2E8F0',
  lighterGray: '#F1F5F9',
};

const FONT = 'Calibri';

function h(level, text) {
  const sizes = { 1: 32, 2: 28, 3: 24 };
  const colors = { 1: C.primaryDark, 2: C.primary, 3: C.primary };
  const lvls = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 };
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: sizes[level], bold: true, color: colors[level] })],
    heading: lvls[level],
    spacing: { before: level === 1 ? 360 : 240, after: 120 },
  });
}

function p(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text, font: FONT, size: 22, color: C.black, ...opts })];
  return new Paragraph({
    children: runs,
    spacing: { after: opts.spacingAfter ?? 120, before: opts.spacingBefore ?? 0 },
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
  });
}

function b(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: 22, bold: true, color: C.black, ...opts });
}

function i(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: 22, italics: true, color: C.gray, ...opts });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22, color: C.black })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

function cell(text, opts = {}) {
  const isHeader = opts.isHeader || false;
  const bg = isHeader ? C.primary : (opts.shade ? C.lighterGray : C.white);
  const tc = isHeader ? C.white : C.black;
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: String(text), font: FONT, size: opts.size ?? 20, bold: isHeader || opts.bold || false, color: tc })],
      spacing: { before: 40, after: 40 },
      alignment: opts.alignment || AlignmentType.LEFT,
    })],
    shading: { type: ShadingType.CLEAR, color: bg, fill: bg },
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    verticalAlign: 'center',
  });
}

function row(cells, header = false) {
  return new TableRow({
    children: cells.map((c, i) => {
      if (typeof c === 'string') return cell(c, { isHeader: header, shade: header });
      return cell(c.text || '', { ...c, isHeader: header });
    }),
    tableHeader: header,
  });
}

function table(headers, data) {
  const rows = [row(headers, true)];
  data.forEach((d, ri) => {
    rows.push(row(d.map((c, ci) => {
      if (typeof c === 'object' && c.text !== undefined) return { ...c, shade: ri % 2 === 1 };
      return { text: String(c), shade: ri % 2 === 1 };
    })));
  });
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: C.lightGray },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.lightGray },
      left: { style: BorderStyle.SINGLE, size: 1, color: C.lightGray },
      right: { style: BorderStyle.SINGLE, size: 1, color: C.lightGray },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: C.lightGray },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: C.lightGray },
    },
  });
}

function spacer(h = 200) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [] });
}

function pageBrk() {
  return new Paragraph({ children: [new PageBreak()], spacing: { before: 0, after: 0 } });
}

function step(num, instruction, detail) {
  return [
    p([b(`Langkah ${num}: `), new TextRun({ text: instruction, font: FONT, size: 22, color: C.black })]),
    detail ? p(detail) : null,
  ].filter(Boolean);
}

function tip(text) {
  return p([b('Tip: '), i(text)]);
}

function warning(text) {
  return p([b('Perhatian: '), i(text)]);
}

// =========================================================
// USER MANUAL
// =========================================================
function buildUserManual() {
  const cover = [
    spacer(2400),
    new Paragraph({
      children: [new TextRun({ text: 'USER MANUAL', font: FONT, size: 48, bold: true, color: C.primaryDark })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'E-Report Siswa SMK Texmaco Subang', font: FONT, size: 36, bold: true, color: C.primary })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Panduan Penggunaan untuk Pengguna Akhir', font: FONT, size: 28, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    spacer(400),
    new Paragraph({
      children: [new TextRun({ text: 'Versi 1.0', font: FONT, size: 24, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'SMK Texmaco Subang', font: FONT, size: 24, bold: true, color: C.black })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Tahun Ajaran 2025/2026', font: FONT, size: 22, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    pageBrk(),
  ];

  const children = [
    h(1, '1. PENDAHULUAN'),
    h(2, '1.1 Tentang Dokumen Ini'),
    p('Dokumen ini merupakan panduan penggunaan sistem E-Report untuk pengguna akhir (end users). Dokumen ini menjelaskan cara mengakses dan menggunakan fitur-fitur utama sistem E-Report sesuai dengan peran masing-masing pengguna.'),

    h(2, '1.2 Tentang E-Report'),
    p('E-Report adalah sistem informasi pelaporan siswa berbasis web yang digunakan untuk mengelola pencatatan pelanggaran, pembinaan, konseling, tracking kasus, generator surat, notifikasi, dan pelaporan di SMK Texmaco Subang. Sistem ini dirancang untuk mempercepat proses administrasi, meningkatkan transparansi, dan memudahkan monitoring perkembangan siswa.'),

    h(2, '1.3 Hak Akses Pengguna'),
    p('Setiap pengguna memiliki hak akses yang berbeda sesuai dengan perannya. Berikut adalah ringkasan hak akses:'),
    table(['Role', 'Akses Utama'], [
      ['Admin', 'Akses penuh ke seluruh fitur sistem termasuk manajemen pengguna dan pengaturan'],
      ['Guru BK', 'Konseling, generate surat, laporan, data siswa, pelanggaran'],
      ['STP2K', 'Catatan pembinaan, pelanggaran, data siswa, laporan'],
      ['Wali Kelas', 'Monitoring siswa di kelasnya, pelanggaran, laporan'],
      ['Kesiswaan', 'Otorisasi surat, ubah status kasus, laporan, pelanggaran'],
      ['Orang Tua', 'Portal khusus untuk memantau data anak'],
      ['Siswa', 'Portal khusus untuk melihat data sendiri'],
    ]),

    pageBrk(),

    h(1, '2. MEMULAI APLIKASI'),
    h(2, '2.1 Cara Login'),
    step('1', 'Buka browser (Chrome, Firefox, Edge, atau Safari)'),
    step('2', 'Kunjungi alamat website E-Report yang diberikan oleh sekolah'),
    step('3', 'Pada halaman login, masukkan email dan password yang sudah didaftarkan oleh Admin'),
    step('4', 'Klik tombol "Login" atau tekan Enter'),
    step('5', 'Setelah berhasil login, Anda akan diarahkan ke halaman Dashboard sesuai dengan peran Anda'),
    tip('Jika Anda lupa password, klik tautan "Lupa Password?" pada halaman login untuk mereset password melalui email.'),
    warning('Pastikan Anda menggunakan email yang sudah terdaftar di sistem. Jika belum memiliki akun, hubungi Admin sekolah.'),

    h(2, '2.2 Cara Logout'),
    p('Klik ikon profil atau nama pengguna di pojok kanan atas, kemudian pilih menu "Logout" atau "Keluar". Sistem akan mengakhiri sesi login Anda dan mengembalikan ke halaman login.'),

    h(2, '2.3 Tampilan Utama (App Shell)'),
    p('Setelah login, Anda akan melihat tampilan utama yang terdiri dari tiga bagian:'),
    bullet('Topbar: Bagian atas yang menampilkan logo sekolah, nama sistem, pencarian cepat siswa, ikon notifikasi (bell), dan menu profil pengguna.'),
    bullet('Sidebar: Bagian kiri yang berisi menu navigasi. Menu yang tampil disesuaikan dengan peran Anda (RBAC).'),
    bullet('Main Content: Area tengah yang menampilkan konten halaman yang sedang diakses, dilengkapi dengan breadcrumb dan judul halaman.'),

    pageBrk(),

    h(1, '3. DASHBOARD'),
    h(2, '3.1 Ikhtisar Dashboard'),
    p('Halaman Dashboard menampilkan ringkasan informasi penting dalam bentuk widget:'),
    bullet('Total Siswa: Jumlah seluruh siswa yang terdaftar di sistem.'),
    bullet('Pelanggaran Hari Ini: Jumlah pelanggaran yang dicatat pada hari ini.'),
    bullet('Kasus Aktif: Jumlah kasus siswa yang masih dalam proses (belum SELESAI).'),
    bullet('Grafik Tren Pelanggaran: Grafik yang menunjukkan tren pelanggaran dalam periode mingguan atau bulanan.'),
    bullet('Top Kategori Pelanggaran: Daftar kategori pelanggaran yang paling sering terjadi.'),
    bullet('Siswa Poin Tertinggi: Daftar siswa dengan akumulasi poin tertinggi.'),

    h(2, '3.2 Filter Dashboard'),
    p('Anda dapat memfilter data pada dashboard dengan memilih periode waktu yang diinginkan. Beberapa widget mungkin menyediakan opsi filter tambahan seperti kelas atau jurusan.'),

    pageBrk(),

    h(1, '4. MELIHAT DATA SISWA'),
    h(2, '4.1 Daftar Siswa'),
    p('Menu "Data Siswa" menampilkan daftar seluruh siswa yang terdaftar. Halaman ini menyediakan:'),
    bullet('Pencarian: Cari siswa berdasarkan nama atau NIS melalui kolom pencarian di bagian atas.'),
    bullet('Filter: Filter siswa berdasarkan kelas dan/atau jurusan.'),
    bullet('Tabel: Menampilkan data siswa dalam bentuk tabel dengan kolom NIS, Nama, Kelas, Jurusan, Total Poin, Status Kasus, dan Aksi.'),
    bullet('Pagination: Navigasi halaman untuk data yang banyak.'),
    bullet('Sorting: Klik pada header kolom untuk mengurutkan data.'),

    h(2, '4.2 Detail Siswa'),
    p('Klik tombol "Detail" pada salah satu siswa untuk melihat informasi lengkap:'),
    bullet('Profil siswa (NIS, nama, kelas, jurusan, jenis kelamin, nama orang tua, kontak).'),
    bullet('Ringkasan: Total poin, status kasus terakhir, pelanggaran terbaru, surat terbaru.'),
    bullet('Tab Riwayat Pelanggaran: Daftar kronologis pelanggaran siswa.'),
    bullet('Tab Pembinaan/Konseling: Catatan pembinaan dan konseling siswa.'),
    bullet('Tab Surat: Daftar surat yang pernah diterbitkan untuk siswa.'),
    bullet('Tab Timeline Kasus: Kronologi lengkap penanganan kasus siswa.'),

    pageBrk(),

    h(1, '5. MELIHAT DAN MENCATAT PELANGGARAN'),
    h(2, '5.1 Melihat Daftar Pelanggaran'),
    p('Menu "Pelanggaran" menampilkan daftar seluruh pelanggaran yang tercatat di sistem. Anda dapat mencari, memfilter berdasarkan tanggal atau kategori, dan melihat detail setiap pelanggaran.'),

    h(2, '5.2 Mencatat Pelanggaran Baru'),
    p('Jika peran Anda memiliki akses untuk mencatat pelanggaran, ikuti langkah berikut:'),
    step('1', 'Klik tombol "+ Tambah Pelanggaran" pada halaman Pelanggaran atau dari halaman Detail Siswa.'),
    step('2', 'Pilih siswa yang melakukan pelanggaran melalui kolom pencarian siswa.'),
    step('3', 'Pilih kategori pelanggaran dari daftar yang tersedia. Poin akan terisi otomatis sesuai kategori.'),
    step('4', 'Masukkan tanggal dan waktu pelanggaran terjadi.'),
    step('5', 'Isi deskripsi pelanggaran secara lengkap dan jelas.'),
    step('6', 'Upload bukti pendukung (foto atau dokumen) jika ada. Format yang didukung: JPG, PNG, PDF.'),
    step('7', 'Klik tombol "Simpan" untuk menyimpan data pelanggaran.'),
    tip('Pastikan semua field wajib diisi sebelum menyimpan. Field wajib ditandai dengan tanda bintang (*).'),

    h(2, '5.3 Upload Bukti Pelanggaran'),
    p('Saat mencatat pelanggaran, Anda dapat melampirkan bukti berupa foto atau dokumen. Klik tombol "Choose File" atau "Pilih File" untuk mengunggah bukti. Ukuran file maksimal adalah 5MB.'),

    pageBrk(),

    h(1, '6. NOTIFIKASI'),
    h(2, '6.1 Cara Kerja Notifikasi'),
    p('Sistem E-Report akan mengirimkan notifikasi kepada pengguna terkait ketika terjadi event tertentu:'),
    bullet('Pelanggaran baru dicatat: Notifikasi dikirim ke Wali Kelas, Guru BK, Orang Tua, dan Siswa yang bersangkutan.'),
    bullet('Status kasus berubah: Notifikasi dikirim saat status kasus siswa berubah dari satu tahap ke tahap berikutnya.'),
    bullet('Surat dibuat: Notifikasi dikirim ketika surat peringatan atau panggilan orang tua diterbitkan.'),

    h(2, '6.2 Mengakses Notifikasi In-App'),
    p('Klik ikon bel (lonceng) di pojok kanan atas untuk membuka daftar notifikasi. Notifikasi yang belum dibaca akan ditandai dengan badge angka merah. Klik pada notifikasi untuk melihat detailnya.'),

    h(2, '6.3 Menandai Notifikasi sebagai Dibaca'),
    p('Untuk menandai notifikasi sebagai sudah dibaca, klik tombol "Tandai Dibaca" atau cukup klik notifikasi tersebut untuk membuka halaman terkait.'),

    pageBrk(),

    h(1, '7. PORTAL ORANG TUA DAN SISWA'),
    h(2, '7.1 Portal Orang Tua'),
    p('Pengguna dengan role Orang Tua memiliki portal khusus yang menampilkan:'),
    bullet('Data anak: Informasi lengkap putra/putri, termasuk kelas dan jurusan.'),
    bullet('Poin pelanggaran: Total poin dan rincian pelanggaran anak.'),
    bullet('Riwayat surat: Daftar surat yang diterbitkan untuk anak, termasuk tombol untuk mengunduh PDF.'),
    bullet('Notifikasi: Notifikasi terkait pelanggaran dan perkembangan anak.'),

    h(2, '7.2 Portal Siswa'),
    p('Pengguna dengan role Siswa memiliki portal khusus yang menampilkan:'),
    bullet('Data pribadi: Informasi diri dan kelas.'),
    bullet('Poin pelanggaran: Total poin dan rincian pelanggaran sendiri.'),
    bullet('Riwayat surat: Daftar surat yang diterbitkan untuk diri sendiri.'),
    bullet('Notifikasi: Notifikasi terkait pelanggaran dan perkembangan kasus.'),

    pageBrk(),

    h(1, '8. TROUBLESHOOTING UMUM'),
    h(2, '8.1 Tidak Bisa Login'),
    bullet('Periksa kembali email dan password yang Anda masukkan.'),
    bullet('Pastikan Caps Lock tidak aktif.'),
    bullet('Jika lupa password, gunakan fitur "Lupa Password" untuk mereset.'),
    bullet('Hubungi Admin jika akun Anda belum terdaftar atau dinonaktifkan.'),

    h(2, '8.2 Halaman Tidak Muncul atau Error'),
    bullet('Coba refresh halaman (tekan F5 atau Ctrl+R).'),
    bullet('Periksa koneksi internet Anda.'),
    bullet('Coba logout dan login kembali.'),
    bullet('Hubungi Admin jika masalah berlanjut.'),

    h(2, '8.3 Data Tidak Muncul'),
    bullet('Periksa apakah filter atau pencarian yang Anda terapkan sudah benar.'),
    bullet('Coba hapus filter dan refresh halaman.'),
    bullet('Pastikan Anda memiliki hak akses untuk melihat data tersebut.'),

    h(1, '9. KONTAK BANTUAN'),
    p('Jika Anda mengalami kendala dalam menggunakan sistem E-Report, silakan hubungi:'),
    bullet('Admin Sekolah: Hubungi bagian administrasi SMK Texmaco Subang.'),
    bullet('Tim Pengembang: Laporkan masalah teknis melalui laporan yang disediakan.'),
    p(' ', { spacingAfter: 200 }),
    p([i('Dokumen ini dapat diperbarui sewaktu-waktu. Pastikan Anda menggunakan versi terbaru.')]),
  ];

  return { cover, children };
}

// =========================================================
// ADMIN MANUAL
// =========================================================
function buildAdminManual() {
  const cover = [
    spacer(2400),
    new Paragraph({
      children: [new TextRun({ text: 'ADMIN MANUAL', font: FONT, size: 48, bold: true, color: C.primaryDark })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'E-Report Siswa SMK Texmaco Subang', font: FONT, size: 36, bold: true, color: C.primary })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Panduan Administrator Sistem', font: FONT, size: 28, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    spacer(400),
    new Paragraph({
      children: [new TextRun({ text: 'Versi 1.0', font: FONT, size: 24, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'SMK Texmaco Subang', font: FONT, size: 24, bold: true, color: C.black })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Tahun Ajaran 2025/2026', font: FONT, size: 22, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    pageBrk(),
  ];

  const children = [
    h(1, '1. PENDAHULUAN'),
    h(2, '1.1 Tentang Dokumen Ini'),
    p('Dokumen ini merupakan panduan administrasi sistem E-Report untuk pengguna dengan role Admin. Dokumen ini menjelaskan cara mengelola pengguna, master data, pengaturan sistem, dan tugas administratif lainnya.'),

    h(2, '1.2 Peran dan Tanggung Jawab Admin'),
    bullet('Mengelola data pengguna (membuat, mengedit, menonaktifkan akun).'),
    bullet('Mengelola master data kategori pelanggaran dan poin.'),
    bullet('Mengelola pengaturan sistem (threshold poin, format nomor surat, dll).'),
    bullet('Mengelola profil sekolah (kop surat, identitas sekolah).'),
    bullet('Memantau audit log aktivitas sistem.'),
    bullet('Melakukan backup dan maintenance data secara berkala.'),

    pageBrk(),

    h(1, '2. MANAJEMEN PENGGUNA'),
    h(2, '2.1 Mengakses Manajemen Pengguna'),
    p('Masuk ke menu "Settings" atau "Pengaturan" pada sidebar, kemudian pilih submenu "Users" atau "Pengguna". Halaman ini menampilkan daftar seluruh pengguna yang terdaftar di sistem.'),

    h(2, '2.2 Menambah Pengguna Baru'),
    step('1', 'Klik tombol "+ Tambah Pengguna" atau "Buat Pengguna Baru".'),
    step('2', 'Isi form dengan data pengguna: nama lengkap, email, role, posisi/jabatan, nomor telepon.'),
    step('3', 'Pilih role pengguna dengan benar karena akan menentukan hak aksesnya.'),
    step('4', 'Klik "Simpan" untuk membuat akun. Sistem akan mengirimkan email undangan kepada pengguna baru.'),
    tip('Pastikan email yang didaftarkan valid karena akan digunakan untuk login dan menerima notifikasi.'),
    warning('Pemberian role harus sesuai dengan tanggung jawab pengguna di sekolah. Role yang salah dapat menyebabkan kebocoran data atau akses tidak sah.'),

    h(2, '2.3 Mengedit Data Pengguna'),
    p('Klik tombol "Edit" pada pengguna yang ingin diubah datanya. Anda dapat mengubah nama, posisi, nomor telepon, dan role pengguna. Klik "Simpan" untuk menyimpan perubahan.'),

    h(2, '2.4 Menonaktifkan/Mengaktifkan Akun'),
    p('Untuk menonaktifkan akun pengguna (misalnya guru yang pindah atau siswa lulus), klik tombol "Nonaktifkan". Pengguna yang dinonaktifkan tidak dapat login ke sistem. Untuk mengaktifkan kembali, klik tombol "Aktifkan".'),

    h(2, '2.5 Menghapus Pengguna'),
    p('Hapus akun pengguna hanya dilakukan jika benar-benar diperlukan, karena akan menghapus semua data terkait. Sebaiknya nonaktifkan akun daripada menghapus untuk menjaga integritas data audit.'),

    pageBrk(),

    h(1, '3. MANAJEMEN KATEGORI PELANGGARAN'),
    h(2, '3.1 Mengakses Kategori Pelanggaran'),
    p('Masuk ke menu "Settings" > "Categories" atau "Kategori Pelanggaran". Halaman ini menampilkan daftar kategori pelanggaran beserta poin dan tingkat severity.'),

    h(2, '3.2 Menambah Kategori Baru'),
    step('1', 'Klik tombol "+ Tambah Kategori".'),
    step('2', 'Isi kode kategori (singkatan unik), nama kategori, poin, tingkat severity (Ringan/Sedang/Berat), dan deskripsi.'),
    step('3', 'Klik "Simpan" untuk menambahkan kategori.'),
    tip('Gunakan nama kategori yang jelas dan mudah dipahami oleh semua pengguna. Contoh: "Terlambat Masuk Sekolah", "Tidak Membawa Tugas", "Merokok di Lingkungan Sekolah".'),

    h(2, '3.3 Mengedit Kategori'),
    p('Klik tombol "Edit" pada kategori yang ingin diubah. Perubahan pada poin akan mempengaruhi perhitungan poin pelanggaran yang akan datang (tidak mempengaruhi data pelanggaran yang sudah ada).'),

    h(2, '3.4 Menghapus Kategori'),
    p('Klik tombol "Hapus" untuk menghapus kategori. Kategori yang sudah digunakan pada pelanggaran tidak dapat dihapus untuk menjaga integritas data.'),

    h(2, '3.5 Tips Pengaturan Poin'),
    bullet('Kategori Ringan: 1-10 poin (contoh: terlambat, atribut tidak lengkap).'),
    bullet('Kategori Sedang: 11-25 poin (contoh: membolos, tidak mengerjakan tugas).'),
    bullet('Kategori Berat: 26-50 poin (contoh: merokok, berkelahi, vandalisme).'),
    bullet('Sesuaikan poin dengan tingkat pelanggaran dan kebijakan sekolah.'),

    pageBrk(),

    h(1, '4. PENGATURAN SISTEM'),
    h(2, '4.1 Threshold Poin'),
    p('Menu "Settings" > "Threshold Poin" digunakan untuk mengatur ambang batas poin yang memicu perubahan status kasus secara otomatis:'),
    table(['Batas Bawah', 'Batas Atas', 'Status Kasus', 'Tindakan'], [
      ['0', '24', 'PELANGGARAN_DICATAT', 'Pembinaan oleh Wali Kelas'],
      ['25', '49', 'PEMBINAAN_STP2K', 'Peringatan lisan oleh STP2K'],
      ['50', '74', 'KONSELING_BK', 'Penerbitan SP1'],
      ['75', '99', 'PROSES_KESISWAAN', 'Penerbitan SP2, Panggilan Orang Tua'],
      ['100', '999', 'SURAT_DIBUAT', 'Penerbitan SP3 / Skorsing'],
    ]),
    p('Admin dapat menyesuaikan nilai threshold sesuai kebijakan sekolah.'),

    h(2, '4.2 Format Nomor Surat'),
    p('Admin dapat mengatur format nomor surat pada menu "Settings" > "Letter Number Format". Format default: {no_urut}/{kode_unit}/SMK-TEX/{bulan_romawi}/{tahun}. Variabel yang tersedia:'),
    bullet('{no_urut} - Nomor urut surat per jenis/periode.'),
    bullet('{kode_unit} - Kode unit/smk.'),
    bullet('{bulan_romawi} - Bulan dalam angka Romawi (I-XII).'),
    bullet('{tahun} - Tahun pembuatan surat.'),

    h(2, '4.3 Pengaturan Notifikasi'),
    p('Admin dapat mengaktifkan atau menonaktifkan channel notifikasi:'),
    bullet('In-App Notification: Selalu aktif.'),
    bullet('Email Notification: Aktifkan untuk mengirim notifikasi melalui email.'),
    bullet('WhatsApp Notification: Tersedia jika sudah diaktifkan (Phase 2).'),

    pageBrk(),

    h(1, '5. PROFIL SEKOLAH'),
    h(2, '5.1 Mengelola Profil Sekolah'),
    p('Menu "Settings" > "School Profile" digunakan untuk mengelola data profil sekolah yang akan muncul di kop surat dan header sistem:'),
    bullet('Nama sekolah lengkap.'),
    bullet('Alamat lengkap sekolah.'),
    bullet('Nomor telepon dan email sekolah.'),
    bullet('Logo sekolah (upload gambar).'),
    bullet('Kepala sekolah dan nama-nama pejabat.'),
    bullet('NPSN dan NSS sekolah.'),
    p('Pastikan data profil sekolah selalu terisi dengan benar karena akan digunakan dalam pembuatan surat resmi.'),

    pageBrk(),

    h(1, '6. AUDIT LOG'),
    h(2, '6.1 Mengakses Audit Log'),
    p('Menu "Settings" > "Audit Log" menampilkan log aktivitas seluruh pengguna. Data ini penting untuk:'),
    bullet('Melacak siapa yang melakukan perubahan data.'),
    bullet('Mendeteksi aktivitas mencurigakan.'),
    bullet('Audit kepatuhan terhadap prosedur operasional.'),
    bullet('Rekonsiliasi data jika terjadi kesalahan.'),

    h(2, '6.2 Filter Audit Log'),
    p('Anda dapat memfilter audit log berdasarkan:'),
    bullet('Rentang tanggal dan waktu.'),
    bullet('Pengguna (userId).'),
    bullet('Tipe aksi (login, tambah pelanggaran, edit, hapus, dll).'),
    bullet('Target (siswa, pelanggaran, surat, dll).'),

    pageBrk(),

    h(1, '7. BACKUP DAN MAINTENANCE'),
    h(2, '7.1 Backup Data'),
    p('Firestore secara otomatis melakukan backup data secara berkala. Namun, Admin disarankan untuk:'),
    bullet('Melakukan export data manual setiap akhir bulan.'),
    bullet('Menyimpan export data di lokasi yang aman (NAS/Cloud Storage).'),
    bullet('Melakukan export data sebelum melakukan perubahan besar pada sistem.'),

    h(2, '7.2 Export Data'),
    p('Untuk export data, gunakan menu "Settings" > "Export Data". Anda dapat mengekspor:'),
    bullet('Data siswa dalam format Excel.'),
    bullet('Data pelanggaran dalam format Excel.'),
    bullet('Data pengguna dalam format Excel.'),

    h(2, '7.3 Maintenance Berkala'),
    bullet('Periksa penggunaan penyimpanan Firebase Storage secara berkala.'),
    bullet('Hapus file bukti yang tidak diperlukan untuk menghemat penyimpanan.'),
    bullet('Periksa audit log untuk mendeteksi anomali.'),
    bullet('Pastikan semua akun pengguna masih aktif dan relevan.'),

    pageBrk(),

    h(1, '8. KEAMANAN SISTEM'),
    h(2, '8.1 Prinsip Keamanan'),
    bullet('Jangan pernah membagikan kredensial login Admin kepada siapa pun.'),
    bullet('Gunakan password yang kuat dan unik untuk akun Admin.'),
    bullet('Aktifkan Two-Factor Authentication (2FA) jika tersedia.'),
    bullet('Logout setelah selesai menggunakan sistem, terutama dari perangkat bersama.'),
    bullet('Laporkan aktivitas mencurigakan kepada tim pengembang.'),

    h(2, '8.2 Manajemen Akses'),
    bullet('Beri role pengguna sesuai dengan kebutuhan minimal (principle of least privilege).'),
    bullet('Nonaktifkan akun pengguna yang sudah tidak membutuhkan akses.'),
    bullet('Review daftar pengguna secara berkala.'),

    h(2, '8.3 Penanganan Insiden Keamanan'),
    p('Jika terjadi insiden keamanan (misalnya akun diretas, data bocor):'),
    step('1', 'Nonaktifkan akun yang terkena insiden.'),
    step('2', 'Ubah password semua akun terkait.'),
    step('3', 'Periksa audit log untuk melacak aktivitas mencurigakan.'),
    step('4', 'Hubungi tim pengembang untuk investigasi lebih lanjut.'),
    step('5', 'Dokumentasikan insiden dan tindakan yang diambil.'),

    pageBrk(),

    h(1, '9. TROUBLESHOOTING'),
    h(2, '9.1 Pengguna Tidak Bisa Login'),
    bullet('Periksa status akun pengguna (aktif/nonaktif).'),
    bullet('Verifikasi email pengguna sudah terdaftar dengan benar.'),
    bullet('Coba reset password dari menu edit pengguna.'),
    bullet('Periksa apakah akun Firebase Authentication masih aktif.'),

    h(2, '9.2 Data Tidak Konsisten'),
    bullet('Periksa audit log untuk melacak perubahan data.'),
    bullet('Jika poin tidak sesuai, periksa kategori pelanggaran dan riwayat perubahan.'),
    bullet('Hubungi tim pengembang jika diperlukan koreksi data manual.'),

    h(2, '9.3 Notifikasi Tidak Terkirim'),
    bullet('Periksa pengaturan notifikasi di Settings.'),
    bullet('Verifikasi email pengguna valid.'),
    bullet('Periksa quota pengiriman email Firebase.'),
    h(1, '10. CONTACT DAN DUKUNGAN'),
    p('Untuk dukungan teknis lebih lanjut, hubungi:'),
    bullet('Tim Pengembang: Laporkan melalui issue tracker atau kontak yang disediakan.'),
    bullet('Firebase Console: https://console.firebase.google.com/'),
    p(' ', { spacingAfter: 200 }),
    p([i('Dokumen ini bersifat rahasia dan hanya untuk konsumsi Admin sistem E-Report.')]),
  ];

  return { cover, children };
}

// =========================================================
// DEPLOYMENT GUIDE
// =========================================================
function buildDeploymentGuide() {
  const cover = [
    spacer(2400),
    new Paragraph({
      children: [new TextRun({ text: 'DEPLOYMENT GUIDE', font: FONT, size: 48, bold: true, color: C.primaryDark })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'E-Report Siswa SMK Texmaco Subang', font: FONT, size: 36, bold: true, color: C.primary })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Panduan Deployment untuk DevOps', font: FONT, size: 28, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    spacer(400),
    new Paragraph({
      children: [new TextRun({ text: 'Versi 1.0', font: FONT, size: 24, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'SMK Texmaco Subang', font: FONT, size: 24, bold: true, color: C.black })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Tahun Ajaran 2025/2026', font: FONT, size: 22, color: C.gray })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    pageBrk(),
  ];

  const children = [
    h(1, '1. PENDAHULUAN'),
    h(2, '1.1 Tentang Dokumen Ini'),
    p('Dokumen ini merupakan panduan deployment untuk sistem E-Report Siswa SMK Texmaco Subang. Panduan ini ditujukan bagi DevOps engineer atau administrator yang bertanggung jawab untuk melakukan deployment, konfigurasi, dan maintenance sistem di environment production.'),

    h(2, '1.2 Arsitektur Deployment'),
    p('E-Report menggunakan arsitektur deployment hybrid:'),
    bullet('Frontend: React JS SPA di-deploy ke Vercel atau Firebase Hosting.'),
    bullet('Backend: Firebase Services (Authentication, Firestore, Storage, Cloud Functions).'),
    bullet('Domain: Menggunakan domain sekolah atau subdomain yang telah ditentukan.'),

    pageBrk(),

    h(1, '2. PRASYARAT'),
    h(2, '2.1 Software Requirements'),
    p('Sebelum melakukan deployment, pastikan perangkat telah memenuhi persyaratan berikut:'),
    table(['No', 'Software', 'Versi Minimal', 'Keterangan'], [
      ['1', 'Node.js', '18.x atau lebih baru', 'Runtime JavaScript untuk build'],
      ['2', 'npm', '9.x atau lebih baru', 'Package manager'],
      ['3', 'Git', '2.x atau lebih baru', 'Version control'],
      ['4', 'Firebase CLI', '13.x atau lebih baru', 'Firebase deployment tool'],
      ['5', 'Vercel CLI (opsional)', 'Latest', 'Vercel deployment tool'],
      ['6', 'Browser Modern', 'Terbaru', 'Chrome/Firefox/Edge/Safari'],
    ]),

    h(2, '2.2 Akses yang Diperlukan'),
    bullet('Akses ke Firebase Console dengan role Owner atau Editor.'),
    bullet('Akses ke Vercel (jika menggunakan Vercel untuk hosting frontend).'),
    bullet('Akses ke domain registrar untuk konfigurasi DNS.'),
    bullet('Akses ke repository GitHub project E-Report.'),

    h(2, '2.3 Tools yang Direkomendasikan'),
    bullet('Visual Studio Code atau IDE lainnya.'),
    bullet('Firebase Emulator Suite untuk pengujian lokal.'),
    bullet('Postman atau Insomnia untuk API testing.'),
    bullet('Firebase Console untuk monitoring dan debugging.'),

    pageBrk(),

    h(1, '3. SETUP FIREBASE PROJECT'),
    h(2, '3.1 Membuat Firebase Project'),
    step('1', 'Buka Firebase Console di https://console.firebase.google.com/.'),
    step('2', 'Klik "Create a project" atau "Add project".'),
    step('3', 'Masukkan nama project, misalnya "e-report-texmaco-subang".'),
    step('4', 'Ikuti petunjuk untuk menyelesaikan pembuatan project.'),
    step('5', 'Setelah project dibuat, klik ikon gear (Settings) > "Project settings".'),
    step('6', 'Pada tab "General", catat Project ID Anda.'),
    tip('Gunakan Project ID yang konsisten untuk menghindari kebingungan di kemudian hari.'),

    h(2, '3.2 Mengaktifkan Layanan Firebase'),
    p('Aktifkan layanan-layanan berikut dari Firebase Console:'),
    table(['Layanan', 'Lokasi di Console', 'Konfigurasi Awal'], [
      ['Authentication', 'Build > Authentication', 'Aktifkan Email/Password sign-in'],
      ['Firestore Database', 'Build > Firestore Database', 'Pilih lokasi, atur rules awal'],
      ['Storage', 'Build > Storage', 'Pilih lokasi, atur rules awal'],
      ['Cloud Functions', 'Build > Functions', 'Upgrade ke Blaze plan (pay-as-you-go)'],
    ]),
    warning('Cloud Functions memerlukan upgrade ke Blaze plan. Pastikan Anda telah memahami struktur pricing Firebase.'),

    h(2, '3.3 Mendapatkan Konfigurasi Firebase'),
    step('1', 'Di Firebase Console, buka Project Settings > General.'),
    step('2', 'Di bagian "Your apps", klik "Add app" dan pilih "Web".'),
    step('3', 'Daftarkan aplikasi dengan nickname, misalnya "e-report-web".'),
    step('4', 'Copy konfigurasi firebaseConfig yang ditampilkan.'),
    step('5', 'Konfigurasi ini akan digunakan di file .env project.'),

    pageBrk(),

    h(1, '4. KONFIGURASI LINGKUNGAN'),
    h(2, '4.1 Environment Variables'),
    p('Buat file .env di root project dengan variabel-variabel berikut:'),
    p([b('File .env (Frontend)')]),
    p('VITE_FIREBASE_API_KEY=your_api_key\nVITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID=your_project_id\nVITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com\nVITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id\nVITE_FIREBASE_APP_ID=your_app_id'),
    p([b('File .env (Backend/Cloud Functions)')]),
    p('FIREBASE_PROJECT_ID=your_project_id\nFIREBASE_CLIENT_EMAIL=your_client_email\nFIREBASE_PRIVATE_KEY=your_private_key'),

    h(2, '4.2 Service Account Key'),
    step('1', 'Di Firebase Console, buka Project Settings > Service Accounts.'),
    step('2', 'Klik "Generate New Private Key" dan simpan file JSON dengan aman.'),
    step('3', 'Service account ini diperlukan untuk Firebase Admin SDK di skrip seeding dan Cloud Functions.'),
    warning('Jangan pernah commit file service account key ke repository. Tambahkan ke .gitignore.'),

    pageBrk(),

    h(1, '5. BUILD FRONTEND'),
    h(2, '5.1 Persiapan Build'),
    step('1', 'Clone repository: git clone <repository-url>'),
    step('2', 'Masuk ke direktori proyek: cd e-report'),
    step('3', 'Install dependencies: npm install'),
    step('4', 'Pastikan file .env sudah terisi dengan benar.'),

    h(2, '5.2 Menjalankan Build'),
    p('Jalankan perintah build:'),
    p([b('npm run build')]),
    p('Perintah ini akan menghasilkan folder dist/ yang berisi file statis siap deploy. Build akan:'),
    bullet('Mengompilasi kode React JS.'),
    bullet('Mengoptimasi bundle (minify, tree shaking).'),
    bullet('Menerapkan Tailwind CSS purging untuk mengurangi ukuran CSS.'),
    bullet('Menghasilkan source maps untuk debugging.'),
    tip('Jika build gagal, periksa error yang muncul. Error umum: missing dependencies, syntax error, atau konfigurasi environment yang salah.'),

    h(2, '5.3 Verifikasi Build'),
    bullet('Periksa folder dist/ sudah terisi dengan file index.html, assets JS, dan CSS.'),
    bullet('Jalankan npm run preview untuk melihat hasil build secara lokal.'),
    bullet('Periksa konsol browser untuk memastikan tidak ada error.'),

    pageBrk(),

    h(1, '6. DEPLOYMENT KE FIREBASE'),
    h(2, '6.1 Inisialisasi Firebase di Proyek'),
    step('1', 'Install Firebase CLI jika belum: npm install -g firebase-tools'),
    step('2', 'Login ke Firebase: firebase login'),
    step('3', 'Inisialisasi Firebase di proyek: firebase init'),
    step('4', 'Pilih layanan yang akan digunakan:'),
    bullet('Hosting: Configure files for Firebase Hosting.'),
    bullet('Firestore: Configure security rules and indexes.'),
    bullet('Storage: Configure security rules.'),
    bullet('Functions: Configure Cloud Functions (jika ada).'),

    h(2, '6.2 Konfigurasi firebase.json'),
    p('Pastikan file firebase.json telah dikonfigurasi dengan benar:'),
    bullet('Hosting public directory: "dist" (sesuai output folder build Vite).'),
    bullet('Rewrites: Arahkan semua route ke index.html untuk SPA.'),
    bullet('Headers: Set Cache-Control untuk aset statis.'),
    bullet('Firestore: Tunjuk ke file rules dan indexes.'),
    bullet('Storage: Tunjuk ke file storage rules.'),

    h(2, '6.3 Deploy ke Firebase Hosting'),
    p('Jalankan perintah deploy:'),
    p([b('firebase deploy --only hosting')]),
    p('Atau untuk deploy semua layanan:'),
    p([b('firebase deploy')]),
    p('Setelah selesai, Firebase CLI akan menampilkan URL hosting (biasanya https://<project-id>.web.app).'),

    h(2, '6.4 Deploy Firestore Rules dan Indexes'),
    p('Deploy aturan keamanan Firestore:'),
    p([b('firebase deploy --only firestore:rules')]),
    p('Deploy indeks komposit Firestore:'),
    p([b('firebase deploy --only firestore:indexes')]),

    h(2, '6.5 Deploy Storage Rules'),
    p([b('firebase deploy --only storage:rules')]),

    pageBrk(),

    h(1, '7. DEPLOYMENT ALTERNATIF (VERCEL)'),
    h(2, '7.1 Deploy ke Vercel'),
    p('Sebagai alternatif hosting, Anda dapat menggunakan Vercel:'),
    step('1', 'Install Vercel CLI: npm install -g vercel'),
    step('2', 'Login ke Vercel: vercel login'),
    step('3', 'Konfigurasi environment variables di Vercel Dashboard.'),
    step('4', 'Jalankan deploy: vercel --prod'),
    p('Vercel akan secara otomatis mendeteksi Vite project dan mengkonfigurasi build settings.'),

    h(2, '7.2 Konfigurasi Domain Kustom'),
    p('Untuk menggunakan domain kustom (misalnya e-report.smktexmaco.sch.id):'),
    step('1', 'Di Firebase Console, buka Hosting dan klik "Add custom domain".'),
    step('2', 'Ikuti petunjuk untuk menambahkan DNS records.'),
    step('3', 'Tunggu propagasi DNS (bisa memakan waktu hingga 48 jam).'),
    step('4', 'Setelah diverifikasi, akses aplikasi melalui domain kustom.'),

    pageBrk(),

    h(1, '8. POST-DEPLOYMENT VERIFICATION'),
    h(2, '8.1 Checklist Verifikasi'),
    p('Setelah deployment selesai, lakukan verifikasi berikut:'),
    table(['No', 'Item Verifikasi', 'Cara Verifikasi'], [
      ['1', 'Halaman login muncul', 'Buka URL aplikasi, pastikan halaman login tampil'],
      ['2', 'Login berfungsi', 'Login dengan akun Admin, pastikan redirect ke dashboard'],
      ['3', 'Dashboard tampil', 'Pastikan widget dashboard menampilkan data'],
      ['4', 'Data siswa terbaca', 'Buka halaman siswa, pastikan data muncul'],
      ['5', 'Firestore rules berfungsi', 'Coba akses dari role berbeda, pastikan RBAC berjalan'],
      ['6', 'File upload berfungsi', 'Upload bukti pelanggaran, pastikan tersimpan di Storage'],
      ['7', 'Notifikasi terkirim', 'Buat pelanggaran, pastikan notifikasi muncul'],
      ['8', 'Export PDF berfungsi', 'Generate surat dan export PDF'],
      ['9', 'Responsivitas', 'Coba akses dari perangkat mobile'],
      ['10', 'Dark mode', 'Toggle dark mode, pastikan tampilan berubah'],
    ]),

    h(2, '8.2 Verifikasi Keamanan'),
    bullet('Pastikan Firestore rules berjalan dengan benar (coba akses langsung dari konsol).'),
    bullet('Pastikan Storage rules membatasi akses hanya untuk pengguna terautentikasi.'),
    bullet('Pastikan environment variables tidak terekspos di client-side.'),
    bullet('Pastikan HTTPS aktif (Firebase Hosting otomatis menyediakan SSL/TLS).'),

    pageBrk(),

    h(1, '9. TROUBLESHOOTING'),
    h(2, '9.1 Build Gagal'),
    table(['Masalah', 'Penyebab', 'Solusi'], [
      ['Build error karena module tidak ditemukan', 'Dependency tidak terinstall', 'Jalankan npm install'],
      ['Build error karena sintaks', 'Kode tidak sesuai standar', 'Periksa error log dan perbaiki sintaks'],
      ['Build error karena env', 'File .env tidak ada', 'Buat file .env dengan konfigurasi benar'],
      ['Build terlalu lambat', 'Terlalu banyak dependency', 'Gunakan --no-source-maps untuk mempercepat'],
    ]),

    h(2, '9.2 Firebase Deploy Gagal'),
    table(['Masalah', 'Penyebab', 'Solusi'], [
      ['Permission denied', 'Firebase CLI tidak login', 'Jalankan firebase login'],
      ['Project not found', 'Project ID salah', 'Periksa .firebaserc dan set project ID benar'],
      ['Deploy timeout', 'Koneksi lambat', 'Coba lagi atau gunakan koneksi yang lebih stabil'],
      ['Rules error', 'Sintaks rules salah', 'Periksa file rules dan uji coba di Firebase Console'],
    ]),

    h(2, '9.3 Aplikasi Tidak Berfungsi Setelah Deploy'),
    table(['Masalah', 'Penyebab', 'Solusi'], [
      ['Halaman kosong (blank page)', 'Error di konsol browser', 'Periksa console browser untuk error detail'],
      ['401 Unauthorized', 'Firebase Auth tidak aktif', 'Aktifkan sign-in method di Firebase Console'],
      ['Data tidak muncul', 'Firestore rules terlalu ketat', 'Periksa dan sesuaikan Firestore rules'],
      ['404 pada routing', 'Rewrites tidak dikonfigurasi', 'Pastikan firebase.json memiliki rewrites yang benar'],
    ]),

    pageBrk(),

    h(1, '10. MAINTENANCE'),
    h(2, '10.1 Update Aplikasi'),
    p('Untuk melakukan update aplikasi setelah perubahan kode:'),
    step('1', 'Pull perubahan terbaru: git pull'),
    step('2', 'Install dependency baru jika ada: npm install'),
    step('3', 'Build ulang: npm run build'),
    step('4', 'Deploy ulang: firebase deploy'),
    tip('Lakukan deployment di luar jam sibuk untuk meminimalkan dampak pada pengguna.'),

    h(2, '10.2 Monitoring'),
    bullet('Gunakan Firebase Console > Quality untuk memantau performa dan error.'),
    bullet('Aktifkan Firebase Crashlytics untuk melacak error di sisi klien.'),
    bullet('Pantau penggunaan Firestore, Storage, dan Functions di Firebase Console.'),
    bullet('Periksa log Cloud Functions secara berkala.'),

    h(2, '10.3 Rollback'),
    p('Jika terjadi masalah setelah deployment, Anda dapat rollback ke versi sebelumnya:'),
    bullet('Firebase Hosting: Gunakan Firebase Console > Hosting untuk memilih versi sebelumnya.'),
    bullet('Vercel: Gunakan Vercel Dashboard > Deployments untuk melakukan rollback.'),
    bullet('Firestore: Gunakan backup atau point-in-time recovery jika tersedia.'),

    pageBrk(),

    h(1, '11. REFERENSI'),
    bullet('Firebase Documentation: https://firebase.google.com/docs'),
    bullet('Firebase CLI Reference: https://firebase.google.com/docs/cli'),
    bullet('Vite Deployment Guide: https://vitejs.dev/guide/static-deploy'),
    bullet('Vercel Documentation: https://vercel.com/docs'),
    bullet('Proyek E-Report GitHub Repository.'),
    p(' ', { spacingAfter: 200 }),
    p([i('Dokumen ini bersifat teknis dan ditujukan untuk DevOps engineer. Pastikan untuk selalu mengikuti best practices keamanan.')]),
  ];

  return { cover, children };
}

// =========================================================
// MAIN
// =========================================================
function makeDoc(title, coverContent, bodyContent) {
  return new Document({
    title,
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [
      { properties: {}, children: coverContent },
      {
        properties: {
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'SMK Texmaco Subang | E-Report System', font: FONT, size: 18, color: C.gray })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 0 },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Halaman ', font: FONT, size: 18, color: C.gray }),
                  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: C.gray }),
                  new TextRun({ text: ' dari ', font: FONT, size: 18, color: C.gray }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 18, color: C.gray }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0 },
              }),
            ],
          }),
        },
        children: bodyContent,
      },
    ],
  });
}

async function generateAll() {
  console.log('Generating User Manual...');
  const um = buildUserManual();
  let doc = makeDoc('User Manual - E-Report', um.cover, um.children);
  let buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(DELIVERABLES, 'user_manual.docx'), buf);
  console.log('  user_manual.docx created');

  console.log('Generating Admin Manual...');
  const am = buildAdminManual();
  doc = makeDoc('Admin Manual - E-Report', am.cover, am.children);
  buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(DELIVERABLES, 'admin_manual.docx'), buf);
  console.log('  admin_manual.docx created');

  console.log('Generating Deployment Guide...');
  const dg = buildDeploymentGuide();
  doc = makeDoc('Deployment Guide - E-Report', dg.cover, dg.children);
  buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(DELIVERABLES, 'deployment_guide.docx'), buf);
  console.log('  deployment_guide.docx created');

  console.log('All manuals generated successfully.');
}

generateAll().catch(console.error);
