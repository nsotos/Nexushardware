/**
 * NexusHardware — Cliente Singleton de Prisma
 * Evita instanciar múltiples conexiones y saturar el pool de PostgreSQL.
 */

const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // En desarrollo reutiliza la instancia global para evitar agotar conexiones con nodemon
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: process.env.DEBUG_PRISMA === "true" ? ["query", "error", "warn"] : ["error"],
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;
