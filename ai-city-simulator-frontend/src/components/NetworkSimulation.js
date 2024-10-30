import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@material-ui/core';
import { deploy5G, get5GStatus } from '../services/api';

const NetworkSimulation = () => {
  const [area, setArea] = useState('');
  const [networkStatus, setNetworkStatus] = useState(null);

  const handleDeploy = async () => {
    await deploy5G(Number(area));
    fetchStatus();
  };

  const fetchStatus = async () => {
    const currentHour = new Date().getHours();
    const response = await get5GStatus(currentHour);
    setNetworkStatus(response.data);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">5G Network Simulation</Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="Area to Deploy (sq km)"
              type="number"
              fullWidth
              margin="normal"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" color="primary" onClick={handleDeploy}>
              Deploy
            </Button>
          </Grid>
        </Grid>
        {networkStatus && (
          <div>
            <Typography>Coverage Area: {networkStatus.coverageArea} sq km</Typography>
            <Typography>Connected Devices: {networkStatus.connectedDevices}</Typography>
            <Typography>Average Speed: {networkStatus.averageSpeed} Gbps</Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkSimulation;