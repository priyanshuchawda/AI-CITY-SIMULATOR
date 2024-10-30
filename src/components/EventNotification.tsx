import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { cityService, eventService } from '../services';
import { CityEvent } from '../services/eventService'; // Import the CityEvent type

const EventNotification: React.FC = () => {
  const [event, setEvent] = useState<CityEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkForEvent = () => {
      const currentEvent = eventService.getCurrentEvent();
      if (currentEvent && !open) {
        setEvent(currentEvent);
        setOpen(true);
      }
    };

    const intervalId = setInterval(checkForEvent, 1000);
    return () => clearInterval(intervalId);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{event.name}</DialogTitle>
      <DialogContent>
        <Typography>{event.description}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>Effects:</Typography>
        <ul>
          {Object.entries(event.effects).map(([key, value]) => (
            <li key={key}>
              {key}: {typeof value === 'number' && (value > 0 ? '+' : '')}{value}
              {(key === 'population' || key === 'infrastructure') && '%'}
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventNotification;