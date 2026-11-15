/**
 * NexusHardware — Controlador de Autenticación
 * Maneja el registro de clientes, login con JWT y consulta de perfil.
 */

const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const { generateToken } = require("../middleware/authMiddleware");

/**
 * Registra un nuevo usuario cliente
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Normalizamos el correo
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verificamos si el usuario ya existe en la BD
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya se encuentra registrado",
      });
    }

    // 2. Hasheamos la contraseña con bcrypt (10 rondas de salt)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insertamos el nuevo usuario en PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 4. Generamos el token de autenticación
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Inicia sesión con credenciales existentes
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Buscamos el usuario por su correo
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Mensaje genérico de error por seguridad (evita enumeración de usuarios)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas: Correo o contraseña incorrectos",
      });
    }

    // 2. Comparamos la contraseña en texto plano contra el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas: Correo o contraseña incorrectos",
      });
    }

    // 3. Generamos el token de sesión
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retorna la información del usuario autenticado actual
 * GET /api/auth/me
 */
async function getProfile(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

module.exports = {
  register,
  login,
  getProfile,
};
