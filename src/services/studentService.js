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
} from "firebase/firestore";
import { db } from "../lib/firebase/config";

const COLLECTION = "students";

export async function getStudents() {
  try {
    const q = query(collection(db, COLLECTION), orderBy("fullName"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Gagal mengambil data siswa");
  }
}

export async function getStudent(id) {
  try {
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    if (!snapshot.exists()) throw new Error("Siswa tidak ditemukan");
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error fetching student:", error);
    throw new Error("Gagal mengambil data siswa");
  }
}

export async function createStudent(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      totalPoints: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data, totalPoints: 0 };
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Gagal menambahkan siswa");
  }
}

export async function updateStudent(id, data) {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  } catch (error) {
    console.error("Error updating student:", error);
    throw new Error("Gagal memperbarui data siswa");
  }
}

export async function deleteStudent(id) {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return id;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw new Error("Gagal menghapus siswa");
  }
}

export async function searchStudents(searchTerm) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("fullName", ">=", searchTerm),
      where("fullName", "<=", searchTerm + "\uf8ff")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error searching students:", error);
    throw new Error("Gagal mencari siswa");
  }
}
