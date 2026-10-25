/**
 * NexusHardware - Servidor principal de la API
 * Punto de entrada de la aplicación Express
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Log de peticiones HTTP en consola

// ─── Rutas ────────────────────────────────────────────────────────────────────
// TODO: importar rutas aquí a medida que se creen
// const productRoutes = require("./routes/products");
// app.use("/api/products", productRoutes);

// Ruta de health check para verificar que la API está activa
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    project: "NexusHardware API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Middleware de errores ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ─── Iniciar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 NexusHardware API corriendo en http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app; // Exportado para testing con supertest
