import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { evaluateAIDecision } from '../services/api';

const AIEthics = () => {
  const [decision, setDecision] = useState('');
  const [context, setContext] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const handleEvaluate = async () => {
    const response = await evaluateAIDecision(decision, context);
    setEvaluation(response.data);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">AI Ethics Evaluation</Typography>
        <TextField
          label="Decision"
          fullWidth
          margin="normal"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        />
        <TextField
          label="Context"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleEvaluate}>
          Evaluate
        </Button>
        {evaluation && (
          <div>
            <Typography>Ethical Score: {evaluation.score}</Typography>
            <Typography>Is Ethical: {evaluation.isEthical ? 'Yes' : 'No'}</Typography>
            <List>
              {evaluation.explanations.map((explanation, index) => (
                <ListItem key={index}>
                  <ListItemText primary={explanation} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIEthics;