import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getCountFromServer,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { CASE_STATUS } from "../constants";

function getMonthStartEnd(year, month) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start: Timestamp.fromDate(start), end: Timestamp.fromDate(end) };
}

function getLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("id-ID", { month: "short" }),
      start: Timestamp.fromDate(new Date(d.getFullYear(), d.getMonth(), 1)),
      end: Timestamp.fromDate(new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)),
    });
  }
  return months;
}

export async function fetchReportData() {
  try {
    const months = getLast12Months();
    const oldestDate = months[0].start;

    // Fetch all violations in the last 12 months
    const violationsQuery = query(
      collection(db, "violations"),
      where("createdAt", ">=", oldestDate)
    );
    const [violationsSnap, studentsSnap, casesSnap, lettersSnap] = await Promise.all([
      getDocs(violationsQuery),
      getCountFromServer(collection(db, "students")),
      getCountFromServer(collection(db, "case_progress")),
      getCountFromServer(collection(db, "letters")),
    ]);

    const violations = violationsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const totalPelanggaran = violations.length;
    const totalSiswa = studentsSnap.data().count;
    const totalSuratTerbit = lettersSnap.data().count;

    // Tren per bulan
    const violationsByMonth = {};
    violations.forEach((v) => {
      if (v.createdAt) {
        const date = v.createdAt.toDate();
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        violationsByMonth[key] = (violationsByMonth[key] || 0) + 1;
      }
    });

    const tren = months.map((m) => ({
      bulan: m.label,
      jumlah: violationsByMonth[m.key] || 0,
    }));

    // Top kategori
    const kategoriCount = {};
    violations.forEach((v) => {
      if (v.categoryName) {
        kategoriCount[v.categoryName] = (kategoriCount[v.categoryName] || 0) + 1;
      }
    });

    const topKategori = Object.entries(kategoriCount)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 10);

    // Status distribusi dari cases
    const casesQuery = query(collection(db, "case_progress"));
    const casesSnap2 = await getDocs(casesQuery);
    const cases = casesSnap2.docs.map((d) => ({ id: d.id, ...d.data() }));

    const statusCount = {};
    cases.forEach((c) => {
      const status = c.status || CASE_STATUS.DRAFT;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const statusDistribusi = Object.entries(statusCount).map(([status, value]) => ({ status, value }));

    // Per kelas
    const kelasCount = {};
    violations.forEach((v) => {
      if (v.studentClass) {
        kelasCount[v.studentClass] = (kelasCount[v.studentClass] || 0) + 1;
      }
    });

    const perKelas = Object.entries(kelasCount)
      .map(([kelas, jumlah]) => ({ kelas, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);

    // Detail (last 20 violations)
    const detail = violations
      .slice(0, 20)
      .map((v) => ({
        tanggal: v.createdAt ? v.createdAt.toDate().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-",
        siswa: v.studentName || "-",
        kelas: v.studentClass || "-",
        kategori: v.categoryName || "-",
        poin: v.points || 0,
        statusKasus: v.caseStatus || "Dicatat",
      }));

    // Rata-rata poin
    const totalPoin = violations.reduce((sum, v) => sum + (v.points || 0), 0);
    const rataPoin = totalPelanggaran > 0 ? (totalPoin / totalPelanggaran).toFixed(1) : 0;

    // Siswa terlibat (unique students with violations)
    const uniqueStudents = new Set(violations.map((v) => v.studentId).filter(Boolean));
    const siswaTerlibat = uniqueStudents.size;

    return {
      stats: {
        totalPelanggaran,
        rataPoin: parseFloat(rataPoin),
        siswaTerlibat,
        suratTerbit: totalSuratTerbit,
      },
      tren,
      topKategori,
      statusDistribusi,
      perKelas,
      detail,
    };
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw new Error("Gagal mengambil data laporan");
  }
}