import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { calculateRideDurationHours } from '../utils/rideUtils';

export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const vehicle = await prisma.vehicle.create({
      data: { name, capacityKg, tyres },
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAvailableVehicles = async (req: Request, res: Response) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ error: 'Missing query parameters' });
    }

    const start = new Date(startTime as string);
    const duration = calculateRideDurationHours(fromPincode as string, toPincode as string);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const candidates = await prisma.vehicle.findMany({
      where: { capacityKg: { gte: Number(capacityRequired) } }
    });

    const overlapping = await prisma.booking.findMany({
      where: {
        startTime: { lt: end },
        endTime:   { gt: start }
      },
      select: { vehicleId: true }
    });

    const bookedIds = new Set(overlapping.map(b => b.vehicleId));

    const available = candidates.filter(v => !bookedIds.has(v.id));

    res.status(200).json({ vehicles: available, estimatedRideDurationHours: duration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

