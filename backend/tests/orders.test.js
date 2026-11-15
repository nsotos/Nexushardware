/**
 * NexusHardware — Tests de Endpoints de Órdenes y Checkout
 * Verifica transacciones atómicas de compra, validación y descuento de stock,
 * generación de voucher de Webpay Plus y seguridad JWT.
 */

const request = require("supertest");
const app = require("../src/index");
const prisma = require("../src/prisma/client");

describe("API de Órdenes y Checkout de NexusHardware", () => {
  let authToken;
  let testUserId;
  let targetProduct;

  beforeAll(async () => {
    // 1. Iniciar sesión con cliente de prueba para obtener token JWT
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "cliente@utem.cl",
      password: "Password123!",
    });

    authToken = loginRes.body.token;
    testUserId = loginRes.body.user.id;

    // 2. Obtener un producto existente para pruebas de compra
    targetProduct = await prisma.product.findFirst({
      where: { stock: { gt: 5 } },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Seguridad y Autenticación en /api/orders", () => {
    it("debe rechazar la creación de orden sin token de autenticación (401)", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({
          items: [{ productId: targetProduct.id, quantity: 1 }],
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("debe rechazar la consulta de historial sin token (401)", async () => {
      const res = await request(app).get("/api/orders/my-orders");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("Validaciones de entrada en POST /api/orders", () => {
    it("debe retornar 400 si el carrito está vacío", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ items: [] });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("al menos un producto");
    });

    it("debe retornar 400 si los ítems tienen cantidad inválida (0 o negativa)", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          items: [{ productId: targetProduct.id, quantity: -2 }],
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("debe retornar 404 si se intenta comprar un producto que no existe", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          items: [{ productId: 999999, quantity: 1 }],
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("no existe");
    });
  });

  describe("Procesamiento de Checkout y Descuento de Stock", () => {
    it("debe procesar compra exitosa, descontar stock en BD y emitir voucher Webpay", async () => {
      const initialStock = targetProduct.stock;
      const quantityToBuy = 2;

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          items: [{ productId: targetProduct.id, quantity: quantityToBuy }],
          shippingAddress: "Av. José Pedro Alessandri 1242, Ñuñoa",
          paymentMethod: "WEBPAY",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.status).toBe("PAID");
      expect(res.body.data.items.length).toBe(1);

      // Comprobar voucher simulado de Transbank
      expect(res.body.voucher).toBeDefined();
      expect(res.body.voucher.authorizationCode).toBeDefined();
      expect(res.body.voucher.responseCode).toBe(0);
      expect(res.body.voucher.gateway).toContain("Webpay");

      // Verificar en PostgreSQL que el stock se descontó atómicamente
      const updatedProduct = await prisma.product.findUnique({
        where: { id: targetProduct.id },
      });
      expect(updatedProduct.stock).toBe(initialStock - quantityToBuy);
    });

    it("debe rechazar la compra si la cantidad solicitada supera el stock disponible (400)", async () => {
      const currentProduct = await prisma.product.findUnique({
        where: { id: targetProduct.id },
      });

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          items: [{ productId: targetProduct.id, quantity: currentProduct.stock + 50 }],
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Stock insuficiente");
      expect(res.body.details).toBeDefined();
      expect(res.body.details.available).toBe(currentProduct.stock);
    });
  });

  describe("Historial y Consulta de Órdenes", () => {
    it("debe listar las órdenes del cliente en GET /api/orders/my-orders", async () => {
      const res = await request(app)
        .get("/api/orders/my-orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty("items");
      expect(res.body.data[0]).toHaveProperty("total");
    });

    it("debe retornar detalle de una orden por ID en GET /api/orders/:id", async () => {
      const ordersRes = await request(app)
        .get("/api/orders/my-orders")
        .set("Authorization", `Bearer ${authToken}`);

      const orderId = ordersRes.body.data[0].id;

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(orderId);
      expect(res.body.data.user).toBeDefined();
    });

    it("debe retornar 404 para una orden que no existe", async () => {
      const res = await request(app)
        .get("/api/orders/999999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
