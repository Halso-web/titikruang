"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserGroups,
  createGroup,
  initAuth,
  listenAuth,
} from "../../lib/firebase";
import { PlusCircle, Loader2 } from "lucide-react";

export default function GroupListPage() {
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    initAuth();
    listenAuth(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userGroups = await getUserGroups(authUser.uid);
        setGroups(userGroups);
        setLoading(false);
      }
    });
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setCreating(true);
    setError("");

    try {
      const groupId = await createGroup(newGroupName.trim(), user.uid);
      setNewGroupName("");
      const updatedGroups = await getUserGroups(user.uid);
      setGroups(updatedGroups);
      router.push(`/groups/${groupId}`); // ✅ fixed route
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#3061F2]">Grup Diskusi</h1>

      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Nama grup baru..."
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
        <button
          onClick={handleCreateGroup}
          disabled={creating}
          className="w-full flex items-center justify-center gap-2 bg-[#F2780C] text-white py-2 px-4 rounded-lg hover:bg-[#F28907] disabled:opacity-50"
        >
          {creating ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <PlusCircle size={18} />
          )}
          Buat Grup
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Grup Saya</h2>

      {loading ? (
        <p className="text-gray-500">Memuat grup...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500">Belum ada grup. Buat yang pertama!</p>
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => router.push(`/groups/${group.id}`)} // ✅ fixed route
              className="cursor-pointer px-4 py-3 bg-white shadow hover:shadow-md rounded-lg border border-gray-200 transition"
            >
              <div className="font-medium text-lg text-[#F25050]">{group.name}</div>
              <div className="text-sm text-gray-500">
                Dibuat oleh {group.createdBy.slice(0, 6)} | Jumlah anggota:{" "}
                {Object.keys(group.members || {}).length}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
