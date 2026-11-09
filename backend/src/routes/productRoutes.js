/**
 * NexusHardware — Rutas de Productos
 * Endpoints públicos para el catálogo y detalle de productos.
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/products — Catálogo con filtros (?category, ?brand, ?search, ?minPrice, ?maxPrice, ?page, ?limit)
router.get("/", productController.getProducts);

// GET /api/products/:slug — Detalle de un producto específico
router.get("/:slug", productController.getProductBySlug);

module.exports = router;
