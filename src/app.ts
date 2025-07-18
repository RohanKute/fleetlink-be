import express from 'express';
import vehicleRoutes from './routes/vehicleRoutes';
import bookingRoutes from './routes/bookingRoutes'
const app = express();
app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

export default app;
