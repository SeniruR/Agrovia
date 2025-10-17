import React, { useState, forwardRef, useEffect } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * AlertNotification component for displaying toast notifications
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the alert is open
 * @param {function} props.onClose - Function to call when the alert should close
 * @param {string} props.message - The message to display
 * @param {string} props.severity - The severity level ('success', 'info', 'warning', 'error')
 * @param {number} props.duration - How long the alert should stay open (ms)
 * @param {string} props.position - The position of the alert (e.g., 'top-center')
 * @returns {JSX.Element}
 */
const AlertNotification = ({ 
  open, 
  onClose, 
  message, 
  severity = 'info', 
  duration = 4000,
  position = 'top-center'
}) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Parse position
  const getPosition = () => {
    switch (position) {
      case 'top-center':
        return { vertical: 'top', horizontal: 'center' };
      case 'top-right':
        return { vertical: 'top', horizontal: 'right' };
      case 'top-left':
        return { vertical: 'top', horizontal: 'left' };
      case 'bottom-center':
        return { vertical: 'bottom', horizontal: 'center' };
      case 'bottom-right':
        return { vertical: 'bottom', horizontal: 'right' };
      case 'bottom-left':
        return { vertical: 'bottom', horizontal: 'left' };
      default:
        return { vertical: 'top', horizontal: 'center' };
    }
  };

  const { vertical, horizontal } = getPosition();

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertNotification;