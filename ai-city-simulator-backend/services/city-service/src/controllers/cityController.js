import { getCityById, createCity, updateCity, deleteCity } from '../services/cityService.js';

const cityController = {
  async getCity(req, res) {
    try {
      const city = await getCityById(req.params.id);
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }
      res.json(city);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  async createCity(req, res) {
    try {
      const newCity = await createCity(req.body);
      res.status(201).json(newCity);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  async updateCity(req, res) {
    try {
      const updatedCity = await updateCity(req.params.id, req.body);
      if (!updatedCity) {
        return res.status(404).json({ message: 'City not found' });
      }
      res.json(updatedCity);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  async deleteCity(req, res) {
    try {
      const result = await deleteCity(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'City not found' });
      }
      res.json({ message: 'City deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
};

export default cityController;
