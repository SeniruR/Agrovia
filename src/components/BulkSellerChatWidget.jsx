import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import bulkChatService from '../services/bulkChatService';

// Simple chat widget that connects to Socket.IO and falls back to REST
export default function BulkSellerChatWidget({ sellerId, buyerId, token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const endRef = useRef(null);

  // helper: decode jwt payload (no external deps) to read user id if needed
  const decodeJwt = (t) => {
    try {
      if (!t) return null;
      const parts = t.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return json;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    if (!sellerId || !buyerId) return;

    // Load existing conversation via REST
    const load = async () => {
      try {
        // clear while loading
        setMessages([]);
        const res = await bulkChatService.getConversation(sellerId, buyerId, token);
        const rows = res && res.data ? res.data : (res || []);
        // Ensure we only keep messages that belong to this seller<->buyer conversation
        const filtered = (rows || []).filter((m) => {
          const s = Number(m.seller_id);
          const b = Number(m.buyer_id);
          return (s === Number(sellerId) && b === Number(buyerId)) || (s === Number(buyerId) && b === Number(sellerId));
        });
        setMessages(filtered);
      } catch (err) {
        console.error('Failed to load conversation', err);
      }
    };
    load();

    // Connect socket
    const authToken = token || localStorage.getItem('token');
    const socket = io('http://localhost:5000', { auth: { token: authToken } });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      // Join room after connected
      socket.emit('join_conversation', { seller_id: sellerId, buyer_id: buyerId });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => {
      console.error('Socket connect_error', err && err.message ? err.message : err);
    });

    socket.on('new_message', (msg) => {
      if (!msg) return;
      // Only append messages that belong to current conversation
      const s = Number(msg.seller_id);
      const b = Number(msg.buyer_id);
      const belongs = (s === Number(sellerId) && b === Number(buyerId)) || (s === Number(buyerId) && b === Number(sellerId));
      if (!belongs) return;
      // Append authoritative message from server
      setMessages((m) => [...m, msg]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sellerId, buyerId, token]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const authToken = token || localStorage.getItem('token');
    const decoded = decodeJwt(authToken);
    // infer sender: if decoded.userId matches sellerId -> seller, else buyer
    let inferredSender = 'seller';
    if (decoded) {
      const uid = Number(decoded.userId || decoded.id || decoded.user_id);
      if (uid && uid !== Number(sellerId)) inferredSender = 'buyer';
    }

    const payload = { seller_id: sellerId, buyer_id: buyerId, message: text, sent_by: inferredSender };
    try {
      // optimistic UI: push a temp message; server will broadcast final
      const temp = { id: `temp_${Date.now()}`, ...payload, created_at: new Date().toISOString() };
      setMessages((m) => [...m, temp]);

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('send_message', payload, (ack) => {
          if (!ack || !ack.success) console.warn('Socket ack failed', ack);
        });
      } else {
        // fallback to REST
        await bulkChatService.createMessage(payload, authToken);
        const res = await bulkChatService.getConversation(sellerId, buyerId, authToken);
        setMessages(res.data || []);
      }
      setText('');
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
        <div>Chat</div>
        <div style={{ fontSize: 12, color: connected ? 'green' : 'gray' }}>{connected ? 'Online' : 'Offline'}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 8, display: 'flex', justifyContent: m.sent_by === 'seller' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '70%', background: m.sent_by === 'seller' ? '#43e97b' : '#fff', color: m.sent_by === 'seller' ? '#fff' : '#222', padding: 10, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 14 }}>{m.message}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>{new Date(m.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }} placeholder="Type a message..." />
        <button onClick={sendMessage} style={{ background: '#43e97b', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8 }}>Send</button>
      </div>
    </div>
  );
}
