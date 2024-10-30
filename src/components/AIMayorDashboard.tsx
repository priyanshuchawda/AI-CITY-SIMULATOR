import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { aiMayorService } from '../services/aiMayorService';

const AIMayorDashboard: React.FC = () => {
  const [cityScore, setCityScore] = useState(0);
  const [recentActions, setRecentActions] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCityScore(aiMayorService.getCityScore());
      // In a real implementation, you'd need to add a method to aiMayorService to get recent actions
      // setRecentActions(aiMayorService.getRecentActions());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>AI Mayor Dashboard</Typography>
      <Typography variant="body1">City Score: {cityScore.toFixed(2)}</Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Recent Actions:</Typography>
      <List dense>
        {recentActions.map((action, index) => (
          <ListItem key={index}>
            <ListItemText primary={action} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AIMayorDashboard;