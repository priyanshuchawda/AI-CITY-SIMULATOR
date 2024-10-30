import express from 'express';

const router = express.Router();

let cityData = {
  population: 100000,
  happiness: 50,
  funds: 1000000,
  energy: 50000,
  pollution: 30,
  technology: 50,
};

router.get('/data', (req, res) => {
  res.json(cityData);
});

router.post('/adjust', (req, res) => {
  const { factor, value } = req.body;
  cityData[factor] = value;

  // Simulate complex interactions
  if (factor === 'energy') {
    cityData.pollution = Math.min(100, Math.max(0, cityData.pollution + (value - cityData.energy) / 10000));
    cityData.funds -= Math.abs(value - cityData.energy) * 10;
  } else if (factor === 'technology') {
    cityData.energy = Math.max(0, cityData.energy - (value - cityData.technology) * 100);
    cityData.pollution = Math.max(0, cityData.pollution - (value - cityData.technology) / 2);
    cityData.funds -= (value - cityData.technology) * 10000;
  }

  cityData.happiness = calculateHappiness();
  cityData.population += calculatePopulationChange();

  res.json(cityData);
});

router.post('/disaster', (req, res) => {
  cityData = {
    ...cityData,
    population: Math.floor(cityData.population * 0.9),
    funds: Math.floor(cityData.funds * 0.7),
    happiness: Math.max(0, cityData.happiness - 20),
    pollution: cityData.pollution + 15,
  };

  res.json(cityData);
});

const calculateHappiness = () => Math.min(100, Math.max(0,
  50 
  + (cityData.funds / 10000000) 
  - (cityData.pollution / 2) 
  + (cityData.technology / 4) 
  - (cityData.population / 100000)
));

const calculatePopulationChange = () => Math.floor(
  (cityData.happiness - 50) * 100 
  + (cityData.funds / 1000000) 
  - (cityData.pollution * 10)
);

export default router;
