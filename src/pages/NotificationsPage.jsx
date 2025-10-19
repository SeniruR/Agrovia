import React, { useEffect, useState, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [hasPestAlertAccess, setHasPestAlertAccess] = useState(true);
  const [pestAccessMessage, setPestAccessMessage] = useState('');
  const socketRef = useRef(null);
  const hasPestAlertAccessRef = useRef(true);
  const navigate = useNavigate();

  const createNotificationAlertMapping = (notificationId, alertId) => {
    if (!notificationId || !alertId) return;
    try {
      const mappings = JSON.parse(localStorage.getItem('notificationAlertMappings') || '{}');
      mappings[notificationId] = alertId;
      localStorage.setItem('notificationAlertMappings', JSON.stringify(mappings));
    } catch (err) {
      console.warn('Failed to store notification-alert mapping', err);
    }
  };

  const getAlertIdFromMapping = (notificationId) => {
    if (!notificationId) return null;
    try {
      const mappings = JSON.parse(localStorage.getItem('notificationAlertMappings') || '{}');
      return mappings[notificationId] || null;
    } catch (err) {
      console.warn('Failed to read notification-alert mapping', err);
      return null;
    }
  };

  const markNotificationAsReadLocally = (notificationId) => {
    if (!notificationId) return;
    setNotifications(prev => prev.map(n => {
      const currentId = n.recipientId || n.recipient_id || n.id || n.notification_id;
      if (currentId === notificationId) {
        return { ...n, is_read: 1, readAt: n.readAt || new Date().toISOString() };
      }
      return n;
    }));
  };

  // Function to handle clicking on a notification
  const handleNotificationClick = async (notification) => {
    console.log('🔔 Full notification object:', notification);
    const notificationType = notification.type || notification.alertType;
    const alertCategory = notification.alertCategory || (notificationType === 'weather_alert'
      ? 'weather'
      : notificationType === 'pest_alert'
        ? 'pest'
        : null);
    const isWeatherAlert = alertCategory === 'weather';
    let metaObject = null;
    if (notification.meta) {
      if (typeof notification.meta === 'string') {
        try {
          metaObject = JSON.parse(notification.meta);
        } catch (metaParseErr) {
          console.warn('⚠️ Failed to parse notification meta JSON', metaParseErr);
        }
      } else if (typeof notification.meta === 'object') {
        metaObject = notification.meta;
      }
    }
    
    // Mark notification as read in the database
    let markReadResult = null;
    try {
      const base = (window.__ENV__ && window.__ENV__.REACT_APP_API_URL) || 'http://localhost:5000';
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const notificationIdToMark = notification.recipientId || notification.recipient_id || notification.id || notification.notification_id;
        console.log('🔴 Marking notification as read:', notificationIdToMark);
        
        const markReadResponse = await fetch(`${base}/api/v1/notifications/mark-read/${notificationIdToMark}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (markReadResponse.status === 403) {
          let forbiddenPayload = {};
          try {
            forbiddenPayload = await markReadResponse.json();
          } catch (jsonError) {
            console.warn('⚠️ Failed to parse mark-read access JSON', jsonError);
          }
          setHasPestAlertAccess(false);
          setPestAccessMessage(forbiddenPayload?.message || 'Pest alerts are available with an active premium subscription.');
          setNotifications([]);
          window.dispatchEvent(new CustomEvent('notificationUnreadCountUpdated', { detail: { unreadCount: 0 } }));
          return;
        }

        if (markReadResponse.ok) {
          let result = null;
          try {
            result = await markReadResponse.json();
          } catch (jsonError) {
            console.warn('⚠️ Failed to parse mark-read response JSON', jsonError);
          }

          console.log('✅ Notification marked as read successfully');
          markReadResult = result;
          
          markNotificationAsReadLocally(notificationIdToMark);
          if (result?.alertId) {
            createNotificationAlertMapping(result.notificationId || notificationIdToMark, result.alertId);
          }
          if (typeof result?.unreadCount === 'number') {
            window.dispatchEvent(new CustomEvent('notificationUnreadCountUpdated', { detail: { unreadCount: result.unreadCount } }));
          }
          if (result?.hasAccess === false) {
            setHasPestAlertAccess(false);
            setPestAccessMessage(result.message || 'Pest alerts are available with an active premium subscription.');
            setNotifications([]);
            window.dispatchEvent(new CustomEvent('notificationUnreadCountUpdated', { detail: { unreadCount: 0 } }));
            return;
          }
        } else {
          console.warn('⚠️ Failed to mark notification as read:', markReadResponse.status);
        }
      }
    } catch (err) {
      console.warn('⚠️ Error marking notification as read:', err);
    }
    
    // Extract pest alert ID from notification with extensive debugging
    let alertId = null;
    const notificationId = notification.recipientId || notification.recipient_id || notification.id || notification.notification_id;
    const storedMapping = getAlertIdFromMapping(notificationId);
    if (storedMapping) {
      alertId = storedMapping;
      console.log('🔁 Using stored notification→alert mapping:', storedMapping);
    }
    
    // Try all possible ID fields
    const possibleIdFields = [
      'alertId', 'pest_alert_id', 'weather_alert_id', 'related_id', 'reference_id', 
      'id', 'notification_id', '_id', 'pestAlertId', 'weatherAlertId', 'alert_id'
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
    if (notificationId && alertId) {
      createNotificationAlertMapping(notificationId, alertId);
    }

    if (notificationId) {
      const derivedAlertId = alertId || markReadResult?.alertId || null;
      window.dispatchEvent(new CustomEvent('notificationRead', { detail: { notificationId, alertId: derivedAlertId, alertCategory } }));
    }
    
    const metaTerms = [];
    if (metaObject) {
      if (metaObject.pestName) metaTerms.push(metaObject.pestName);
      if (metaObject.weatherType) metaTerms.push(metaObject.weatherType);
    }

    // Navigate with comprehensive debugging data
  const targetRoute = isWeatherAlert ? '/weatheralerts' : '/pestalert/view';

    navigate(targetRoute, { 
      state: { 
        openAlertId: alertId,
        fromNotification: true,
        notificationData: notification,
        searchTerms: [
          notification.title || notification.notification_title || '',
          notification.message || notification.notification_message || '',
          // Extract pest name from common patterns
          ...(notification.title || '').split(' ').filter(word => word.length > 3),
          ...(notification.message || '').split(' ').filter(word => word.length > 3),
          ...metaTerms
        ].filter(Boolean),
        debugInfo: {
          notificationId: notification.recipientId || notification.recipient_id || notification.id || notification.notification_id,
          timestamp: new Date().toISOString(),
          userClick: true,
          alertCategory
        },
        alertCategory
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
          setHasPestAlertAccess(true);
          setPestAccessMessage('');
          return;
        }
        
        console.log('Final headers being sent:', headers);
        
        const res = await fetch(url, { headers });
        console.log('Response status:', res.status, res.statusText);
        
        if (!res.ok) {
          if (res.status === 403) {
            let forbiddenPayload = {};
            try {
              forbiddenPayload = await res.json();
            } catch (jsonErr) {
              console.warn('⚠️ Failed to parse subscription restriction payload', jsonErr);
            }
            setHasPestAlertAccess(false);
            setPestAccessMessage(forbiddenPayload?.message || 'Pest alerts are available with an active premium subscription.');
            setNotifications([]);
            return;
          }
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
        const hasAccess = data?.hasAccess !== false;
        setHasPestAlertAccess(hasAccess);

        if (!hasAccess) {
          setPestAccessMessage(data?.message || 'Pest alerts are available with an active premium subscription.');
          setNotifications([]);
          return;
        }

        setPestAccessMessage('');

        const notificationsPayload = Array.isArray(data)
          ? data
          : Array.isArray(data?.notifications)
            ? data.notifications
            : [];

        const formatted = notificationsPayload.map(item => ({
          ...item,
          time: item.created_at ? new Date(item.created_at).toLocaleString() : ''
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error('Failed to load notifications', err);
        setHasPestAlertAccess(true);
        setPestAccessMessage('');
      }
    };

    fetchNotifications();

    const SOCKET_URL = (window.__ENV__ && window.__ENV__.REACT_APP_SOCKET_URL) || 'http://localhost:5000';

    // Check if we have a valid token before connecting
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found, skipping socket connection');
      return;
    }

    socketRef.current = io(SOCKET_URL, { transports: ['websocket', 'polling'], auth: { token } });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('register', { userId: userObj.id, userType: userObj.user_type, premium: !!userObj.premium });
    });

    const handleIncomingNotification = (notification) => {
      if (!notification || !hasPestAlertAccessRef.current) {
        return;
      }

      const type = notification.type || notification.alertType;
      if (type !== 'pest_alert' && type !== 'weather_alert') {
        return;
      }

      setNotifications(prev => {
        const formatted = {
          ...notification,
          type,
          alertCategory: type === 'weather_alert' ? 'weather' : 'pest',
          time: notification.created_at ? new Date(notification.created_at).toLocaleString() : ''
        };
        const incomingKey = notification.recipientId || notification.recipient_id || notification.id || notification.notification_id;
        if (!incomingKey) return [formatted, ...prev];
        const exists = prev.some(n => {
          const existingKey = n.recipientId || n.recipient_id || n.id || n.notification_id;
          return existingKey === incomingKey;
        });
        if (exists) {
          return prev.map(n => {
            const existingKey = n.recipientId || n.recipient_id || n.id || n.notification_id;
            return existingKey === incomingKey ? formatted : n;
          });
        }
        return [formatted, ...prev];
      });
    };

    socketRef.current.on('new_pest_alert', handleIncomingNotification);
    socketRef.current.on('new_weather_alert', handleIncomingNotification);
    socketRef.current.on('new_notification', handleIncomingNotification);

    // Listen for notificationRead events from other parts of the app
    const onNotificationRead = (e) => {
      try {
    const id = e?.detail?.notificationId;
    if (!id) return;
    markNotificationAsReadLocally(id);
        const alertId = e?.detail?.alertId;
        if (alertId) {
          createNotificationAlertMapping(id, alertId);
        }
      } catch (err) {
        console.warn('Failed to process notificationRead event', err);
      }
    };
    window.addEventListener('notificationRead', onNotificationRead);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_pest_alert', handleIncomingNotification);
        socketRef.current.off('new_weather_alert', handleIncomingNotification);
        socketRef.current.off('new_notification', handleIncomingNotification);
        socketRef.current.disconnect();
      }
      window.removeEventListener('notificationRead', onNotificationRead);
    };
  }, []);

  useEffect(() => {
    hasPestAlertAccessRef.current = hasPestAlertAccess;
  }, [hasPestAlertAccess]);

  if (!hasPestAlertAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl border border-green-100 p-10 text-center">
          <BellIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-800 mb-3">Unlock Pest Alerts</h1>
          <p className="text-slate-600 mb-6">
            {pestAccessMessage || 'Pest alert notifications are reserved for premium farmer plans.'}
          </p>
          <Link
            to="/subscription-management"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors"
          >
            View Subscription Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-green-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <BellIcon className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-green-800">Alert Notifications</h1>
        </div>
        <div className="divide-y divide-green-50 max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No alert notifications yet.</div>
          ) : notifications.map(n => (
            <div 
              key={n.id || n.notification_id} 
              className={`flex items-start gap-4 p-6 hover:bg-green-50/60 transition-all group cursor-pointer border-l-4 border-transparent hover:border-green-500 ${
                n.is_read || n.readAt ? 'opacity-70 bg-gray-50/30' : 'bg-white'
              }`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="flex-shrink-0 mt-1"><BellIcon className="w-5 h-5 text-green-500" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    (n.alertCategory || n.type) === 'weather' || n.type === 'weather_alert'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {(n.alertCategory || n.type) === 'weather' || n.type === 'weather_alert' ? 'Weather' : 'Pest'}
                  </span>
                  <div className={`font-semibold text-slate-800 group-hover:text-green-700 transition-colors text-lg ${
                    n.is_read || n.readAt ? 'text-gray-600' : 'text-slate-800'
                  }`}>
                    {n.title || n.notification_title || ((n.alertCategory || n.type) === 'weather' || n.type === 'weather_alert' ? 'Weather Alert' : 'Pest Alert')}
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
                  {n.time || (n.created_at ? new Date(n.created_at).toLocaleString() : '')}
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
