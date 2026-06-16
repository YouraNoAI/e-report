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
    const monthKey = String(d.getMonth() + 1).padStart(2, "0");
    months.push({
      key: d.getFullYear() + "-" + monthKey,
      label: d.toLocaleString("id-ID", { month: "short" }),
      start: Timestamp.fromDate(new Date(d.getFullYear(), d.getMonth(), 1)),
      end: Timestamp.fromDate(new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)),
    });
  }
  return months;
}

export async function getDashboardStats() {
  try {
    const [
      studentsSnapshot,
      violationsSnapshot,
      casesSnapshot,
      lettersSnapshot,
    ] = await Promise.all([
      getCountFromServer(collection(db, "students")),
      getCountFromServer(collection(db, "violations")),
      getCountFromServer(query(collection(db, "case_progress"), where("status", "in", [
        CASE_STATUS.DRAFT,
        CASE_STATUS.PELANGGARAN_DICATAT,
        CASE_STATUS.PEMBINAAN_STP2K,
        CASE_STATUS.KONSELING_BK,
        CASE_STATUS.PROSES_KESISWAAN,
        CASE_STATUS.SURAT_DIBUAT,
        CASE_STATUS.ORANG_TUA_DIPANGGIL,
      ]))),
      getCountFromServer(collection(db, "letters")),
    ]);

    const totalSiswa = studentsSnapshot.data().count;
    const totalPelanggaran = violationsSnapshot.data().count;
    const kasusAktif = casesSnapshot.data().count;
    const totalSurat = lettersSnapshot.data().count;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const violationsTodayQuery = query(
      collection(db, "violations"),
      where("createdAt", ">=", Timestamp.fromDate(today)),
      where("createdAt", "<", Timestamp.fromDate(tomorrow))
    );
    const violationsTodaySnap = await getCountFromServer(violationsTodayQuery);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lettersThisMonthQuery = query(
      collection(db, "letters"),
      where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
    );
    const lettersThisMonthSnap = await getCountFromServer(lettersThisMonthQuery);

    return {
      totalSiswa,
      pelanggaranHariIni: violationsTodaySnap.data().count,
      kasusAktif,
      suratBulanIni: lettersThisMonthSnap.data().count,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Gagal mengambil statistik dashboard");
  }
}

export async function getTrenPelanggaran() {
  try {
    const months = getLast12Months();
    const violationsQuery = query(
      collection(db, "violations"),
      where("createdAt", ">=", months[0].start)
    );
    const snapshot = await getDocs(violationsQuery);

    const violationsByMonth = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        const date = data.createdAt.toDate();
        const monthStr = String(date.getMonth() + 1).padStart(2, "0");
        const key = date.getFullYear() + "-" + monthStr;
        violationsByMonth[key] = (violationsByMonth[key] || 0) + 1;
      }
    });

    return months.map((m) => ({
      bulan: m.label,
      jumlah: violationsByMonth[m.key] || 0,
    }));
  } catch (error) {
    console.error("Error fetching violation trend:", error);
    throw new Error("Gagal mengambil tren pelanggaran");
  }
}

export async function getTopKategori() {
  try {
    const q = query(collection(db, "violations"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const kategoriCount = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.categoryName) {
        kategoriCount[data.categoryName] = (kategoriCount[data.categoryName] || 0) + 1;
      }
    });

    return Object.entries(kategoriCount)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching top categories:", error);
    throw new Error("Gagal mengambil top kategori pelanggaran");
  }
}

export async function getSiswaPoinTertinggi() {
  try {
    const q = query(
      collection(db, "students"),
      orderBy("totalPoints", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .slice(0, 5)
      .map((doc) => {
        const data = doc.data();
        return {
          nama: data.fullName,
          kelas: data.className,
          poin: data.totalPoints || 0,
        };
      })
      .filter((s) => s.poin > 0);
  } catch (error) {
    console.error("Error fetching top students:", error);
    throw new Error("Gagal mengambil siswa poin tertinggi");
  }
}

export async function fetchDashboardData() {
  try {
    const [stats, trenPelanggaran, topKategori, siswaPoinTertinggi] = await Promise.all([
      getDashboardStats(),
      getTrenPelanggaran(),
      getTopKategori(),
      getSiswaPoinTertinggi(),
    ]);

    return {
      stats,
      trenPelanggaran,
      topKategori,
      siswaPoinTertinggi,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Gagal mengambil data dashboard");
  }
}