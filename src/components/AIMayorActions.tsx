import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { aiMayorService } from '../services/aiMayorService';

const AIMayorActions: React.FC = () => {
  const [actions, setActions] = useState<string[]>([]);

  useEffect(() => {
    const handleAIAction = (action: string) => {
      setActions(prevActions => [action, ...prevActions.slice(0, 4)]);
    };

    aiMayorService.on('action', handleAIAction);

    return () => {
      aiMayorService.off('action', handleAIAction);
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>AI Mayor Actions</Typography>
      <List dense>
        {actions.map((action, index) => (
          <ListItem key={index}>
            <ListItemText primary={action} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AIMayorActions;