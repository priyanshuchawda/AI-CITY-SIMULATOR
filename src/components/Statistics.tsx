import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statisticsService } from '../services/statisticsService';
import { timeService } from '../services/timeService';

const Statistics: React.FC = () => {
  const [history, setHistory] = useState(statisticsService.getHistory());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHistory(statisticsService.getHistory());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time: number) => {
    return timeService.getFormattedTime();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>City Statistics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip labelFormatter={formatTime} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="population" stroke="#8884d8" />
                <Line yAxisId="left" type="monotone" dataKey="happiness" stroke="#82ca9d" />
                <Line yAxisId="right" type="monotone" dataKey="funds" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                <YAxis />
                <Tooltip labelFormatter={formatTime} />
                <Legend />
                <Line type="monotone" dataKey="gdp" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                <YAxis />
                <Tooltip labelFormatter={formatTime} />
                <Legend />
                <Line type="monotone" dataKey="unemploymentRate" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;