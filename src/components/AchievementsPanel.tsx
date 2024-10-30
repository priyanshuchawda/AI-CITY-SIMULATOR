import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { achievementService, Achievement, Challenge } from '../services/achievementService';

const AchievementsPanel: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const updateAchievements = () => setAchievements(achievementService.getAchievements());
    const updateChallenges = () => setChallenges(achievementService.getChallenges());

    updateAchievements();
    updateChallenges();

    achievementService.on('achievementUnlocked', updateAchievements);
    achievementService.on('challengeCompleted', updateChallenges);

    return () => {
      achievementService.off('achievementUnlocked', updateAchievements);
      achievementService.off('challengeCompleted', updateChallenges);
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Achievements & Challenges</Typography>
      <Typography variant="subtitle1">Achievements</Typography>
      <List dense>
        {achievements.map((achievement) => (
          <ListItem key={achievement.id}>
            <ListItemText
              primary={achievement.name}
              secondary={
                <>
                  <Typography variant="body2">{achievement.description}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(achievement.progress / achievement.maxProgress) * 100}
                    color={achievement.isUnlocked ? "success" : "primary"}
                  />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Challenges</Typography>
      <List dense>
        {challenges.map((challenge) => (
          <ListItem key={challenge.id}>
            <ListItemText
              primary={challenge.name}
              secondary={
                <>
                  <Typography variant="body2">{challenge.description}</Typography>
                  <Typography variant="body2">Reward: ${challenge.reward.toLocaleString()}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(challenge.progress / challenge.maxProgress) * 100}
                    color={challenge.isCompleted ? "success" : "primary"}
                  />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AchievementsPanel;