import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { tutorialService, TutorialStep } from '../services/tutorialService';

const TutorialOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentStep(tutorialService.getCurrentStep());
      setIsActive(tutorialService.isActiveTutorial());
    };

    tutorialService.on('update', handleUpdate);
    return () => {
      tutorialService.off('update', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (currentStep && currentStep.target) {
      const targetElement = document.querySelector(currentStep.target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep]);

  if (!isActive || !currentStep) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {currentStep.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {currentStep.content}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={() => tutorialService.previousStep()} disabled={currentStep.id === 'welcome'}>
            Previous
          </Button>
          <Button onClick={() => tutorialService.nextStep()} variant="contained">
            {currentStep.id === 'conclusion' ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TutorialOverlay;