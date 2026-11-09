/**
 * NexusHardware — Rutas de Categorías
 * Endpoints públicos para listar categorías y conteo de productos.
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/categories — Listado de categorías con total de productos
router.get("/", productController.getCategories);

module.exports = router;
