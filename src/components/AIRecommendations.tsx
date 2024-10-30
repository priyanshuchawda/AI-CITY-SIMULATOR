import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { aiService, cityService } from '../services';

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState(aiService.getRecommendations());

  useEffect(() => {
    const interval = setInterval(() => {
      setRecommendations(aiService.getRecommendations());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleImplementRecommendation = (action: string) => {
    cityService.implementAIRecommendation(action);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>AI Advisor</Typography>
      <List>
        {recommendations.map((rec, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={rec.action}
              secondary={rec.reason}
            />
            <Chip 
              label={rec.priority} 
              color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success'} 
              size="small" 
            />
            <Button onClick={() => handleImplementRecommendation(rec.action)}>Implement</Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AIRecommendations;