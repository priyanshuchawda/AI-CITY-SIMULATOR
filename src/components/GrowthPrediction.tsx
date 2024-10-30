import React, { useState, useEffect } from 'react';
import { Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { aiService } from '../services/aiService';

type MetricType = 'population' | 'economy' | 'happiness';

const GrowthPrediction: React.FC = () => {
  const [predictionData, setPredictionData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<MetricType[]>(['population']);

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await aiService.predictGrowth(30);
      setPredictionData(predictions);
    };

    fetchPredictions();
  }, []);

  const handleMetricChange = (event: React.MouseEvent<HTMLElement>, newMetrics: MetricType[]) => {
    setMetrics(newMetrics);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>City Growth Prediction (30 Days)</Typography>
      <ToggleButtonGroup value={metrics} onChange={handleMetricChange} aria-label="metrics">
        <ToggleButton value="population" aria-label="population">
          Population
        </ToggleButton>
        <ToggleButton value="economy" aria-label="economy">
          Economy
        </ToggleButton>
        <ToggleButton value="happiness" aria-label="happiness">
          Happiness
        </ToggleButton>
      </ToggleButtonGroup>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={predictionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          {metrics.includes('population') && <Line type="monotone" dataKey="population" stroke="#8884d8" />}
          {metrics.includes('economy') && <Line type="monotone" dataKey="economy" stroke="#82ca9d" />}
          {metrics.includes('happiness') && <Line type="monotone" dataKey="happiness" stroke="#ffc658" />}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default GrowthPrediction;