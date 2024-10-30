import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { researchService } from '../services/researchService';
import { audioService } from '../services/audioService';

const TechTree: React.FC = () => {
  const techTree = researchService.getTechTree();

  const handleResearch = (techId: string) => {
    if (researchService.canResearch(techId)) {
      if (researchService.researchTech(techId)) {
        audioService.playSoundEffect('upgrade');
      } else {
        audioService.playSoundEffect('error');
      }
    } else {
      audioService.playSoundEffect('error');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Research & Development</Typography>
      <Grid container spacing={2}>
        {techTree.map((tech) => (
          <Grid item xs={12} sm={6} md={3} key={tech.id}>
            <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>{tech.name}</Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>{tech.description}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption">Cost: ${tech.cost.toLocaleString()}</Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => handleResearch(tech.id)}
                  disabled={!researchService.canResearch(tech.id)}
                  sx={{ mt: 1 }}
                >
                  {tech.researched ? "Researched" : (tech.unlocked ? "Research" : "Locked")}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TechTree;