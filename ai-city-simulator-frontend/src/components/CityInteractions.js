import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Grid, Button } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const CityInteractions = () => {
  const [cityData, setCityData] = useState({
    population: 100000,
    happiness: 50,
    funds: 1000000,
    energy: 50000,
    pollution: 30,
    technology: 50,
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/city/data`);
        setCityData(response.data);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHistory(prevHistory => [...prevHistory, { ...cityData, time: Date.now() }].slice(-20));
  }, [cityData]);

  const handleSliderChange = async (event, newValue, factor) => {
    try {
      const response = await axios.post(`${API_URL}/city/adjust`, { factor, value: newValue });
      setCityData(response.data);
    } catch (error) {
      console.error('Error adjusting city factor:', error);
    }
  };

  const simulateDisaster = async () => {
    try {
      const response = await axios.post(`${API_URL}/city/disaster`);
      setCityData(response.data);
    } catch (error) {
      console.error('Error simulating disaster:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          City Interactions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Energy Consumption</Typography>
            <Slider
              value={cityData.energy}
              onChange={(e, v) => handleSliderChange(e, v, 'energy')}
              aria-labelledby="energy-slider"
              valueLabelDisplay="auto"
              step={1000}
              min={0}
              max={100000}
            />
            <Typography gutterBottom>Technology Investment</Typography>
            <Slider
              value={cityData.technology}
              onChange={(e, v) => handleSliderChange(e, v, 'technology')}
              aria-labelledby="technology-slider"
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={100}
            />
            <Button variant="contained" color="secondary" onClick={simulateDisaster}>
              Simulate Disaster
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <LineChart width={500} height={300} data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip labelFormatter={(unixTime) => new Date(unixTime).toLocaleString()} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="happiness" stroke="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="funds" stroke="#82ca9d" />
              <Line yAxisId="left" type="monotone" dataKey="pollution" stroke="#ffc658" />
            </LineChart>
          </Grid>
        </Grid>
        <Typography variant="body2" component="p" style={{ marginTop: 20 }}>
          Population: {cityData.population.toLocaleString()}<br />
          Happiness: {cityData.happiness}%<br />
          Funds: ${cityData.funds.toLocaleString()}<br />
          Pollution: {cityData.pollution}%
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CityInteractions;