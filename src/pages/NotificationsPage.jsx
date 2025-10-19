import React, { useEffect, useState, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Function to handle clicking on a notification
  const handleNotificationClick = async (notification) => {
    console.log('🔔 Full notification object:', notification);
    
    // Mark notification as read in the database
    try {
      const base = (window.__ENV__ && window.__ENV__.REACT_APP_API_URL) || 'http://localhost:5000';
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const notificationIdToMark = notification.id || notification.notification_id;
        console.log('🔴 Marking notification as read:', notificationIdToMark);
        
        const markReadResponse = await fetch(`${base}/api/v1/notifications/mark-read/${notificationIdToMark}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (markReadResponse.ok) {
          console.log('✅ Notification marked as read successfully');
          
          // Don't remove notification from the page - just update its read status visually
          // The notification should remain visible on the notifications page
          setNotifications(prev => prev.map(n => {
            if ((n.id || n.notification_id) === notificationIdToMark) {
              return { ...n, is_read: 1, readAt: new Date().toISOString() };
            }
            return n;
          }));
        } else {
          console.warn('⚠️ Failed to mark notification as read:', markReadResponse.status);
        }
      }
    } catch (err) {
      console.warn('⚠️ Error marking notification as read:', err);
    }
    
    // Extract pest alert ID from notification with extensive debugging
    let alertId = null;
    
    // Try all possible ID fields
    const possibleIdFields = [
      'alertId', 'pest_alert_id', 'related_id', 'reference_id', 
      'id', 'notification_id', '_id', 'pestAlertId', 'alert_id'
    ];
    
    for (const field of possibleIdFields) {
      if (notification[field]) {
        alertId = notification[field];
        console.log(`🆔 Found alert ID in field '${field}':`, alertId);
        break;
      }
    }
    
    // If no direct ID found, try to extract from message/title
    if (!alertId) {
      const title = notification.title || notification.notification_title || '';
      const message = notification.message || notification.notification_message || '';
      
      // Look for patterns like "Alert ID: 123" or similar in the message
      const idPattern = /(?:alert\s*id|id|#)[\s:]*(\d+)/i;
      const titleMatch = title.match(idPattern);
      const messageMatch = message.match(idPattern);
      
      if (titleMatch) {
        alertId = titleMatch[1];
        console.log('🆔 Extracted alert ID from title:', alertId);
      } else if (messageMatch) {
        alertId = messageMatch[1];
        console.log('🆔 Extracted alert ID from message:', alertId);
      }
    }
    
    console.log('🎯 Final alert ID to search:', alertId);
    console.log('📝 Notification title:', notification.title || notification.notification_title);
    console.log('💬 Notification message:', notification.message || notification.notification_message);
    
    // Navigate with comprehensive debugging data
    navigate('/pestalert/view', { 
      state: { 
        openAlertId: alertId,
        fromNotification: true,
        notificationData: notification,
        searchTerms: [
          notification.title || notification.notification_title || '',
          notification.message || notification.notification_message || '',
          // Extract pest name from common patterns
          ...(notification.title || '').split(' ').filter(word => word.length > 3),
          ...(notification.message || '').split(' ').filter(word => word.length > 3)
        ].filter(Boolean),
        debugInfo: {
          notificationId: notification.id || notification.notification_id,
          timestamp: new Date().toISOString(),
          userClick: true
        }
      } 
    });
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    let userObj;
    try { userObj = JSON.parse(userStr); } catch { return; }

    // fetch existing notifications for this farmer
    const fetchNotifications = async () => {
      try {
        // Default to backend port if no base URL is set
        const base = (window.__ENV__ && window.__ENV__.REACT_APP_API_URL) || 'http://localhost:5000';
        // Use the new endpoint for ALL notifications (read and unread)
        const url = `${base}/api/v1/notifications/all-my-notifications`;
        console.log('Fetching ALL notifications from:', url);
        
        const headers = {
          'Content-Type': 'application/json',
        };
        
        console.log('User object from localStorage:', userObj);
        
        // Get the token from separate authToken localStorage item
        const token = localStorage.getItem('authToken');
        console.log('Token from authToken localStorage:', token ? token.substring(0, 20) + '...' : 'No token');
        
        // Add authorization if we have a token
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log('Authorization header:', headers['Authorization'].substring(0, 30) + '...');
        } else {
          console.log('No token found in localStorage');
          console.error('Cannot fetch notifications - user not logged in properly');
          return;
        }
        
        console.log('Final headers being sent:', headers);
        
        const res = await fetch(url, { headers });
        console.log('Response status:', res.status, res.statusText);
        
        if (!res.ok) {
          console.error('API response not ok:', res.status, res.statusText);
          const errorText = await res.text();
          console.error('Error response body:', errorText);
          return;
        }
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON:', contentType);
          const text = await res.text();
          console.error('Response body:', text.substring(0, 200));
          return;
        }
        
        const data = await res.json();
        setNotifications(data || []);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    fetchNotifications();

    const SOCKET_URL = (window.__ENV__ && window.__ENV__.REACT_APP_SOCKET_URL) || 'http://localhost:5000';
    socketRef.current = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    // Check if we have a valid token before connecting
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found, skipping socket connection');
      return;
    }

    socketRef.current.on('connect', () => {
      socketRef.current.emit('register', { userId: userObj.id, userType: userObj.user_type, premium: !!userObj.premium });
    });

    socketRef.current.on('new_pest_alert', (notification) => {
      if (notification && notification.type === 'pest_alert') {
        setNotifications(prev => [notification, ...prev]);
      }
    });

    // Listen for notificationRead events from other parts of the app
    const onNotificationRead = (e) => {
      try {
        const id = e?.detail?.notificationId;
        if (!id) return;
        setNotifications(prev => prev.filter(n => (n.id || n.notification_id) !== id));
      } catch (err) {
        console.warn('Failed to process notificationRead event', err);
      }
    };
    window.addEventListener('notificationRead', onNotificationRead);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      window.removeEventListener('notificationRead', onNotificationRead);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-green-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <BellIcon className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-green-800">Pest Alert Notifications</h1>
        </div>
        <div className="divide-y divide-green-50 max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No pest alert notifications yet.</div>
          ) : notifications.map(n => (
            <div 
              key={n.id || n.notification_id} 
              className={`flex items-start gap-4 p-6 hover:bg-green-50/60 transition-all group cursor-pointer border-l-4 border-transparent hover:border-green-500 ${
                n.is_read || n.readAt ? 'opacity-70 bg-gray-50/30' : 'bg-white'
              }`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className={`font-semibold text-slate-800 group-hover:text-green-700 transition-colors text-lg ${
                    n.is_read || n.readAt ? 'text-gray-600' : 'text-slate-800'
                  }`}>
                    {n.title || n.notification_title || 'Pest Alert'}
                  </div>
                  {!(n.is_read || n.readAt) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      New
                    </span>
                  )}
                </div>
                <div className={`text-sm mt-1 ${
                  n.is_read || n.readAt ? 'text-gray-1000' : 'text-slate-600'
                }`}>
                  {n.message || n.notification_message || n.description}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                  {(n.is_read || n.readAt) && (
                    <span className="ml-2 text-green-600">✓ Read</span>
                  )}
                </div>
                <div className="text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view details →
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/" className="text-green-700 font-semibold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
