import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  population: { type: Number, required: true },
  area: { type: Number, required: true },
  // Add other fields as needed
});

const City = mongoose.model('City', citySchema);

export default City;
