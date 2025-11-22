import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';

/**
 * Exercise 138: Request Validation with Zod - SOLUTION
 */

export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }

    req.body = result.data;
    next();
  };
}

export function createApp() {
  const app = express();
  app.use(express.json());

  const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    age: z.number().min(18, 'Must be at least 18').max(120, 'Must be under 120')
  });

  app.post('/api/users', validateRequest(userSchema), (req, res) => {
    res.status(201).json(req.body);
  });

  const productSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    price: z.number().positive('Price must be positive'),
    category: z.enum(['electronics', 'clothing', 'food']),
    tags: z.array(z.string()).optional()
  });

  app.post('/api/products', validateRequest(productSchema), (req, res) => {
    res.status(201).json(req.body);
  });

  const userWithAddressSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      zipCode: z.string().regex(/^\d{5}$/, 'Zip code must be 5 digits')
    })
  });

  app.post('/api/users/with-address', validateRequest(userWithAddressSchema), (req, res) => {
    res.status(201).json(req.body);
  });

  const updateUserSchema = userSchema.partial();

  app.patch('/api/users/:id', validateRequest(updateUserSchema), (req, res) => {
    res.status(200).json({ id: req.params.id, ...req.body });
  });

  const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number');

  const registerSchema = z.object({
    password: passwordSchema
  });

  app.post('/api/register', validateRequest(registerSchema), (req, res) => {
    res.status(201).json({ message: 'Registered successfully' });
  });

  return app;
}

// Tests
describe('Exercise 138: Request Validation with Zod - Solution', () => {
  const app = createApp();

  it('should validate and create user successfully', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        age: 25
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Alice');
  });

  it('should reject invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Bob',
        email: 'invalid-email',
        age: 30
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject age below minimum', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Charlie',
        email: 'charlie@example.com',
        age: 15
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject name that is too short', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'A',
        email: 'a@example.com',
        age: 25
      });

    expect(response.status).toBe(400);
  });

  it('should validate product with enum', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        title: 'Laptop',
        price: 999,
        category: 'electronics'
      });

    expect(response.status).toBe(201);
  });

  it('should reject invalid category', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        title: 'Item',
        price: 50,
        category: 'invalid'
      });

    expect(response.status).toBe(400);
  });

  it('should validate nested address object', async () => {
    const response = await request(app)
      .post('/api/users/with-address')
      .send({
        name: 'David',
        email: 'david@example.com',
        address: {
          street: '123 Main St',
          city: 'Boston',
          zipCode: '12345'
        }
      });

    expect(response.status).toBe(201);
  });

  it('should reject invalid nested zipCode', async () => {
    const response = await request(app)
      .post('/api/users/with-address')
      .send({
        name: 'Eve',
        email: 'eve@example.com',
        address: {
          street: '456 Oak St',
          city: 'Seattle',
          zipCode: 'ABC'
        }
      });

    expect(response.status).toBe(400);
  });

  it('should allow partial update', async () => {
    const response = await request(app)
      .patch('/api/users/1')
      .send({
        name: 'Updated Name'
      });

    expect(response.status).toBe(200);
  });

  it('should validate partial update fields', async () => {
    const response = await request(app)
      .patch('/api/users/1')
      .send({
        email: 'invalid'
      });

    expect(response.status).toBe(400);
  });

  it('should validate password requirements', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        password: 'weak'
      });

    expect(response.status).toBe(400);
  });

  it('should accept valid password', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        password: 'Strong123'
      });

    expect(response.status).toBe(201);
  });
});
