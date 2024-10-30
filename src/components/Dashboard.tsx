import React, { useState, useEffect } from 'react';
import { Grid, Paper, Button, Typography, Box, LinearProgress, Slider, Tabs, Tab, Alert } from '@mui/material';
import { cityService, economyService, achievementService, aiService, eventService, tutorialService, audioService, timeService } from '../services';
import { saveLoadService } from '../services/saveLoadService';
import CityStatistics from './CityStatistics';
import CityActions from './CityActions';
import AIAdvisor from './AIAdvisor';
import TechTree from './TechTree';
import EconomyManager from './EconomyManager';
import Achievements from './Achievements';
import CityExpansion from './CityExpansion';
import Statistics from './Statistics';
import EventModal from './EventModal';

const Dashboard: React.FC = () => {
  const [cityData, setCityData] = useState(cityService.getCityData());
  const [industries, setIndustries] = useState(economyService.getEconomyData().industries);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(timeService.getFormattedTime());
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      audioService.playBackgroundMusic();
    } catch (err) {
      console.error('Failed to play background music:', err);
      setError('Failed to play background music. Please check your audio settings.');
    }
    return () => {
      try {
        audioService.stopBackgroundMusic();
      } catch (err) {
        console.error('Failed to stop background music:', err);
      }
    };
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      try {
        const newCityData = cityService.getCityData();
        const newEconomyData = economyService.getEconomyData();
        setCityData(newCityData);
        setIndustries(newEconomyData.industries);
        achievementService.checkAchievements();
        setAiRecommendation(aiService.getPrimaryRecommendation());
        if (eventService.getCurrentEvent()) {
          setEventModalOpen(true);
        }
      } catch (err) {
        console.error('Error updating city data:', err);
        setError('Failed to update city data. Some information may be inaccurate.');
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      try {
        setCurrentTime(timeService.getFormattedTime());
      } catch (err) {
        console.error('Error updating time:', err);
        setError('Failed to update game time. Time display may be inaccurate.');
      }
    };
    timeService.addCallback(updateTime);
    return () => timeService.removeCallback(updateTime);
  }, []);

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    const speed = newValue as number;
    setTimeSpeed(speed);
    timeService.setTimeSpeed(speed);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveGame = () => {
    try {
      saveLoadService.saveGame();
      // Optionally, show a success message to the user
    } catch (err) {
      console.error('Error saving game:', err);
      setError('Failed to save the game. Please try again.');
    }
  };

  const handleLoadGame = () => {
    try {
      if (saveLoadService.loadGame()) {
        // Refresh all state after loading
        setCityData(cityService.getCityData());
        setIndustries(economyService.getEconomyData().industries);
        // Optionally, show a success message to the user
      } else {
        // Optionally, show an error message to the user
      }
    } catch (err) {
      console.error('Error loading game:', err);
      setError('Failed to load the game. Please try again.');
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h4">City Dashboard</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" onClick={handleSaveGame}>Save Game</Button>
            <Button variant="contained" onClick={handleLoadGame}>Load Game</Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <CityStatistics cityData={cityData} currentTime={currentTime} timeSpeed={timeSpeed} onSpeedChange={handleSpeedChange} />
      </Grid>
      <Grid item xs={12} md={6}>
        <CityActions />
      </Grid>
      <Grid item xs={12}>
        <AIAdvisor recommendation={aiRecommendation} />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ mt: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Overview" />
            <Tab label="Economy" />
            <Tab label="Achievements" />
            <Tab label="Expansion" />
            <Tab label="Statistics" />
          </Tabs>
          <Box sx={{ p: 2 }}>
            {activeTab === 0 && <TechTree />}
            {activeTab === 1 && <EconomyManager industries={industries} />}
            {activeTab === 2 && <Achievements />}
            {activeTab === 3 && <CityExpansion />}
            {activeTab === 4 && <Statistics />}
          </Box>
        </Paper>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
        </Grid>
      )}
      <EventModal open={eventModalOpen} onClose={() => setEventModalOpen(false)} />
    </Grid>
  );
};

export default Dashboard;