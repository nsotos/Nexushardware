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

// Para medir la CPU
 const pidusage = require('pidusage'); // O import pidusage from 'pidusage'; si usas ES Modules

app.get('/api/debug/metrics', async (req, res) => {
  try {
    const stats = await pidusage(process.pid);
    res.json({
      cpu_percent: stats.cpu.toFixed(2) + '%',
      ram_rss_mb: (stats.memory / 1024 / 1024).toFixed(2) + ' MB',
      uptime_sec: Math.round(process.uptime())
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// --------

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Log de peticiones HTTP en consola

// ─── Rutas ────────────────────────────────────────────────────────────────────
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

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
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 NexusHardware API corriendo en http://localhost:${PORT}`);
    console.log(`   Ambiente: ${process.env.NODE_ENV || "development"}`);
  });
}

module.exports = app; // Exportado para testing con supertest
