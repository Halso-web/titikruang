'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Smile,
  Image as ImageIcon,
  Send,
  Hash,
} from 'lucide-react';
import {
  initAuth,
  listenAuth,
  getMessagesQuery,
  sendMessage,
  toggleReaction,
} from '../../lib/firebase';
import { onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function DiskusiPage() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const activeChannel = 'general';

  // Generate or retrieve persistent anonymous name per user
  const getOrCreateAnonName = (uid) => {
    const key = `anon-name-${uid}`;
    let storedName = localStorage.getItem(key);
    if (!storedName) {
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      storedName = `Anon-${random}`;
      localStorage.setItem(key, storedName);
    }
    return storedName;
  };

  useEffect(() => {
    initAuth();
    const unsub = listenAuth(setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = getMessagesQuery(activeChannel);
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [activeChannel]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const senderName = getOrCreateAnonName(user.uid);

    await sendMessage(activeChannel, {
      text: input.trim(),
      uid: user.uid,
      senderName,
      reactions: {},
      timestamp: serverTimestamp(),
    });

    setInput('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReaction = async (msgId, emoji) => {
    if (!user) return;
    await toggleReaction(activeChannel, msgId, emoji, user.uid);
  };

  return (
    <div className="flex flex-col h-screen bg-[#EAF0FA] text-black font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md border-b border-[#F2BF27] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium bg-[#3061F2] text-white">
            <Hash className="w-4 h-4" />
            {activeChannel}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="bg-white text-sm px-3 py-1 rounded-md border border-[#F2BF27] shadow-sm focus:outline-none"
        />
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex flex-col gap-2 bg-white rounded-xl shadow p-4 hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F28907] flex items-center justify-center font-bold text-white text-sm uppercase shadow">
                {msg.uid?.slice(-2) ?? '??'}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-semibold text-black">
                    {msg.senderName ?? 'Anon'}
                  </span>{' '}
                  {msg.timestamp?.toDate?.().toLocaleString?.() ?? '...'}
                </p>
                <p className="text-gray-800">{msg.text}</p>
              </div>
            </div>

            {/* Emoji Reactions */}
            <div className="flex gap-2 pl-14 pt-1">
              {['👍', '😂', '🔥'].map((emoji) => {
                const count = msg.reactions?.[emoji]?.length || 0;
                const hasReacted = msg.reactions?.[emoji]?.includes(user?.uid);

                return (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(msg.id, emoji)}
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full border transition ${
                      hasReacted
                        ? 'bg-[#3061F2] text-white border-[#3061F2]'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                    {count > 0 && <span>{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-t border-[#F2BF27]">
        <div className="flex items-center gap-3">
          <button className="text-[#3061F2] hover:text-[#F2780C] transition">
            <ImageIcon className="w-5 h-5" />
          </button>
          <button className="text-[#3061F2] hover:text-[#F2780C] transition">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder={`Message #${activeChannel}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#27A4F2]"
          />
          <button
            onClick={handleSend}
            className="bg-[#3061F2] hover:bg-[#27A4F2] text-white p-2 rounded-lg transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
