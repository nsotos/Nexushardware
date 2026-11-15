/**
 * NexusHardware — Middleware de Autenticación y Autorización
 * Valida tokens JWT y protege rutas sensibles del backend.
 */

const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const JWT_SECRET = process.env.JWT_SECRET || "nexushardware_secret_key_jwt_2026_performance_test";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Genera un token JWT firmado para un usuario
 * @param {Object} user - Objeto con id, email, role y name
 * @returns {string} Token JWT
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Middleware para proteger rutas que requieren autenticación
 * Espera cabecera: "Authorization: Bearer <token>"
 */
async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acceso no autorizado: No se proporcionó un token de autenticación",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscamos el usuario en la BD excluyendo la contraseña
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Sesión inválida: El usuario no existe",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Middleware para autorizar roles específicos (ej: ADMIN)
 * @param  {...string} roles - Roles permitidos ('ADMIN', 'CUSTOMER')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: El rol '${req.user?.role || "ANONYMOUS"}' no tiene permisos para este recurso`,
      });
    }
    next();
  };
}

module.exports = {
  generateToken,
  protect,
  authorize,
};
