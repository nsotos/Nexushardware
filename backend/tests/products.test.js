/**
 * NexusHardware — Tests de Endpoints de Productos, Categorías y Marcas
 */

const request = require("supertest");
const app = require("../src/index");
const prisma = require("../src/prisma/client");

describe("API de Catálogo de NexusHardware", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/products", () => {
    it("debe retornar listado paginado con estructura correcta", async () => {
      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBeGreaterThan(0);
    });

    it("debe permitir filtrar por búsqueda de texto", async () => {
      const res = await request(app).get("/api/products?search=RTX");
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].name.toLowerCase()).toContain("rtx");
    });

    it("debe permitir filtrar por marca", async () => {
      const res = await request(app).get("/api/products?brand=asus");
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      res.body.data.forEach((p) => {
        expect(p.brand.slug).toBe("asus");
      });
    });

    it("debe respetar paginación con limit", async () => {
      const res = await request(app).get("/api/products?limit=3&page=1");
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
      expect(res.body.pagination.limit).toBe(3);
    });
  });

  describe("GET /api/products/:slug", () => {
    it("debe retornar 200 y el detalle de un producto existente", async () => {
      const res = await request(app).get("/api/products/nvidia-geforce-rtx-4080-super-16gb");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe("nvidia-geforce-rtx-4080-super-16gb");
      expect(res.body.data.brand).toBeDefined();
      expect(res.body.data.category).toBeDefined();
    });

    it("debe retornar 404 para un slug inexistente", async () => {
      const res = await request(app).get("/api/products/componente-que-no-existe-xyz");
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Producto no encontrado");
    });
  });

  describe("GET /api/categories", () => {
    it("debe retornar la lista de categorías con conteo de productos", async () => {
      const res = await request(app).get("/api/categories");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(8);
      expect(res.body.data[0]).toHaveProperty("productCount");
    });
  });

  describe("GET /api/brands", () => {
    it("debe retornar la lista de marcas con conteo de productos", async () => {
      const res = await request(app).get("/api/brands");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(8);
      expect(res.body.data[0]).toHaveProperty("logoUrl");
    });
  });
});
