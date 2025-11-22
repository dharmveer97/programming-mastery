import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 127: Query Strings
 *
 * Query strings are key-value pairs in URLs after the ? character.
 * Example: /search?q=hello&limit=10
 *
 * Key concepts:
 * - Access via req.query object
 * - Query params are always strings (need parsing for numbers)
 * - Multiple values: ?tag=js&tag=node becomes array
 * - Optional parameters with defaults
 *
 * Task: Create routes that handle query parameters
 */

const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', inStock: true },
  { id: 2, name: 'Phone', price: 699, category: 'electronics', inStock: false },
  { id: 3, name: 'Desk', price: 299, category: 'furniture', inStock: true },
  { id: 4, name: 'Chair', price: 199, category: 'furniture', inStock: true },
  { id: 5, name: 'Monitor', price: 399, category: 'electronics', inStock: true }
];

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: GET /products - Return all products with pagination
  // Query params: page (default 1), limit (default 10)
  // Return: { data: [...], page: 1, limit: 10, total: 5 }


  // TODO: GET /products/search - Search products by name (case-insensitive)
  // Query param: q (required)
  // If q is missing, return 400: { error: 'Query parameter q is required' }


  // TODO: GET /products/filter - Filter by category and price range
  // Query params: category, minPrice, maxPrice (all optional)
  // Return matching products


  // TODO: GET /products/sort - Sort products
  // Query params: sortBy (name|price), order (asc|desc, default asc)
  // Default sortBy: name


  // TODO: GET /products/available - Filter by stock status
  // Query param: inStock (true|false as string)
  // Return products matching stock status


  // TODO: GET /products/tags - Handle array query params
  // Query param: category (can be multiple: ?category=electronics&category=furniture)
  // Return products matching any category


  return app;
}

// Tests
describe('Exercise 127: Query Strings', () => {
  const app = createApp();

  it('should handle pagination with defaults', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: products,
      page: 1,
      limit: 10,
      total: 5
    });
  });

  it('should handle custom pagination', async () => {
    const response = await request(app).get('/products?page=2&limit=2');
    expect(response.status).toBe(200);
    expect(response.body.page).toBe(2);
    expect(response.body.limit).toBe(2);
    expect(response.body.data.length).toBe(2);
  });

  it('should search products by name', async () => {
    const response = await request(app).get('/products/search?q=phone');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 2, name: 'Phone', price: 699, category: 'electronics', inStock: false }
    ]);
  });

  it('should return error when q is missing', async () => {
    const response = await request(app).get('/products/search');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Query parameter q is required' });
  });

  it('should filter by category', async () => {
    const response = await request(app).get('/products/filter?category=furniture');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body.every(p => p.category === 'furniture')).toBe(true);
  });

  it('should filter by price range', async () => {
    const response = await request(app).get('/products/filter?minPrice=300&maxPrice=700');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 2, name: 'Phone', price: 699, category: 'electronics', inStock: false },
      { id: 5, name: 'Monitor', price: 399, category: 'electronics', inStock: true }
    ]);
  });

  it('should sort products by name ascending', async () => {
    const response = await request(app).get('/products/sort?sortBy=name&order=asc');
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe('Chair');
    expect(response.body[4].name).toBe('Phone');
  });

  it('should sort products by price descending', async () => {
    const response = await request(app).get('/products/sort?sortBy=price&order=desc');
    expect(response.status).toBe(200);
    expect(response.body[0].price).toBe(999);
    expect(response.body[4].price).toBe(199);
  });

  it('should filter by stock status', async () => {
    const response = await request(app).get('/products/available?inStock=true');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    expect(response.body.every(p => p.inStock === true)).toBe(true);
  });

  it('should handle array query params', async () => {
    const response = await request(app)
      .get('/products/tags?category=electronics&category=furniture');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });
});
