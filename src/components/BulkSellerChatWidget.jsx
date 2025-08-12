import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to backend Socket.IO server
const socket = io('http://localhost:5000', { withCredentials: true });

export default function BulkSellerChat({ chatRoomId, userId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch chat history on mount
  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/bulk-seller-chat/messages/${chatRoomId}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [chatRoomId]);

  // Join room and listen for new messages
  useEffect(() => {
    socket.emit('joinRoom', chatRoomId);
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [chatRoomId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('sendMessage', {
      sender_id: userId,
      receiver_id: receiverId,
      message: input,
      chat_room_id: chatRoomId
    });
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, maxWidth: 400 }}>
      <div style={{ height: 300, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.sender_id === userId ? 'right' : 'left',
            margin: '4px 0',
            color: msg.sender_id === userId ? '#1976d2' : '#333'
          }}>
            <span>{msg.message}</span>
            <div style={{ fontSize: 10, color: '#888' }}>{msg.created_at}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none' }}>
          Send
        </button>
      </form>
    </div>
  );
}
