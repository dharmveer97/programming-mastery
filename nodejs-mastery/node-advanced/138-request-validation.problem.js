import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';

/**
 * Exercise 138: Request Validation with Zod
 *
 * Validating request data is crucial for API security and reliability.
 * Zod is a TypeScript-first schema validation library.
 *
 * Key concepts:
 * - Define schemas with z.object()
 * - Validate with schema.parse() or schema.safeParse()
 * - Handle validation errors
 * - Nested object validation
 * - Array validation
 * - Custom error messages
 *
 * Task: Implement request validation with Zod
 */

// TODO: Create validation middleware
// Takes a Zod schema and validates req.body
// Return 400 with validation errors if invalid
export function validateRequest(schema) {
  return (req, res, next) => {
    // TODO: Implement validation
    // Use schema.safeParse(req.body)
    // If success, call next()
    // If error, return 400 with formatted errors
  };
}

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: Define user schema
  // - name: string, min 2 chars
  // - email: valid email
  // - age: number, min 18, max 120
  const userSchema = z.object({
    // TODO: Add validations
  });

  // TODO: POST /api/users - Create user with validation
  // Use validateRequest middleware


  // TODO: Define product schema
  // - title: string, min 3 chars
  // - price: number, positive
  // - category: enum ['electronics', 'clothing', 'food']
  // - tags: array of strings, optional
  const productSchema = z.object({
    // TODO: Add validations
  });

  // TODO: POST /api/products - Create product with validation


  // TODO: Define nested address schema
  // User with address:
  // - name: string
  // - email: email
  // - address: object
  //   - street: string
  //   - city: string
  //   - zipCode: string (5 digits)
  const userWithAddressSchema = z.object({
    // TODO: Add nested validations
  });

  // TODO: POST /api/users/with-address - Create user with address


  // TODO: Define update schema (partial user)
  // All fields optional but if provided must be valid
  const updateUserSchema = userSchema.partial();

  // TODO: PATCH /api/users/:id - Partial update with validation


  // TODO: Define custom validation
  // Password requirements:
  // - min 8 chars
  // - must contain uppercase, lowercase, number
  const passwordSchema = z.string()
    // TODO: Add password validations with custom error messages


  // TODO: POST /api/register - Register with password validation


  return app;
}

// Tests
describe('Exercise 138: Request Validation with Zod', () => {
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
