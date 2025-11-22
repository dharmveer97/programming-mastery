import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

/**
 * Exercise 127: Query Strings - SOLUTION
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

  app.get('/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    res.json({
      data: products.slice(startIndex, endIndex),
      page,
      limit,
      total: products.length
    });
  });

  app.get('/products/search', (req, res) => {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const results = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );

    res.json(results);
  });

  app.get('/products/filter', (req, res) => {
    let filtered = products;

    if (req.query.category) {
      filtered = filtered.filter(p => p.category === req.query.category);
    }

    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      filtered = filtered.filter(p => p.price >= minPrice);
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    res.json(filtered);
  });

  app.get('/products/sort', (req, res) => {
    const sortBy = req.query.sortBy || 'name';
    const order = req.query.order || 'asc';

    const sorted = [...products].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (order === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });

    res.json(sorted);
  });

  app.get('/products/available', (req, res) => {
    const inStock = req.query.inStock === 'true';
    const filtered = products.filter(p => p.inStock === inStock);
    res.json(filtered);
  });

  app.get('/products/tags', (req, res) => {
    const categories = Array.isArray(req.query.category)
      ? req.query.category
      : [req.query.category];

    const filtered = products.filter(p =>
      categories.includes(p.category)
    );

    res.json(filtered);
  });

  return app;
}

// Tests
describe('Exercise 127: Query Strings - Solution', () => {
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
