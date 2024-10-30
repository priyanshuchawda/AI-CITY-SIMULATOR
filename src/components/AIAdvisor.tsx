import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import { aiService } from '../services/aiService';

const AIAdvisor: React.FC = () => {
  const recommendations = aiService.getRecommendations();

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>AI Advisor Recommendations</Typography>
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
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AIAdvisor;