import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { calculateRideDurationHours } from '../utils/rideUtils';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const start = new Date(startTime);
    const duration = calculateRideDurationHours(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // Check for overlapping bookings
    const conflicting = await prisma.booking.findFirst({
      where: {
        vehicleId,
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ]
      },
    });

    if (conflicting) {
      return res.status(409).json({ error: 'Vehicle already booked in that time window' });
    }

    const booking = await prisma.booking.create({
      data: {
        vehicleId,
        fromPincode,
        toPincode,
        startTime: start,
        endTime: end,
        customerId,
      }
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
