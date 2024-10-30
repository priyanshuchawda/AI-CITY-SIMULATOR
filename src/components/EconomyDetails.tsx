import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { economyService } from '../services/economyService';

const EconomyDetails: React.FC = () => {
  const [resources, setResources] = useState(economyService.getResources());
  const [industries, setIndustries] = useState(economyService.getIndustries());
  const [gdp, setGDP] = useState(economyService.getGDP());
  const [unemploymentRate, setUnemploymentRate] = useState(economyService.getUnemploymentRate());

  useEffect(() => {
    const handleEconomyUpdate = () => {
      setResources(economyService.getResources());
      setIndustries(economyService.getIndustries());
      setGDP(economyService.getGDP());
      setUnemploymentRate(economyService.getUnemploymentRate());
    };

    economyService.on('economyUpdated', handleEconomyUpdate);
    economyService.on('industryUpdated', handleEconomyUpdate);

    return () => {
      economyService.off('economyUpdated', handleEconomyUpdate);
      economyService.off('industryUpdated', handleEconomyUpdate);
    };
  }, []);

  const handleInvestInIndustry = (industryName: string) => {
    economyService.investInIndustry(industryName, 100000);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Economy Details</Typography>
      <Typography>GDP: ${gdp.toLocaleString()}</Typography>
      <Typography>Unemployment Rate: {(unemploymentRate * 100).toFixed(2)}%</Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Resources</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Resource</TableCell>
              <TableCell align="right">Supply</TableCell>
              <TableCell align="right">Demand</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.name}>
                <TableCell component="th" scope="row">{resource.name}</TableCell>
                <TableCell align="right">{resource.supply.toFixed(0)}</TableCell>
                <TableCell align="right">{resource.demand.toFixed(0)}</TableCell>
                <TableCell align="right">${resource.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Industries</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Industry</TableCell>
              <TableCell align="right">Level</TableCell>
              <TableCell align="right">Employees</TableCell>
              <TableCell align="right">Production Rate</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {industries.map((industry) => (
              <TableRow key={industry.name}>
                <TableCell component="th" scope="row">{industry.name}</TableCell>
                <TableCell align="right">{industry.level}</TableCell>
                <TableCell align="right">{industry.employees}</TableCell>
                <TableCell align="right">{industry.productionRate.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" size="small" onClick={() => handleInvestInIndustry(industry.name)}>
                    Invest
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EconomyDetails;