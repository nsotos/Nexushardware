/**
 * NexusHardware — Rutas de Autenticación
 * Montadas en /api/auth
 */

const express = require("express");
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware para verificar los resultados de validación de express-validator
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación en la solicitud",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
}

// ─── Validaciones ─────────────────────────────────────────────────────────────
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Debe proporcionar un correo electrónico válido")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Debe proporcionar un correo electrónico válido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];

// ─── Definición de Rutas ──────────────────────────────────────────────────────

// POST /api/auth/register — Registro de nuevo cliente
router.post("/register", registerValidation, handleValidationErrors, authController.register);

// POST /api/auth/login — Inicio de sesión con JWT
router.post("/login", loginValidation, handleValidationErrors, authController.login);

// GET /api/auth/me — Perfil del usuario autenticado (requiere cabecera Bearer Token)
router.get("/me", protect, authController.getProfile);

module.exports = router;
