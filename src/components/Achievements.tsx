import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import Draggable from 'react-draggable';
import { achievementService, Achievement } from '../services/achievementService';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(achievementService.getAchievements());
  }, []);

  return (
    <Draggable bounds="parent" handle=".handle">
      <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" gutterBottom className="handle" sx={{ cursor: 'move' }}>Achievements</Typography>
        <List>
          {achievements.map((achievement) => (
            <ListItem key={achievement.id}>
              <ListItemText
                primary={achievement.name}
                secondary={
                  <>
                    <Typography variant="body2">{achievement.description}</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(achievement.progress / achievement.target) * 100} 
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="body2" align="right">
                      {achievement.progress} / {achievement.target}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Draggable>
  );
};

export default Achievements;