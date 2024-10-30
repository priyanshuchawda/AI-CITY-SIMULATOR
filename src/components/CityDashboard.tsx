import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Tabs, Tab, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cityService } from '../services/cityService';

interface CityData {
  population: number;
  happiness: number;
  funds: number;
  time: number;
  employmentRate: number;
  educationLevel: number;
  crimeRate: number;
  pollution: number;
  energyConsumption: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CityDashboard: React.FC = () => {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [currentData, setCurrentData] = useState<CityData>({
    population: 0,
    happiness: 0,
    funds: 0,
    time: 0,
    employmentRate: 0,
    educationLevel: 0,
    crimeRate: 0,
    pollution: 0,
    energyConsumption: 0
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      const newData = cityService.getCityData();
      setCurrentData(newData);
      setCityData(prevData => [...prevData, newData].slice(-20)); // Keep last 20 data points
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: string) => {
    switch (action) {
      case 'increasePopulation':
        cityService.increasePopulation(1000);
        break;
      case 'increaseFunds':
        cityService.increaseFunds(10000);
        break;
      case 'increaseHappiness':
        cityService.increaseHappiness(5);
        break;
      case 'improveEducation':
        cityService.improveEducation(5);
        break;
      case 'reduceCrime':
        cityService.reduceCrime(2);
        break;
      case 'reducePollution':
        cityService.reducePollution(3);
        break;
      default:
        console.log('Unknown action');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>City Dashboard</Typography>
          <Typography variant="h6">Population: {currentData.population}</Typography>
          <Typography variant="h6">Happiness: {currentData.happiness}%</Typography>
          <Typography variant="h6">Funds: ${currentData.funds}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Overview" />
            <Tab label="Economy" />
            <Tab label="Society" />
            <Tab label="Environment" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="population" stroke="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="happiness" stroke="#82ca9d" />
                <Line yAxisId="right" type="monotone" dataKey="funds" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[currentData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="employmentRate" fill="#8884d8" name="Employment Rate" />
                <Bar dataKey="funds" fill="#82ca9d" name="City Funds" />
              </BarChart>
            </ResponsiveContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[currentData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="educationLevel" fill="#8884d8" name="Education Level" />
                <Bar dataKey="crimeRate" fill="#82ca9d" name="Crime Rate" />
              </BarChart>
            </ResponsiveContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[currentData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pollution" fill="#8884d8" name="Pollution Level" />
                <Bar dataKey="energyConsumption" fill="#82ca9d" name="Energy Consumption" />
              </BarChart>
            </ResponsiveContainer>
          </TabPanel>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>City Actions</Typography>
          <Button variant="contained" color="primary" onClick={() => handleAction('increasePopulation')} style={{ margin: '5px' }}>
            Increase Population
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleAction('increaseFunds')} style={{ margin: '5px' }}>
            Increase Funds
          </Button>
          <Button variant="contained" color="success" onClick={() => handleAction('increaseHappiness')} style={{ margin: '5px' }}>
            Increase Happiness
          </Button>
          <Button variant="contained" color="info" onClick={() => handleAction('improveEducation')} style={{ margin: '5px' }}>
            Improve Education
          </Button>
          <Button variant="contained" color="warning" onClick={() => handleAction('reduceCrime')} style={{ margin: '5px' }}>
            Reduce Crime
          </Button>
          <Button variant="contained" color="error" onClick={() => handleAction('reducePollution')} style={{ margin: '5px' }}>
            Reduce Pollution
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CityDashboard;