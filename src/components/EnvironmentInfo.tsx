import React, { useState, useEffect } from 'react';
import { Paper, Typography, Slider } from '@mui/material';
import { environmentService, WeatherCondition } from '../services/environmentService';
import { audioService } from '../services/audioService';

const EnvironmentInfo: React.FC = () => {
  const [time, setTime] = useState(0);
  const [day, setDay] = useState(1);
  const [weather, setWeather] = useState<WeatherCondition>({ type: 'clear', intensity: 0 });
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const handleUpdate = () => {
      setTime(environmentService.getTime());
      setDay(environmentService.getDay());
      setWeather(environmentService.getWeather());
    };
    environmentService.on('update', handleUpdate);
    return () => {
      environmentService.off('update', handleUpdate);
    };
  }, []);

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    audioService.setMasterVolume(newVolume);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Environment</Typography>
      <Typography>Day: {day}</Typography>
      <Typography>Time: {formatTime(time)}</Typography>
      <Typography>Weather: {weather.type} (Intensity: {weather.intensity.toFixed(2)})</Typography>
      <Typography gutterBottom>Volume</Typography>
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        aria-labelledby="continuous-slider"
        min={0}
        max={1}
        step={0.01}
      />
    </Paper>
  );
};

export default EnvironmentInfo;