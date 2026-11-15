/**
 * NexusHardware — Rutas de Órdenes y Checkout
 * Define los endpoints para procesar compras y consultar historial de pedidos.
 */

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

// Todas las rutas de órdenes requieren autenticación con token JWT
router.use(protect);

// POST /api/orders — Procesa checkout y registra compra con descuento de stock
router.post("/", createOrder);

// GET /api/orders/my-orders — Lista el historial de órdenes del cliente autenticado
router.get("/my-orders", getMyOrders);

// GET /api/orders/:id — Detalle completo y voucher de una orden por ID
router.get("/:id", getOrderById);

module.exports = router;
