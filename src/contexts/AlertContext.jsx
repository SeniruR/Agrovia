import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertNotification from '../components/ui/AlertNotification';

// Create context
const AlertContext = createContext();

/**
 * AlertProvider component to manage application alerts
 */
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 4000,
    position: 'top-center'
  });

  const showAlert = useCallback(({ message, severity = 'info', duration = 4000, position = 'top-center' }) => {
    setAlert({
      open: true,
      message,
      severity,
      duration,
      position
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    showAlert({ message, severity: 'success', ...options });
  }, [showAlert]);

  const error = useCallback((message, options = {}) => {
    showAlert({ message, severity: 'error', ...options });
  }, [showAlert]);

  const warning = useCallback((message, options = {}) => {
    showAlert({ message, severity: 'warning', ...options });
  }, [showAlert]);

  const info = useCallback((message, options = {}) => {
    showAlert({ message, severity: 'info', ...options });
  }, [showAlert]);

  return (
    <AlertContext.Provider 
      value={{ 
        showAlert, 
        hideAlert, 
        success, 
        error, 
        warning, 
        info 
      }}
    >
      {children}
      <AlertNotification
        open={alert.open}
        onClose={hideAlert}
        message={alert.message}
        severity={alert.severity}
        duration={alert.duration}
        position={alert.position}
      />
    </AlertContext.Provider>
  );
};

/**
 * Custom hook to use the alert context
 * @returns {Object} Alert context with showAlert, hideAlert, success, error, warning, info methods
 */
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};