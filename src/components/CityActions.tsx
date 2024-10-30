import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { cityService, tutorialService, audioService } from '../services';

const CityActions: React.FC = () => {
  const handleImproveEducation = () => {
    try {
      cityService.updateEducation(100000);
      cityService.updateFunds(-100000);
      audioService.playSoundEffect('upgrade');
      if (tutorialService.getCurrentStep()?.action === "Click on 'Improve Education'") {
        tutorialService.nextStep();
      }
    } catch (err) {
      console.error('Error improving education:', err);
      // Handle error (e.g., show an alert)
    }
  };

  const handleImproveHealthcare = () => {
    try {
      cityService.updateHealthcare(200000);
      cityService.updateFunds(-200000);
      audioService.playSoundEffect('upgrade');
    } catch (err) {
      console.error('Error improving healthcare:', err);
      // Handle error
    }
  };

  const handleImproveInfrastructure = () => {
    try {
      cityService.updateInfrastructure(150000);
      cityService.updateFunds(-150000);
      audioService.playSoundEffect('upgrade');
    } catch (err) {
      console.error('Error improving infrastructure:', err);
      // Handle error
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>City Actions</Typography>
      <Button variant="contained" onClick={handleImproveEducation} sx={{ mr: 1, mb: 1 }}>
        Improve Education ($100,000)
      </Button>
      <Button variant="contained" onClick={handleImproveHealthcare} sx={{ mr: 1, mb: 1 }}>
        Improve Healthcare ($200,000)
      </Button>
      <Button variant="contained" onClick={handleImproveInfrastructure} sx={{ mb: 1 }}>
        Improve Infrastructure ($150,000)
      </Button>
    </Paper>
  );
};

export default CityActions;