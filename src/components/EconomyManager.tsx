import React from 'react';
import { Box, Typography, Paper, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { economyService } from '../services/economyService';
import { tutorialService } from '../services/tutorialService';
import EconomicHealthIndicator from './EconomicHealthIndicator';

const EconomyManager: React.FC = () => {
  const [economyData, setEconomyData] = React.useState(economyService.getEconomyData());

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setEconomyData(economyService.getEconomyData());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleImplementPolicy = (policyName: string) => {
    economyService.implementPolicy(policyName);
    setEconomyData(economyService.getEconomyData());
    if (tutorialService.getCurrentStep()?.action === "Implement an economic policy") {
      tutorialService.nextStep();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Economy Management</Typography>
      <EconomicHealthIndicator gdp={economyData.gdp} unemploymentRate={economyData.unemploymentRate} />
      
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Economic Overview</Typography>
        <Typography>GDP: ${economyData.gdp.toLocaleString()}</Typography>
        <Typography>Unemployment Rate: {(economyData.unemploymentRate * 100).toFixed(2)}%</Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Industries</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Industry</TableCell>
                <TableCell align="right">Level</TableCell>
                <TableCell align="right">Production</TableCell>
                <TableCell align="right">Demand</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {economyData.industries.map((industry) => (
                <TableRow key={industry.name}>
                  <TableCell component="th" scope="row">
                    {industry.name}
                  </TableCell>
                  <TableCell align="right">{industry.level}</TableCell>
                  <TableCell align="right">{industry.production.toFixed(2)}</TableCell>
                  <TableCell align="right">{industry.demand.toFixed(2)}</TableCell>
                  <TableCell align="right">${industry.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Economic Policies</Typography>
        <Grid container spacing={2}>
          {economyData.policies.map((policy) => (
            <Grid item xs={12} sm={6} md={4} key={policy.name}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">{policy.name}</Typography>
                <Typography variant="body2">{policy.description}</Typography>
                <Typography variant="body2">Cost: ${policy.cost.toLocaleString()}</Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 1 }}
                  onClick={() => handleImplementPolicy(policy.name)}
                  disabled={policy.isActive}
                >
                  {policy.isActive ? 'Active' : 'Implement'}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default EconomyManager;