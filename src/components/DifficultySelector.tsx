import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Difficulty, difficultyService } from '../services/difficultyService';

interface DifficultySelectorProps {
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onDifficultyChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    const newDifficulty = event.target.value as Difficulty;
    difficultyService.setDifficulty(newDifficulty);
    onDifficultyChange(newDifficulty);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
      <Select
        labelId="difficulty-select-label"
        id="difficulty-select"
        value={difficultyService.getDifficulty()}
        label="Difficulty"
        onChange={handleChange}
      >
        <MenuItem value="easy">Easy</MenuItem>
        <MenuItem value="normal">Normal</MenuItem>
        <MenuItem value="hard">Hard</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DifficultySelector;