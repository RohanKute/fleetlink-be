import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma/client';

describe('POST /api/bookings', () => {
  let vehicleId: string;

  beforeAll(async () => {
    // assuming we have testing setup for db aswell
    await prisma.booking.deleteMany();
    await prisma.vehicle.deleteMany();

    const vehicle = await prisma.vehicle.create({
      data: {
        name: 'Test Truck',
        capacityKg: 1500,
        tyres: 6,
      },
    });
    vehicleId = vehicle.id;
  });

  it('should create a new booking if vehicle is available', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId,
        fromPincode: '110001',
        toPincode: '110010',
        startTime: new Date().toISOString(),
        customerId: 'customer-1'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.vehicleId).toBe(vehicleId);
  });

  it('should return 409 if vehicle is already booked in that time window', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId,
        fromPincode: '110001',
        toPincode: '110010',
        startTime: new Date().toISOString(),
        customerId: 'customer-2'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  afterAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.$disconnect();
  });
});
