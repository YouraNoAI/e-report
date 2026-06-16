import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase/config";
import { CASE_STATUS, NOTIFICATION_TYPES } from "../constants";

const COLLECTION = "violations";

export async function getViolations() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching violations:", error);
    throw new Error("Gagal mengambil data pelanggaran");
  }
}

export async function getViolation(id) {
  try {
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    if (!snapshot.exists()) throw new Error("Pelanggaran tidak ditemukan");
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error fetching violation:", error);
    throw new Error("Gagal mengambil data pelanggaran");
  }
}

export async function createViolation(data) {
  try {
    const batch = writeBatch(db);
    const violationRef = doc(collection(db, COLLECTION));

    batch.set(violationRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const studentRef = doc(db, "students", data.studentId);
    batch.update(studentRef, {
      totalPoints: increment(data.points || 0),
      updatedAt: serverTimestamp(),
    });

    const caseRef = doc(collection(db, "case_progress"));
    batch.set(caseRef, {
      studentId: data.studentId,
      violationId: violationRef.id,
      status: CASE_STATUS.PELANGGARAN_DICATAT,
      description: data.description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const notificationRef = doc(collection(db, "notifications"));
    batch.set(notificationRef, {
      type: NOTIFICATION_TYPES.VIOLATION,
      title: "Pelanggaran Baru",
      message: `Pelanggaran baru telah dicatat: ${data.description}`,
      studentId: data.studentId,
      violationId: violationRef.id,
      read: false,
      createdAt: serverTimestamp(),
    });

    await batch.commit();
    return { id: violationRef.id, ...data };
  } catch (error) {
    console.error("Error creating violation:", error);
    throw new Error("Gagal menambahkan pelanggaran");
  }
}

export async function updateViolation(id, data) {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  } catch (error) {
    console.error("Error updating violation:", error);
    throw new Error("Gagal memperbarui data pelanggaran");
  }
}

export async function deleteViolation(id) {
  try {
    const violation = await getViolation(id);
    const batch = writeBatch(db);

    batch.delete(doc(db, COLLECTION, id));

    const studentRef = doc(db, "students", violation.studentId);
    batch.update(studentRef, {
      totalPoints: increment(-(violation.points || 0)),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    return id;
  } catch (error) {
    console.error("Error deleting violation:", error);
    throw new Error("Gagal menghapus pelanggaran");
  }
}

export async function getViolationsByStudent(studentId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching violations by student:", error);
    throw new Error("Gagal mengambil data pelanggaran siswa");
  }
}

export async function uploadEvidence(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading evidence:", error);
    throw new Error("Gagal mengupload bukti");
  }
}
