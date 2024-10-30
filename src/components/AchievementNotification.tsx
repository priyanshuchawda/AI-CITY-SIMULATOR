import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Achievement } from '../services/achievementService';

interface AchievementNotificationProps {
  achievement: Achievement | null;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (achievement) {
      setOpen(true);
    }
  }, [achievement]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Achievement Unlocked: {achievement?.name}
      </Alert>
    </Snackbar>
  );
};

export default AchievementNotification;