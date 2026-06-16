import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";

// ─── Configuration ──────────────────────────────────────────────────────

const CLEAR_FLAG = process.argv.includes("--clear");

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "e-report-c0224";
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const PRIVATE_KEY = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

const MONTH_ROMAN = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
];

const COLLECTIONS = {
  USERS: "users",
  STUDENTS: "students",
  CATEGORIES: "violation_categories",
  VIOLATIONS: "violations",
  CASES: "case_progress",
  COACHING: "coaching",
  LETTERS: "letters",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
  TEMPLATES: "letter_templates",
};

// ─── Firebase Admin Init ─────────────────────────────────────────────────

function initFirebase() {
  if (admin.apps.length) return admin;

  if (CLIENT_EMAIL && PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: PROJECT_ID,
        clientEmail: CLIENT_EMAIL,
        privateKey: PRIVATE_KEY,
      }),
    });
  } else {
    // Try service account file
    const saPaths = [
      "./service-account.json",
      "../service-account.json",
      "/etc/secrets/service-account.json",
    ];
    let loaded = false;
    for (const p of saPaths) {
      if (existsSync(p)) {
        const sa = JSON.parse(readFileSync(p, "utf8"));
        admin.initializeApp({ credential: admin.credential.cert(sa) });
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      admin.initializeApp({ projectId: PROJECT_ID });
    }
  }

  return admin;
}

const firestore = initFirebase().firestore();
const FieldValue = admin.firestore.FieldValue;
const Timestamp = admin.firestore.Timestamp;

// ─── Helpers ─────────────────────────────────────────────────────────────

function log(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(d);
}

function nowMinus(hours) {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return Timestamp.fromDate(d);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatLetterNumber(count, type) {
  const now = new Date();
  const month = MONTH_ROMAN[now.getMonth()];
  const year = now.getFullYear();
  return `${count}/${type}/SMK-TEX/${month}/${year}`;
}

// ─── Data Definitions ────────────────────────────────────────────────────

const CLASSES = [
  { className: "X RPL 1", major: "RPL" },
  { className: "X RPL 2", major: "RPL" },
  { className: "XI RPL 1", major: "RPL" },
  { className: "XI TEI 1", major: "TEI" },
  { className: "XII RPL 1", major: "RPL" },
];

const VIOLATION_CATEGORIES = [
  { code: "TLB", name: "Terlambat", points: 5, severity: "ringan", description: "Datang terlambat ke sekolah atau jam pelajaran" },
  { code: "ATR", name: "Tidak Memakai Atribut Lengkap", points: 5, severity: "ringan", description: "Tidak memakai atribut sekolah secara lengkap" },
  { code: "RAM", name: "Rambut Tidak Sesuai Aturan", points: 10, severity: "ringan", description: "Rambut tidak rapi atau tidak sesuai ketentuan sekolah" },
  { code: "PER", name: "Tidak Membawa Perlengkapan Belajar", points: 5, severity: "ringan", description: "Tidak membawa buku, alat tulis, atau perlengkapan belajar lainnya" },
  { code: "SAM", name: "Membuang Sampah Sembarangan", points: 5, severity: "ringan", description: "Membuang sampah tidak pada tempatnya" },
  { code: "KOT", name: "Berkata Kotor", points: 10, severity: "sedang", description: "Mengucapkan kata-kata kotor atau tidak sopan" },
  { code: "BOL", name: "Membolos", points: 15, severity: "sedang", description: "Membolos saat jam pelajaran berlangsung" },
  { code: "KEL", name: "Berkelahi", points: 35, severity: "berat", description: "Terlibat perkelahian dengan siswa lain" },
  { code: "ROK", name: "Merokok di Lingkungan Sekolah", points: 35, severity: "berat", description: "Merokok di area lingkungan sekolah" },
  { code: "CUR", name: "Mencuri", points: 50, severity: "berat", description: "Mengambil barang milik orang lain tanpa izin" },
  { code: "MEL", name: "Melawan Guru", points: 50, severity: "berat", description: "Melawan atau berkata tidak sopan kepada guru" },
  { code: "TAJ", name: "Membawa Senjata Tajam", points: 100, severity: "berat", description: "Membawa senjata tajam ke lingkungan sekolah" },
  { code: "NARK", name: "Membawa Narkoba", points: 100, severity: "berat", description: "Membawa atau menggunakan narkoba di lingkungan sekolah" },
];

const USERS_DATA = [
  { fullName: "Ahmad Hidayat", email: "admin@smktexmaco.sch.id", role: "admin" },
  { fullName: "Dewi Sartika", email: "gurubk1@smktexmaco.sch.id", role: "guru_bk" },
  { fullName: "Bambang Hermawan", email: "gurubk2@smktexmaco.sch.id", role: "guru_bk" },
  { fullName: "Rina Marlina", email: "stp2k1@smktexmaco.sch.id", role: "stp2k" },
  { fullName: "Hendra Gunawan", email: "stp2k2@smktexmaco.sch.id", role: "stp2k" },
  { fullName: "Siti Nurjanah", email: "walikelas1@smktexmaco.sch.id", role: "wali_kelas" },
  { fullName: "Agus Prasetyo", email: "walikelas2@smktexmaco.sch.id", role: "wali_kelas" },
  { fullName: "Fitri Handayani", email: "walikelas3@smktexmaco.sch.id", role: "wali_kelas" },
  { fullName: "Drs. H. Supriyono", email: "kesiswaan@smktexmaco.sch.id", role: "kesiswaan" },
  { fullName: "Asep Rudi", email: "ortu1@smktexmaco.sch.id", role: "orang_tua" },
  { fullName: "Nina Marlina", email: "ortu2@smktexmaco.sch.id", role: "orang_tua" },
  { fullName: "Cecep Hermawan", email: "ortu3@smktexmaco.sch.id", role: "orang_tua" },
  { fullName: "Rizky Pratama", email: "siswa1@smktexmaco.sch.id", role: "siswa" },
  { fullName: "Anisa Putri", email: "siswa2@smktexmaco.sch.id", role: "siswa" },
  { fullName: "Doni Saputra", email: "siswa3@smktexmaco.sch.id", role: "siswa" },
];

const STUDENTS_DATA = [
  { nis: "2024001", fullName: "Rizky Pratama", className: "X RPL 1", major: "RPL", gender: "L", parentName: "Asep Rudi", parentPhone: "081234567891", parentEmail: "ortu1@smktexmaco.sch.id", targetPoints: 105 },
  { nis: "2024002", fullName: "Anisa Putri", className: "X RPL 1", major: "RPL", gender: "P", parentName: "Nina Marlina", parentPhone: "081234567892", parentEmail: "ortu2@smktexmaco.sch.id", targetPoints: 65 },
  { nis: "2024003", fullName: "Doni Saputra", className: "X RPL 1", major: "RPL", gender: "L", parentName: "Cecep Hermawan", parentPhone: "081234567893", parentEmail: "ortu3@smktexmaco.sch.id", targetPoints: 30 },
  { nis: "2024004", fullName: "Siti Aisyah", className: "X RPL 2", major: "RPL", gender: "P", parentName: "Endang Suryana", parentPhone: "081234567894", targetPoints: 0 },
  { nis: "2024005", fullName: "Muhammad Rizki", className: "X RPL 2", major: "RPL", gender: "L", parentName: "Dedi Kusnadi", parentPhone: "081234567895", targetPoints: 15 },
  { nis: "2024006", fullName: "Nadia Rahmawati", className: "XI RPL 1", major: "RPL", gender: "P", parentName: "Tatang Suherman", parentPhone: "081234567896", targetPoints: 45 },
  { nis: "2024007", fullName: "Fajar Nugraha", className: "XI RPL 1", major: "RPL", gender: "L", parentName: "Yana Mulyana", parentPhone: "081234567897", targetPoints: 80 },
  { nis: "2024008", fullName: "Intan Permata Sari", className: "XI TEI 1", major: "TEI", gender: "P", parentName: "Agus Waluyo", parentPhone: "081234567898", targetPoints: 0 },
  { nis: "2024009", fullName: "Bayu Aji Pamungkas", className: "XI TEI 1", major: "TEI", gender: "L", parentName: "Slamet Riyadi", parentPhone: "081234567899", targetPoints: 55 },
  { nis: "2024010", fullName: "Dian Puspita", className: "XII RPL 1", major: "RPL", gender: "P", parentName: "Herman Susanto", parentPhone: "081234567800", targetPoints: 20 },
  { nis: "2024011", fullName: "Aditya Firmansyah", className: "XII RPL 1", major: "RPL", gender: "L", parentName: "Rudi Hartono", parentPhone: "081234567801", targetPoints: 90 },
  { nis: "2024012", fullName: "Cindy Febriani", className: "XI RPL 1", major: "RPL", gender: "P", parentName: "Dede Suryana", parentPhone: "081234567802", targetPoints: 110 },
];

const COACHING_NOTES_DATA = [
  { type: "STP2K", notes: "Pembinaan terkait kedisiplinan waktu datang ke sekolah. Siswa diberikan arahan tentang pentingnya disiplin waktu.", followUp: "Monitoring kehadiran selama 2 minggu" },
  { type: "STP2K", notes: "Pembinaan terkait kerapihan berpakaian dan atribut sekolah.", followUp: "Pengecekan atribut setiap hari Senin" },
  { type: "BK", notes: "Konseling terkait motivasi belajar. Siswa mengaku kesulitan berkonsentrasi di kelas.", followUp: "Evaluasi setiap 2 minggu" },
  { type: "STP2K", notes: "Pembinaan terkait perilaku merokok di lingkungan sekolah. Siswa diberikan pemahaman dampak merokok.", followUp: "Pengawasan berkala by STP2K" },
  { type: "BK", notes: "Konseling terkait permasalahan keluarga yang mempengaruhi perilaku siswa di sekolah.", followUp: "Konseling lanjutan minggu depan" },
  { type: "STP2K", notes: "Pembinaan terkait kebersihan lingkungan sekolah. Siswa diingatkan untuk membuang sampah pada tempatnya.", followUp: "Piket kebersihan tambahan selama 1 minggu" },
];

const LETTER_TEMPLATES_DATA = [
  {
    type: "SP1",
    name: "Surat Peringatan 1",
    content: `SURAT PERINGATAN 1
Nomor: {letterNumber}

Yang bertanda tangan di bawah ini, Kepala SMK Texmaco Subang, menerangkan bahwa:

Nama Siswa: {studentName}
NIS: {studentNIS}
Kelas: {studentClass}

Telah melakukan pelanggaran sebagai berikut:
{description}

Dengan ini memberikan peringatan pertama kepada siswa yang bersangkutan. Apabila siswa melakukan pelanggaran kembali, maka akan diberikan surat peringatan selanjutnya.

Demikian surat peringatan ini dibuat untuk diketahui dan dilaksanakan sebagaimana mestinya.

Subang, {date}
Kepala Sekolah,

{principalName}`
  },
  {
    type: "SP2",
    name: "Surat Peringatan 2",
    content: `SURAT PERINGATAN 2
Nomor: {letterNumber}

Yang bertanda tangan di bawah ini, Kepala SMK Texmaco Subang, menerangkan bahwa:

Nama Siswa: {studentName}
NIS: {studentNIS}
Kelas: {studentClass}

Telah melakukan pelanggaran sebagai berikut:
{description}

Dengan ini memberikan peringatan kedua kepada siswa yang bersangkutan. Apabila siswa melakukan pelanggaran kembali, maka akan diberikan surat peringatan ketiga.

Demikian surat peringatan ini dibuat untuk diketahui dan dilaksanakan sebagaimana mestinya.

Subang, {date}
Kepala Sekolah,

{principalName}`
  },
  {
    type: "SP3",
    name: "Surat Peringatan 3",
    content: `SURAT PERINGATAN 3
Nomor: {letterNumber}

Yang bertanda tangan di bawah ini, Kepala SMK Texmaco Subang, menerangkan bahwa:

Nama Siswa: {studentName}
NIS: {studentNIS}
Kelas: {studentClass}

Telah melakukan pelanggaran sebagai berikut:
{description}

Dengan ini memberikan peringatan ketiga kepada siswa yang bersangkutan. Apabila siswa melakukan pelanggaran kembali, maka akan diberikan sanksi tegas sesuai dengan ketentuan sekolah.

Demikian surat peringatan ini dibuat untuk diketahui dan dilaksanakan sebagaimana mestinya.

Subang, {date}
Kepala Sekolah,

{principalName}`
  },
  {
    type: "PERJANJIAN",
    name: "Surat Perjanjian",
    content: `SURAT PERJANJIAN SISWA
Nomor: {letterNumber}

Yang bertanda tangan di bawah ini:

Nama Siswa: {studentName}
NIS: {studentNIS}
Kelas: {studentClass}

Dengan ini menyatakan akan:
1. Tidak mengulangi pelanggaran yang telah dilakukan
2. Mematuhi seluruh tata tertib SMK Texmaco Subang
3. Mengikuti pembinaan yang diberikan oleh pihak sekolah

Apabila melanggar perjanjian ini, saya bersedia menerima sanksi sesuai ketentuan yang berlaku.

Subang, {date}
Yang Membuat Perjanjian,

{studentName}

Mengetahui,
Kepala Sekolah,
Wali Kelas,

{principalName}
{waliKelasName}`
  },
  {
    type: "PANGGILAN_ORANG_TUA",
    name: "Panggilan Orang Tua",
    content: `PANGGILAN ORANG TUA / WALI
Nomor: {letterNumber}

Kepada Yth.
Bapak/Ibu Orang Tua/Wali dari:
{studentName}
Kelas: {studentClass}
NIS: {studentNIS}

Di Tempat

Dengan hormat,
Sehubungan dengan pelanggaran yang dilakukan oleh anak Bapak/Ibu, kami mohon kesediaan Bapak/Ibu untuk hadir ke sekolah pada:

Hari/Tanggal: {meetingDate}
Waktu: 08.00 - selesai
Tempat: Ruang Kesiswaan SMK Texmaco Subang

Demikian undangan ini disampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.

Subang, {date}
Kepala Sekolah,

{principalName}`
  },
];

// ─── Main Seeding Functions ─────────────────────────────────────────────

async function clearAllData() {
  log("Clearing all existing data...");
  const allCollections = Object.values(COLLECTIONS);
  for (const name of allCollections) {
    const snapshot = await firestore.collection(name).get();
    if (snapshot.empty) {
      log(`  ${name}: already empty`);
      continue;
    }
    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    log(`  ${name}: cleared ${snapshot.size} documents`);
  }
  log("All data cleared.\n");
}

async function seedUsers() {
  log("Seeding users...");
  const existing = await firestore.collection(COLLECTIONS.USERS).get();
  if (!existing.empty) {
    log("  Users already exist, skipping.\n");
    return {};
  }

  const batch = firestore.batch();
  const refs = {};

  for (const user of USERS_DATA) {
    const ref = firestore.collection(COLLECTIONS.USERS).doc();
    batch.set(ref, {
      ...user,
      isActive: true,
      lastLogin: user.role !== "orang_tua" && user.role !== "siswa"
        ? nowMinus(randomInt(1, 72))
        : null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    refs[user.email] = ref.id;
  }

  await batch.commit();
  log(`  Created ${USERS_DATA.length} users.`);
  return refs;
}

async function seedStudents(userRefs) {
  log("Seeding students...");
  const existing = await firestore.collection(COLLECTIONS.STUDENTS).get();
  if (!existing.empty) {
    log("  Students already exist, skipping.\n");
    return {};
  }

  const batch = firestore.batch();
  const refs = {};

  for (const s of STUDENTS_DATA) {
    const ref = firestore.collection(COLLECTIONS.STUDENTS).doc();
    batch.set(ref, {
      nis: s.nis,
      fullName: s.fullName,
      className: s.className,
      major: s.major,
      gender: s.gender,
      parentName: s.parentName || "",
      parentPhone: s.parentPhone || "",
      parentEmail: s.parentEmail || "",
      totalPoints: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    refs[s.nis] = { ref: ref.id, data: s };
  }

  await batch.commit();
  log(`  Created ${STUDENTS_DATA.length} students.`);
  return refs;
}

async function seedCategories() {
  log("Seeding violation categories...");
  const existing = await firestore.collection(COLLECTIONS.CATEGORIES).get();
  if (!existing.empty) {
    log("  Categories already exist, skipping.\n");
    return {};
  }

  const batch = firestore.batch();
  const refs = {};

  for (const cat of VIOLATION_CATEGORIES) {
    const ref = firestore.collection(COLLECTIONS.CATEGORIES).doc();
    batch.set(ref, {
      ...cat,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    refs[cat.code] = ref.id;
  }

  await batch.commit();
  log(`  Created ${VIOLATION_CATEGORIES.length} categories.`);
  return refs;
}

async function seedViolations(studentRefs, categoryRefs) {
  log("Seeding violations...");
  const existing = await firestore.collection(COLLECTIONS.VIOLATIONS).get();
  if (!existing.empty) {
    log("  Violations already exist, skipping.\n");
    return {};
  }

  const batch = firestore.batch();
  const refs = {};

  const violationDefs = [
    { nis: "2024001", code: "TLB", desc: "Terlambat datang ke sekolah pada jam pertama pelajaran", days: 45 },
    { nis: "2024001", code: "ATR", desc: "Tidak memakai dasi dan badge OSIS saat upacara bendera", days: 40 },
    { nis: "2024001", code: "BOL", desc: "Membolos pada jam pelajaran Matematika", days: 35 },
    { nis: "2024001", code: "ROK", desc: "Kedapatan merokok di belakang kantin sekolah", days: 20 },
    { nis: "2024001", code: "KEL", desc: "Terlibat perkelahian dengan siswa kelas XI di luar kelas", days: 10 },
    { nis: "2024001", code: "TAJ", desc: "Membawa cutter ke sekolah tanpa izin", days: 3 },
    { nis: "2024002", code: "TLB", desc: "Terlambat masuk kelas setelah jam istirahat", days: 50 },
    { nis: "2024002", code: "RAM", desc: "Rambut menutupi kerah baju seragam", days: 42 },
    { nis: "2024002", code: "KOT", desc: "Mengucapkan kata-kata tidak sopan kepada teman sekelas", days: 30 },
    { nis: "2024002", code: "BOL", desc: "Membolos pelajaran olahraga", days: 15 },
    { nis: "2024003", code: "TLB", desc: "Terlambat datang ke sekolah sebanyak 3 kali dalam seminggu", days: 55 },
    { nis: "2024003", code: "PER", desc: "Tidak membawa buku pelajaran Bahasa Indonesia", days: 48 },
    { nis: "2024003", code: "ATR", desc: "Tidak memakai ikat pinggang dan sepatu hitam", days: 25 },
    { nis: "2024005", code: "SAM", desc: "Membuang bungkus snack sembarangan di halaman sekolah", days: 40 },
    { nis: "2024005", code: "TLB", desc: "Terlambat masuk sekolah setelah jam istirahat pertama", days: 20 },
    { nis: "2024006", code: "RAM", desc: "Rambut dicat dengan warna tidak sesuai ketentuan", days: 50 },
    { nis: "2024006", code: "BOL", desc: "Membolos jam pelajaran produktif RPL", days: 35 },
    { nis: "2024006", code: "KOT", desc: "Berkata kotor saat bermain game di kelas", days: 12 },
    { nis: "2024007", code: "TLB", desc: "Sering terlambat masuk kelas pagi", days: 60 },
    { nis: "2024007", code: "ROK", desc: "Kedapatan merokok di toilet sekolah", days: 40 },
    { nis: "2024007", code: "KEL", desc: "Terlibat perkelahian dengan siswa X RPL 2", days: 25 },
    { nis: "2024007", code: "MEL", desc: "Membantah dan berkata kasar kepada guru piket", days: 5 },
    { nis: "2024009", code: "TLB", desc: "Terlambat mengikuti upacara bendera hari Senin", days: 45 },
    { nis: "2024009", code: "ATR", desc: "Tidak memakai topi dan dasi saat upacara", days: 38 },
    { nis: "2024009", code: "RAM", desc: "Rambut tidak dipotong sesuai aturan selama 2 bulan", days: 20 },
    { nis: "2024009", code: "PER", desc: "Tidak membawa alat praktik TEI", days: 8 },
    { nis: "2024010", code: "SAM", desc: "Membuang sampah plastik ke selokan sekolah", days: 30 },
    { nis: "2024010", code: "TLB", desc: "Terlambat masuk kelas setelah jam istirahat", days: 15 },
    { nis: "2024011", code: "TLB", desc: "Terlambat datang ke sekolah", days: 65 },
    { nis: "2024011", code: "BOL", desc: "Membolos jam pelajaran produktif", days: 50 },
    { nis: "2024011", code: "ROK", desc: "Merokok di area parkir sekolah", days: 35 },
    { nis: "2024011", code: "KEL", desc: "Terlibat perkelahian antar jurusan", days: 12 },
    { nis: "2024011", code: "CUR", desc: "Mengambil uang teman saat jam istirahat", days: 2 },
    { nis: "2024012", code: "TLB", desc: "Terlambat masuk kelas sebanyak 5 kali", days: 70 },
    { nis: "2024012", code: "BOL", desc: "Membolos sekolah selama 2 hari berturut-turut", days: 55 },
    { nis: "2024012", code: "ROK", desc: "Merokok di kelas saat jam kosong", days: 40 },
    { nis: "2024012", code: "MEL", desc: "Melawan wali kelas saat ditegur", days: 20 },
    { nis: "2024012", code: "TAJ", desc: "Membawa pisau lipat ke sekolah", days: 5 },
  ];

  for (let i = 0; i < violationDefs.length; i++) {
    const v = violationDefs[i];
    const student = studentRefs[v.nis];
    const categoryId = categoryRefs[v.code];
    const cat = VIOLATION_CATEGORIES.find((c) => c.code === v.code);
    if (!student || !categoryId || !cat) continue;

    const violationId = firestore.collection(COLLECTIONS.VIOLATIONS).doc().id;
    const violationRef = firestore.collection(COLLECTIONS.VIOLATIONS).doc(violationId);

    batch.set(violationRef, {
      studentId: student.ref,
      categoryId,
      description: v.desc,
      violationDate: daysAgo(v.days),
      points: cat.points,
      createdAt: daysAgo(v.days - 1),
      updatedAt: daysAgo(v.days - 1),
    });

    refs[`${v.nis}_${i}`] = { id: violationId, studentId: student.ref, points: cat.points, days: v.days };
  }

  await batch.commit();
  log(`  Created ${violationDefs.length} violations.`);
  return refs;
}

async function updateStudentPoints(studentRefs, violationRefs) {
  log("Updating student total points...");

  const pointMap = {};
  for (const key of Object.keys(violationRefs)) {
    const v = violationRefs[key];
    pointMap[v.studentId] = (pointMap[v.studentId] || 0) + v.points;
  }

  const batch = firestore.batch();
  for (const [nis, student] of Object.entries(studentRefs)) {
    const pts = pointMap[student.ref] || 0;
    batch.update(firestore.collection(COLLECTIONS.STUDENTS).doc(student.ref), {
      totalPoints: pts,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  log(`  Updated points for ${Object.keys(pointMap).length} students.`);
}

async function seedCases(studentRefs, violationRefs, userRefs) {
  log("Seeding case progress...");
  const existing = await firestore.collection(COLLECTIONS.CASES).get();
  if (!existing.empty) {
    log("  Cases already exist, skipping.\n");
    return;
  }

  const batch = firestore.batch();

  for (const key of Object.keys(violationRefs)) {
    const v = violationRefs[key];
    const statuses = [
      "PELANGGARAN_DICATAT",
      "PELANGGARAN_DICATAT",
      "PEMBINAAN_STP2K",
      "KONSELING_BK",
      "PROSES_KESISWAAN",
    ];

    const status = v.days < 10 ? "SURAT_DIBUAT" : v.days < 20 ? "PROSES_KESISWAAN" : v.days < 35 ? "KONSELING_BK" : v.days < 50 ? "PEMBINAAN_STP2K" : "PELANGGARAN_DICATAT";

    const caseRef = firestore.collection(COLLECTIONS.CASES).doc();
    batch.set(caseRef, {
      studentId: v.studentId,
      violationId: v.id,
      status,
      description: "Progress kasus berdasarkan total poin pelanggaran",
      timeline: [
        {
          from: null,
          to: "PELANGGARAN_DICATAT",
          updatedBy: userRefs["gurubk1@smktexmaco.sch.id"] || "",
          notes: "Pelanggaran dicatat oleh Guru BK",
          timestamp: daysAgo(v.days),
        },
        {
          from: "PELANGGARAN_DICATAT",
          to: status,
          updatedBy: userRefs["stp2k1@smktexmaco.sch.id"] || "",
          notes: status === "PEMBINAAN_STP2K"
            ? "Masuk tahap pembinaan STP2K"
            : status === "KONSELING_BK"
              ? "Masuk tahap konseling BK"
              : status === "PROSES_KESISWAAN"
                ? "Masuk proses kesiswaan"
                : status === "SURAT_DIBUAT"
                  ? "Memasuki tahap pembuatan surat"
                  : "Update status kasus",
          timestamp: daysAgo(v.days - randomInt(1, 5)),
        },
      ],
      createdAt: daysAgo(v.days),
      updatedAt: daysAgo(v.days - randomInt(1, 5)),
    });
  }

  await batch.commit();
  const count = Object.keys(violationRefs).length;
  log(`  Created ${count} case progress entries.`);
}

async function seedCoaching(studentRefs, userRefs) {
  log("Seeding coaching notes...");
  const existing = await firestore.collection(COLLECTIONS.COACHING).get();
  if (!existing.empty) {
    log("  Coaching notes already exist, skipping.\n");
    return;
  }

  const nisList = ["2024001", "2024002", "2024003", "2024006", "2024007", "2024011"];
  const batch = firestore.batch();

  nisList.forEach((nis, idx) => {
    if (idx >= COACHING_NOTES_DATA.length) return;
    const student = studentRefs[nis];
    if (!student) return;
    const note = COACHING_NOTES_DATA[idx];

    const ref = firestore.collection(COLLECTIONS.COACHING).doc();
    batch.set(ref, {
      studentId: student.ref,
      type: note.type,
      notes: note.notes,
      followUp: note.followUp || "",
      date: daysAgo(randomInt(10, 60)),
      createdAt: daysAgo(randomInt(10, 60)),
      updatedAt: daysAgo(randomInt(5, 55)),
    });
  });

  await batch.commit();
  log(`  Created ${nisList.length} coaching notes.`);
}

async function seedLetters(studentRefs, userRefs) {
  log("Seeding letters...");
  const existing = await firestore.collection(COLLECTIONS.LETTERS).get();
  if (!existing.empty) {
    log("  Letters already exist, skipping.\n");
    return;
  }

  const batch = firestore.batch();
  let letterCount = 0;

  const letterDefs = [
    { nis: "2024001", type: "SP1", notes: "Surat peringatan pertama terkait akumulasi pelanggaran", days: 20 },
    { nis: "2024001", type: "SP2", notes: "Surat peringatan kedua karena masih melakukan pelanggaran", days: 8 },
    { nis: "2024011", type: "SP1", notes: "Surat peringatan pertama untuk pelanggaran berat", days: 15 },
    { nis: "2024012", type: "SP1", notes: "Surat peringatan pertama akumulasi poin melebihi 100", days: 25 },
    { nis: "2024007", type: "SP1", notes: "Surat peringatan setelah akumulasi poin mencapai 80", days: 10 },
    { nis: "2024007", type: "PANGGILAN_ORANG_TUA", notes: "Pemanggilan orang tua terkait perkelahian", days: 5 },
    { nis: "2024012", type: "PANGGILAN_ORANG_TUA", notes: "Pemanggilan orang tua karena membawa senjata tajam", days: 3 },
  ];

  for (const l of letterDefs) {
    const student = studentRefs[l.nis];
    if (!student) continue;
    letterCount++;

    const ref = firestore.collection(COLLECTIONS.LETTERS).doc();
    batch.set(ref, {
      studentId: student.ref,
      type: l.type,
      letterNumber: formatLetterNumber(letterCount, l.type),
      status: "DRAFT",
      notes: l.notes,
      templateId: "",
      createdAt: daysAgo(l.days),
      updatedAt: daysAgo(l.days),
    });
  }

  await batch.commit();
  log(`  Created ${letterCount} letters.`);
}

async function seedNotifications(userRefs, studentRefs) {
  log("Seeding notifications...");
  const existing = await firestore.collection(COLLECTIONS.NOTIFICATIONS).get();
  if (!existing.empty) {
    log("  Notifications already exist, skipping.\n");
    return;
  }

  const batch = firestore.batch();

  const notificationDefs = [
    {
      userId: userRefs["admin@smktexmaco.sch.id"],
      type: "violation",
      title: "Pelanggaran Baru",
      message: "Siswa Rizky Pratama telah mencapai 100+ poin pelanggaran. Segera tindak lanjuti.",
      studentId: studentRefs["2024001"]?.ref,
      read: false,
      days: 5,
    },
    {
      userId: userRefs["gurubk1@smktexmaco.sch.id"],
      type: "violation",
      title: "Pelanggaran Dicatat",
      message: "Pelanggaran baru atas nama Cindy Febriani: Membawa pisau lipat ke sekolah.",
      studentId: studentRefs["2024012"]?.ref,
      read: false,
      days: 3,
    },
    {
      userId: userRefs["stp2k1@smktexmaco.sch.id"],
      type: "case_update",
      title: "Update Kasus",
      message: "Kasus Fajar Nugraha memasuki tahap proses kesiswaan. Perlu penanganan lanjutan.",
      studentId: studentRefs["2024007"]?.ref,
      read: true,
      days: 15,
    },
    {
      userId: userRefs["gurubk2@smktexmaco.sch.id"],
      type: "coaching",
      title: "Jadwal Konseling",
      message: "Jadwal konseling dengan Bayu Aji Pamungkas besok jam 10.00 WIB.",
      studentId: studentRefs["2024009"]?.ref,
      read: false,
      days: 1,
    },
    {
      userId: userRefs["kesiswaan@smktexmaco.sch.id"],
      type: "letter",
      title: "Surat Baru",
      message: "Surat peringatan untuk Aditya Firmansyah telah dibuat. Mohon ditandatangani.",
      studentId: studentRefs["2024011"]?.ref,
      read: false,
      days: 7,
    },
    {
      userId: userRefs["walikelas1@smktexmaco.sch.id"],
      type: "violation",
      title: "Pelanggaran Siswa",
      message: "Siswa Rizky Pratama (X RPL 1) mendapatkan point tambahan. Total: 105 poin.",
      studentId: studentRefs["2024001"]?.ref,
      read: true,
      days: 12,
    },
    {
      userId: userRefs["walikelas2@smktexmaco.sch.id"],
      type: "parent_call",
      title: "Panggilan Orang Tua",
      message: "Orang tua Fajar Nugraha dijadwalkan datang ke sekolah hari Jumat.",
      studentId: studentRefs["2024007"]?.ref,
      read: false,
      days: 2,
    },
  ];

  for (const notif of notificationDefs) {
    if (!notif.userId) continue;
    const ref = firestore.collection(COLLECTIONS.NOTIFICATIONS).doc();
    batch.set(ref, {
      userId: notif.userId,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      studentId: notif.studentId || "",
      read: notif.read,
      createdAt: daysAgo(notif.days),
    });
  }

  await batch.commit();
  log(`  Created ${notificationDefs.length} notifications.`);
}

async function seedSettings() {
  log("Seeding settings...");
  const existing = await firestore.collection(COLLECTIONS.SETTINGS).get();
  if (!existing.empty) {
    log("  Settings already exist, skipping.\n");
    return;
  }

  const ref = firestore.collection(COLLECTIONS.SETTINGS).doc("school_profile");
  await ref.set({
    schoolName: "SMK Texmaco Subang",
    address: "Jl. Raya Texmaco No. 1, Subang, Jawa Barat",
    phone: "0260-12345678",
    email: "info@smktexmaco.sch.id",
    principalName: "Dr. H. Ahmad Fauzi, M.Pd.",
    principalNIP: "196501011990011001",
    pointThresholds: {
      pembinaanMin: 25,
      bkMin: 50,
      kesiswaanMin: 75,
      suratMin: 100,
    },
    letterFormat: "{no}/{type}/SMK-TEX/{month}/{year}",
    academicYear: "2025/2026",
    semester: "Genap",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  log("  Created settings.");
}

async function seedLetterTemplates() {
  log("Seeding letter templates...");
  const existing = await firestore.collection(COLLECTIONS.TEMPLATES).get();
  if (!existing.empty) {
    log("  Letter templates already exist, skipping.\n");
    return;
  }

  const batch = firestore.batch();

  for (const tmpl of LETTER_TEMPLATES_DATA) {
    const ref = firestore.collection(COLLECTIONS.TEMPLATES).doc();
    batch.set(ref, {
      type: tmpl.type,
      name: tmpl.name,
      content: tmpl.content,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  log(`  Created ${LETTER_TEMPLATES_DATA.length} letter templates.`);
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  log("Starting seed script...\n");

  try {
    if (CLEAR_FLAG) {
      await clearAllData();
    }

    const userRefs = await seedUsers();
    const studentRefs = await seedStudents(userRefs);
    const categoryRefs = await seedCategories();
    const violationRefs = await seedViolations(studentRefs, categoryRefs);

    if (violationRefs && Object.keys(violationRefs).length > 0) {
      await updateStudentPoints(studentRefs, violationRefs);
      await seedCases(studentRefs, violationRefs, userRefs);
    }

    await seedCoaching(studentRefs, userRefs);
    await seedLetters(studentRefs, userRefs);
    await seedNotifications(userRefs, studentRefs);
    await seedSettings();
    await seedLetterTemplates();

    log("\nSeed completed successfully!");
  } catch (error) {
    console.error("\nSeed failed:", error);
    process.exit(1);
  }
}

main();
