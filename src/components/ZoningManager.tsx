import React, { useState } from 'react';
import { Paper, Typography, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { zoningService, ZoneType, Zone, Building } from '../services/zoningService';
import { tutorialService } from '../services/tutorialService';

const buildingTypes = ['house', 'apartment', 'farm', 'factory', 'office', 'techpark', 'park'];

const ZoningManager: React.FC = () => {
  const [selectedZoneType, setSelectedZoneType] = useState<ZoneType>('residential');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const handleCreateZone = () => {
    zoningService.createZone(selectedZoneType, 5);
    tutorialService.completeAction('create_zone');
  };

  const handleAddBuilding = (type: string) => {
    if (selectedZone) {
      zoningService.addBuilding(selectedZone.id, type);
      tutorialService.completeAction('add_building');
    }
  };

  const handleUpgradeBuilding = (buildingId: string) => {
    if (selectedZone) {
      zoningService.upgradeBuilding(selectedZone.id, buildingId);
    }
  };

  const zones = zoningService.getZones();

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Zoning & Building Management</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Zone Type</InputLabel>
            <Select
              value={selectedZoneType}
              onChange={(e) => setSelectedZoneType(e.target.value as ZoneType)}
            >
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="industrial">Industrial</MenuItem>
              <MenuItem value="park">Park</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleCreateZone}>Create Zone</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Existing Zones</Typography>
          {zones.map((zone) => (
            <Paper key={zone.id} elevation={2} sx={{ p: 1, mt: 1 }}>
              <Typography>{zone.type} Zone (Size: {zone.size})</Typography>
              <Button onClick={() => setSelectedZone(zone)}>Select</Button>
            </Paper>
          ))}
        </Grid>
        {selectedZone && (
          <Grid item xs={12}>
            <Typography variant="subtitle1">Selected Zone: {selectedZone.type}</Typography>
            <Typography variant="subtitle2">Add Building:</Typography>
            <Grid container spacing={1}>
              {buildingTypes.map((type) => (
                <Grid item key={type}>
                  <Button variant="contained" onClick={() => handleAddBuilding(type)}>
                    {type}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Typography variant="subtitle2">Buildings:</Typography>
            {selectedZone.buildings.map((building: Building) => (
              <Paper key={building.id} elevation={2} sx={{ p: 1, mt: 1 }}>
                <Typography>{building.name} (Level: {building.level})</Typography>
                <Typography>Capacity: {building.occupancy}/{building.capacity}</Typography>
                <Button onClick={() => handleUpgradeBuilding(building.id)}>Upgrade</Button>
              </Paper>
            ))}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default ZoningManager;