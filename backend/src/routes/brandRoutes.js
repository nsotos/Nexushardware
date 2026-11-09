/**
 * NexusHardware — Rutas de Marcas
 * Endpoints públicos para listar marcas reconocidas y conteo de productos.
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/brands — Listado de marcas oficiales con logo y total de productos
router.get("/", productController.getBrands);

module.exports = router;
