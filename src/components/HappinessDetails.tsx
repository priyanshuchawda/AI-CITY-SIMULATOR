import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';
import { cityService } from '../services/cityService';

const HappinessDetails: React.FC = () => {
  const happinessFactors = cityService.getHappinessFactors();

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Citizen Happiness Factors</Typography>
      <Grid container spacing={2}>
        {Object.entries(happinessFactors).map(([factor, value]) => (
          <Grid item xs={6} sm={4} key={factor}>
            <Typography variant="subtitle1">{factor}</Typography>
            <Typography variant="h5">{value}%</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HappinessDetails;