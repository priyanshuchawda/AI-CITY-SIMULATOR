import React from 'react';
import { Button, Paper, Typography, Grid } from '@mui/material';
import { cityService } from '../services/cityService';
import { audioService } from '../services/audioService';

const CityControls: React.FC = () => {
  const handleAddFunds = () => {
    cityService.updateFunds(10000);
    audioService.playSoundEffect('cash');
  };

  const handleAddPopulation = () => {
    cityService.updatePopulation(100);
    audioService.playSoundEffect('population_increase');
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>City Controls</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" onClick={handleAddFunds}>Add $10,000</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleAddPopulation}>Add 100 Population</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CityControls;