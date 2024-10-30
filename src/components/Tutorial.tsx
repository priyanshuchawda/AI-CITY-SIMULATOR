import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { tutorialService } from '../services/tutorialService';

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(tutorialService.getCurrentStep());

  const handleNextStep = () => {
    tutorialService.nextStep();
    setCurrentStep(tutorialService.getCurrentStep());
  };

  if (!currentStep) return null;

  return (
    <Paper sx={{ position: 'fixed', bottom: 20, left: 20, width: 300, p: 2 }}>
      <Typography variant="h6">{currentStep.title}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>{currentStep.content}</Typography>
      {currentStep.action && (
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
          Action: {currentStep.action}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNextStep}>
          {tutorialService.isTutorialComplete() ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default Tutorial;