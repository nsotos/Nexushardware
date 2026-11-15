/**
 * NexusHardware — Tests Automatizados de la API de Autenticación
 * Valida registro, login, generación y protección de rutas con JWT.
 */

const request = require("supertest");
const app = require("../src/index");
const prisma = require("../src/prisma/client");

describe("API de Autenticación de NexusHardware (/api/auth)", () => {
  const testEmail = `test_${Date.now()}@utem.cl`;
  const testPassword = "PasswordSegura123!";
  let authToken = "";

  afterAll(async () => {
    // Limpiamos los usuarios de prueba creados durante los tests
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "test_",
        },
      },
    });
    await prisma.$disconnect();
  });

  // ─── Tests de Registro ────────────────────────────────────────────────────────
  describe("POST /api/auth/register", () => {
    it("debe registrar un nuevo usuario con éxito y retornar token JWT", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Usuario Test UTEM",
          email: testEmail,
          password: testPassword,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
      expect(res.body.user.password).toBeUndefined(); // Nunca retornar la contraseña
    });

    it("debe rechazar el registro si el correo ya existe", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Usuario Duplicado",
          email: testEmail,
          password: testPassword,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("ya se encuentra registrado");
    });

    it("debe rechazar el registro si la contraseña tiene menos de 6 caracteres", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Usuario Invalido",
          email: "invalido@utem.cl",
          password: "123",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  // ─── Tests de Login ───────────────────────────────────────────────────────────
  describe("POST /api/auth/login", () => {
    it("debe iniciar sesión con credenciales correctas y entregar token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail.toLowerCase());

      // Guardamos el token para los tests de rutas protegidas
      authToken = res.body.token;
    });

    it("debe rechazar el login con contraseña incorrecta", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testEmail,
          password: "PasswordEquivocada999!",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Credenciales inválidas");
    });

    it("debe rechazar el login si el usuario no existe", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "no_existe_987654@utem.cl",
          password: testPassword,
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── Tests de Perfil Protegido ────────────────────────────────────────────────
  describe("GET /api/auth/me", () => {
    it("debe retornar los datos del usuario si se envía un token válido", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
    });

    it("debe rechazar el acceso si no se envía la cabecera Authorization", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("debe rechazar el acceso si el token es corrupto", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer token_falso_invalido_123");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
