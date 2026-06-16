import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";

const COLLECTION = "users";

export async function getUsers() {
  try {
    const q = query(collection(db, COLLECTION), orderBy("fullName"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Gagal mengambil data pengguna");
  }
}

export async function getUser(id) {
  try {
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    if (!snapshot.exists()) throw new Error("Pengguna tidak ditemukan");
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Gagal mengambil data pengguna");
  }
}

export async function createUser(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data, isActive: true };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Gagal menambahkan pengguna");
  }
}

export async function updateUser(id, data) {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Gagal memperbarui data pengguna");
  }
}

export async function toggleUserActive(id, isActive) {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      isActive,
      updatedAt: serverTimestamp(),
    });
    return { id, isActive };
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw new Error("Gagal mengubah status pengguna");
  }
}
