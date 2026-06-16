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
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { NOTIFICATION_TYPES } from "../constants";

const COLLECTION = "letters";

const MONTH_ROMAN = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
];

export async function getLetters() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching letters:", error);
    throw new Error("Gagal mengambil data surat");
  }
}

export async function getLetter(id) {
  try {
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    if (!snapshot.exists()) throw new Error("Surat tidak ditemukan");
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error fetching letter:", error);
    throw new Error("Gagal mengambil data surat");
  }
}

export async function generateLetterNumber(type) {
  try {
    const now = new Date();
    const monthRoman = MONTH_ROMAN[now.getMonth()];
    const year = now.getFullYear();

    const q = query(
      collection(db, COLLECTION),
      where("type", "==", type),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const count = snapshot.size + 1;

    return `${count}/${type}/SMK-TEX/${monthRoman}/${year}`;
  } catch (error) {
    console.error("Error generating letter number:", error);
    throw new Error("Gagal membuat nomor surat");
  }
}

export async function createLetter(data) {
  try {
    const letterNumber = await generateLetterNumber(data.type);
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      letterNumber,
      status: "DRAFT",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "notifications"), {
      type: NOTIFICATION_TYPES.LETTER,
      title: "Surat Baru",
      message: `Surat ${data.type} telah dibuat dengan nomor ${letterNumber}`,
      studentId: data.studentId,
      letterId: docRef.id,
      read: false,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, ...data, letterNumber, status: "DRAFT" };
  } catch (error) {
    console.error("Error creating letter:", error);
    throw new Error("Gagal membuat surat");
  }
}

export async function updateLetterStatus(id, status) {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      status,
      updatedAt: serverTimestamp(),
    });
    return { id, status };
  } catch (error) {
    console.error("Error updating letter status:", error);
    throw new Error("Gagal memperbarui status surat");
  }
}

export async function getLettersByStudent(studentId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching letters by student:", error);
    throw new Error("Gagal mengambil data surat siswa");
  }
}
