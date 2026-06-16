import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";

const COLLECTION = "violation_categories";

export async function getCategories() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("name")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Gagal mengambil data kategori");
  }
}

export async function createCategory(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Gagal menambahkan kategori");
  }
}

export async function updateCategory(id, data) {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Gagal memperbarui kategori");
  }
}

export async function deleteCategory(id) {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return id;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Gagal menghapus kategori");
  }
}
