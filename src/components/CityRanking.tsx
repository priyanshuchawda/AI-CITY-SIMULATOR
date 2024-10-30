import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { rankingService } from '../services/rankingService';

const CityRanking: React.FC = () => {
  const [rank, setRank] = useState(rankingService.getCurrentRank());

  useEffect(() => {
    const handleRankUpdate = (newRank: any) => {
      setRank(newRank);
    };

    rankingService.on('rankUpdated', handleRankUpdate);

    return () => {
      rankingService.off('rankUpdated', handleRankUpdate);
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>City Ranking</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Score: {rank.score.toLocaleString()}</Typography>
        <Typography>Tier: {rank.tier}</Typography>
        <Typography>Position: #{rank.position.toLocaleString()}</Typography>
      </Box>
    </Paper>
  );
};

export default CityRanking;