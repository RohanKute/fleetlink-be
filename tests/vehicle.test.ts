import request from 'supertest';
import app from '../src/app'; // You'll extract the Express app without starting server

describe('POST /api/vehicles', () => {
  it('should create a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck 1', capacityKg: 1000, tyres: 6 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Truck 1');
  });

  it('should fail on missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Incomplete Truck' });

    expect(res.statusCode).toBe(400);
  });
});
