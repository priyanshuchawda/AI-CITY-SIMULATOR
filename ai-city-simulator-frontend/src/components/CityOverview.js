import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getCityData } from '../services/api';

const CityOverview = () => {
  const [cityData, setCityData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCityData();
      setCityData(response.data);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!cityData) return <Typography>Loading...</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">City Overview</Typography>
            <Typography>Population: {cityData.population}</Typography>
            <Typography>Happiness: {cityData.happiness}%</Typography>
            <Typography>Funds: ${cityData.funds}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <LineChart width={600} height={300} data={cityData.history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="population" stroke="#8884d8" />
          <Line type="monotone" dataKey="happiness" stroke="#82ca9d" />
          <Line type="monotone" dataKey="funds" stroke="#ffc658" />
        </LineChart>
      </Grid>
    </Grid>
  );
};

export default CityOverview;