import React from 'react';
import { Paper, Typography, Button, Grid } from '@mui/material';
import { disasterService, Disaster } from '../services/disasterService';

const DisasterManager: React.FC = () => {
  const activeDisasters = disasterService.getActiveDisasters();

  const handleRespond = (disasterId: string) => {
    disasterService.respondToDisaster(disasterId);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Emergency Management</Typography>
      {activeDisasters.length === 0 ? (
        <Typography>No active disasters.</Typography>
      ) : (
        <Grid container spacing={2}>
          {activeDisasters.map((disaster: Disaster) => (
            <Grid item xs={12} key={disaster.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">{disaster.name}</Typography>
                <Typography variant="body2">{disaster.description}</Typography>
                <Typography variant="body2">Severity: {disaster.severity}/10</Typography>
                <Typography variant="body2">Duration: {disaster.duration} days</Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleRespond(disaster.id)}
                  sx={{ mt: 1 }}
                >
                  Respond
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default DisasterManager;