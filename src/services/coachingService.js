import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { NOTIFICATION_TYPES } from "../constants";

const COLLECTION = "coaching";

export async function getCoachingNotes() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching coaching notes:", error);
    throw new Error("Gagal mengambil data pembinaan");
  }
}

export async function getCoachingByStudent(studentId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching coaching by student:", error);
    throw new Error("Gagal mengambil data pembinaan siswa");
  }
}

export async function createCoachingNote(data, type) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      type,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const notificationRef = await addDoc(collection(db, "notifications"), {
      type: NOTIFICATION_TYPES.COACHING,
      title: type === "STP2K" ? "Pembinaan STP2K" : "Konseling BK",
      message: `Catatan ${type === "STP2K" ? "pembinaan" : "konseling"} baru telah ditambahkan`,
      studentId: data.studentId,
      coachingId: docRef.id,
      read: false,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating coaching note:", error);
    throw new Error("Gagal menambahkan catatan pembinaan");
  }
}
