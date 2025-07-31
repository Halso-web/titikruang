"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  db,
  initAuth,
  listenAuth,
  getMessagesQuery,
  sendMessage,
} from "../../../lib/firebase";
import { onSnapshot } from "firebase/firestore";

export default function GroupPage() {
  const { groupId } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Init auth
  useEffect(() => {
    initAuth();
    const unsub = listenAuth(setUser);
    return () => unsub();
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages
  useEffect(() => {
    if (!groupId) return;

    const q = getMessagesQuery(groupId);
    const unsub = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsub();
  }, [groupId]);

  // Handle send
  const handleSend = async () => {
    if (!input.trim() || !user) return;

    try {
      await sendMessage(groupId, {
        text: input.trim(),
        uid: user.uid,
        senderName: "Anon",
      });
      setInput("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // Send with Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-xl font-bold mb-4">Group: {groupId}</h1>
      <div className="border rounded-lg h-[60vh] overflow-y-auto p-4 bg-white shadow">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-3">
            <div className="text-sm font-semibold text-gray-800">
              {msg.senderName}
            </div>
            <div className="text-gray-700">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="flex-1 border rounded-lg p-2 resize-none"
          placeholder="Tulis pesan..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
