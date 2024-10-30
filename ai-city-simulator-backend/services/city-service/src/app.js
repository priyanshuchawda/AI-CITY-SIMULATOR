import express from 'express';
import cityRoutes from './routes/cityRoutes.js'; // Ensure the file extension is correct

const app = express();

app.use(express.json());
app.use('/api', cityRoutes);

export default app;
