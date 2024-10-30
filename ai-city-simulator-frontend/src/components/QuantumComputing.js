import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@material-ui/core';
import { upgradeQuantumComputer, runQuantumAlgorithm } from '../services/api';

const QuantumComputing = () => {
  const [qubits, setQubits] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [problemSize, setProblemSize] = useState('');
  const [result, setResult] = useState(null);

  const handleUpgrade = async () => {
    await upgradeQuantumComputer(Number(qubits));
    setQubits('');
  };

  const handleRunAlgorithm = async () => {
    const response = await runQuantumAlgorithm(algorithm, Number(problemSize));
    setResult(response.data);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">Quantum Computing</Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="Qubits to Add"
              type="number"
              fullWidth
              margin="normal"
              value={qubits}
              onChange={(e) => setQubits(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" color="primary" onClick={handleUpgrade}>
              Upgrade
            </Button>
          </Grid>
        </Grid>
        <TextField
          label="Algorithm"
          fullWidth
          margin="normal"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        />
        <TextField
          label="Problem Size"
          type="number"
          fullWidth
          margin="normal"
          value={problemSize}
          onChange={(e) => setProblemSize(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleRunAlgorithm}>
          Run Algorithm
        </Button>
        {result && (
          <div>
            <Typography>Algorithm: {result.algorithm}</Typography>
            <Typography>Problem Size: {result.problemSize}</Typography>
            <Typography>Classical Time: {result.classicalTime}</Typography>
            <Typography>Quantum Time: {result.quantumTime}</Typography>
            <Typography>Speedup: {result.speedup}x</Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantumComputing;