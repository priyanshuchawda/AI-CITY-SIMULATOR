import React from 'react';
import { Paper, Typography, Box, LinearProgress, Slider } from '@mui/material';

interface CityStatisticsProps {
  cityData: {
    population: number;
    funds: number;
    happiness: number;
  };
  currentTime: string;
  timeSpeed: number;
  onSpeedChange: (event: Event, newValue: number | number[]) => void;
}

const CityStatistics: React.FC<CityStatisticsProps> = ({ cityData, currentTime, timeSpeed, onSpeedChange }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>City Statistics</Typography>
      <Typography>Population: {cityData.population.toLocaleString()}</Typography>
      <Typography>Funds: ${cityData.funds.toLocaleString()}</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>Happiness</Typography>
        <LinearProgress 
          variant="determinate" 
          value={cityData.happiness} 
          color={cityData.happiness > 66 ? "success" : cityData.happiness > 33 ? "warning" : "error"}
        />
        <Typography variant="body2" color="text.secondary">
          {cityData.happiness.toFixed(2)}%
        </Typography>
      </Box>
      <Typography>Time: {currentTime}</Typography>
      <Box sx={{ width: 200 }}>
        <Typography id="time-speed-slider" gutterBottom>
          Time Speed: {timeSpeed}x
        </Typography>
        <Slider
          value={timeSpeed}
          onChange={onSpeedChange}
          aria-labelledby="time-speed-slider"
          step={1}
          marks
          min={1}
          max={5}
          valueLabelDisplay="auto"
        />
      </Box>
    </Paper>
  );
};

export default CityStatistics;


