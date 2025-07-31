import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  runTransaction,
  serverTimestamp,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyApCy23siP1bGcpM0sHnF9f91TqQ2Re0HY",
  authDomain: "anonymouschatforum.firebaseapp.com",
  projectId: "anonymouschatforum",
  storageBucket: "anonymouschatforum.appspot.com",
  messagingSenderId: "230830743478",
  appId: "1:230830743478:web:548ad86e945d53b982eb17",
  measurementId: "G-E2HPWW6TC4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, serverTimestamp };

//
// 🔐 AUTH
//
export const initAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((error) => {
        console.error("Auth Error:", error);
      });
    }
  });
};

export const listenAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

//
// ➕ GROUP MANAGEMENT
//
export const getGroupsQuery = () =>
  query(collection(db, "groups"), orderBy("createdAt", "desc"));

export const createGroup = async (name, userId) => {
  const userGroupsQuery = query(collection(db, "groups"), where("createdBy", "==", userId));
  const snapshot = await getDocs(userGroupsQuery);

  if (snapshot.size >= 10) {
    throw new Error("Kamu sudah membuat maksimal 10 grup.");
  }

  const docRef = await addDoc(collection(db, "groups"), {
    name,
    createdAt: serverTimestamp(),
    createdBy: userId,
    members: {
      [userId]: { role: "admin" },
    },
  });

  return docRef.id;
};

export const getUserGroups = async (userId) => {
  const snapshot = await getDocs(collection(db, "groups"));
  const groups = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.members && data.members[userId]) {
      groups.push({ id: docSnap.id, ...data });
    }
  });

  return groups;
};

export const addMember = async (groupId, adminId, userIdToAdd) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);
  const group = groupSnap.data();

  if (!group?.members[adminId] || group.members[adminId].role !== "admin") {
    throw new Error("Hanya admin yang bisa menambahkan anggota.");
  }

  await updateDoc(groupRef, {
    [`members.${userIdToAdd}`]: { role: "member" },
  });
};

export const removeMember = async (groupId, adminId, userIdToRemove) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);
  const group = groupSnap.data();

  if (!group?.members[adminId] || group.members[adminId].role !== "admin") {
    throw new Error("Hanya admin yang bisa menghapus anggota.");
  }

  const updatedMembers = { ...group.members };
  delete updatedMembers[userIdToRemove];

  await updateDoc(groupRef, {
    members: updatedMembers,
  });
};

//
// 📨 MESSAGES
//
export const getMessagesQuery = (groupId) => {
  return query(
    collection(db, "groups", groupId, "messages"),
    orderBy("timestamp", "asc")
  );
};

export const sendMessage = async (groupId, { text, uid, senderName, imageUrl = null }) => {
  if (!uid || !senderName || !text) {
    throw new Error("Missing required fields: uid, senderName, or text");
  }

  return await addDoc(collection(db, "groups", groupId, "messages"), {
    text,
    uid,
    senderName,
    imageUrl: imageUrl || null,
    timestamp: serverTimestamp(),
    reactions: {},
  });
};

//
// 😀 REACTIONS
//
export const toggleReaction = async (groupId, messageId, emoji, uid) => {
  const ref = doc(db, "groups", groupId, "messages", messageId);

  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(ref);
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const current = data.reactions?.[emoji] || [];

    const hasReacted = current.includes(uid);
    const updated = hasReacted
      ? current.filter((id) => id !== uid)
      : [...current, uid];

    transaction.update(ref, {
      [`reactions.${emoji}`]: updated,
    });
  });
};
