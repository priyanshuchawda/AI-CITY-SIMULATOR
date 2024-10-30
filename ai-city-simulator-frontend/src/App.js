import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import CityOverview from './components/CityOverview';
import AIEthics from './components/AIEthics';
import NetworkSimulation from './components/NetworkSimulation';
import QuantumComputing from './components/QuantumComputing';
import CityInteractions from './components/CityInteractions';

function App() {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        AI-Powered Virtual City Simulator
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CityOverview />
        </Grid>
        <Grid item xs={12}>
          <CityInteractions />
        </Grid>
        <Grid item xs={12} md={6}>
          <AIEthics />
        </Grid>
        <Grid item xs={12} md={6}>
          <NetworkSimulation />
        </Grid>
        <Grid item xs={12}>
          <QuantumComputing />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
