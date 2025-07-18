import express from 'express';
import { addVehicle, getAvailableVehicles } from '../controllers/vehicleController';

const router = express.Router();

router.post('/', addVehicle);
router.get('/available', getAvailableVehicles);

export default router;
