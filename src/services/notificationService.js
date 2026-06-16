import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";

const COLLECTION = "notifications";

export async function getNotifications(userId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Gagal mengambil data notifikasi");
  }
}

export async function createNotification(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      read: false,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data, read: false };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Gagal membuat notifikasi");
  }
}

export async function markAsRead(notificationId) {
  try {
    await updateDoc(doc(db, COLLECTION, notificationId), {
      read: true,
    });
    return notificationId;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Gagal menandai notifikasi");
  }
}

export async function markAllAsRead(userId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Gagal menandai semua notifikasi");
  }
}

export async function getUnreadCount(userId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw new Error("Gagal mengambil jumlah notifikasi");
  }
}
