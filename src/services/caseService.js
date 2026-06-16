import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { CASE_STATUS } from "../constants";

const COLLECTION = "case_progress";

export async function getCases() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching cases:", error);
    throw new Error("Gagal mengambil data kasus");
  }
}

export async function getCaseByStudent(studentId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching case by student:", error);
    throw new Error("Gagal mengambil data kasus siswa");
  }
}

export async function updateCaseStatus(progressId, status, userId, notes) {
  try {
    const ref = doc(db, COLLECTION, progressId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) throw new Error("Kasus tidak ditemukan");

    const timelineEntry = {
      from: snapshot.data().status,
      to: status,
      updatedBy: userId,
      notes: notes || "",
      timestamp: serverTimestamp(),
    };

    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
      timeline: [...(snapshot.data().timeline || []), timelineEntry],
    });

    return { id: progressId, status };
  } catch (error) {
    console.error("Error updating case status:", error);
    throw new Error("Gagal memperbarui status kasus");
  }
}

export async function getCaseTimeline(studentId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("studentId", "==", studentId),
      orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching case timeline:", error);
    throw new Error("Gagal mengambil riwayat kasus");
  }
}

export async function createCaseEntry(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      status: data.status || CASE_STATUS.DRAFT,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      timeline: [
        {
          from: null,
          to: data.status || CASE_STATUS.DRAFT,
          updatedBy: data.createdBy || "",
          notes: "Kasus baru dibuat",
          timestamp: serverTimestamp(),
        },
      ],
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating case entry:", error);
    throw new Error("Gagal membuat entri kasus");
  }
}
