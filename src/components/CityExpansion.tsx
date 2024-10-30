import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { cityService } from '../services/cityService';

const CityExpansion: React.FC = () => {
  const [cityAreas, setCityAreas] = useState(cityService.getCityAreas());
  const [cityFunds, setCityFunds] = useState(cityService.getCityData().funds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCityAreas(cityService.getCityAreas());
      setCityFunds(cityService.getCityData().funds);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleUnlock = (areaId: number) => {
    if (cityService.unlockArea(areaId)) {
      setCityAreas(cityService.getCityAreas());
      setCityFunds(cityService.getCityData().funds);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>City Expansion</Typography>
      <Grid container spacing={2}>
        {cityAreas.map((area) => (
          <Grid item xs={12} sm={6} md={4} key={area.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1">{area.name}</Typography>
              <Typography variant="body2">Size: {area.size}x{area.size}</Typography>
              {area.isUnlocked ? (
                <Typography variant="body2" color="success.main">Unlocked</Typography>
              ) : (
                <>
                  <Typography variant="body2">Cost: ${area.unlockCost.toLocaleString()}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleUnlock(area.id)}
                    disabled={cityFunds < area.unlockCost}
                    sx={{ mt: 1 }}
                  >
                    Unlock
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CityExpansion;