import React, { useEffect, useState, useRef } from 'react';
import ioClient from 'socket.io-client';
import bulkChatService from '../services/bulkChatService';

// Simple chat widget that connects to Socket.IO and falls back to REST
export default function BulkSellerChatWidget({ sellerId, buyerId, token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!sellerId || !buyerId) return;

    // Load existing conversation via REST
    const load = async () => {
      try {
        const res = await bulkChatService.getConversation(sellerId, buyerId, token);
        setMessages(res.data || []);
      } catch (err) {
        console.error('Failed to load conversation', err);
      }
    };
    load();

    // Connect socket
  const socket = ioClient('http://localhost:5000', { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.emit('join_conversation', { seller_id: sellerId, buyer_id: buyerId });

    socket.on('new_message', (msg) => {
      if (!msg) return;
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
    const payload = { seller_id: sellerId, buyer_id: buyerId, message: text, sent_by: 'seller' };
    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('send_message', payload, (ack) => {
          if (!ack || !ack.success) console.warn('Socket ack failed', ack);
        });
      } else {
        // fallback to REST
        await bulkChatService.createMessage(payload, token);
        const res = await bulkChatService.getConversation(sellerId, buyerId, token);
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
