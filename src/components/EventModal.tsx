import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { eventService } from '../services/eventService';
import { audioService } from '../services/audioService';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ open, onClose }) => {
  const currentEvent = eventService.getCurrentEvent();

  const handleOptionClick = (optionIndex: number) => {
    eventService.handleEventOption(optionIndex);
    audioService.playSoundEffect('success');
    onClose();
  };

  React.useEffect(() => {
    if (open && currentEvent) {
      audioService.playSoundEffect('build'); // Play a sound when an event occurs
    }
  }, [open, currentEvent]);

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Add your modal content here */}
    </Dialog>
  );
};

export default EventModal;
