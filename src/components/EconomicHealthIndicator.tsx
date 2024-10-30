import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface EconomicHealthIndicatorProps {
  gdp: number;
  unemploymentRate: number;
}

const EconomicHealthIndicator: React.FC<EconomicHealthIndicatorProps> = ({ gdp, unemploymentRate }) => {
  const calculateHealthScore = () => {
    // This is a simple calculation, you might want to make it more complex
    const gdpScore = Math.min(gdp / 1000000, 100); // Assume 1M GDP is perfect score
    const unemploymentScore = 100 - (unemploymentRate * 100);
    return (gdpScore + unemploymentScore) / 2;
  };

  const healthScore = calculateHealthScore();

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h6" gutterBottom>Economic Health</Typography>
      <LinearProgress 
        variant="determinate" 
        value={healthScore} 
        color={healthScore > 66 ? "success" : healthScore > 33 ? "warning" : "error"}
      />
      <Typography variant="body2" color="text.secondary">
        {healthScore.toFixed(2)}%
      </Typography>
    </Box>
  );
};

export default EconomicHealthIndicator;