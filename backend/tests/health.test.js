/**
 * NexusHardware — Tests de la API
 * Test básico de health check del servidor
 */

const request = require("supertest");
const app = require("../src/index");

describe("GET /api/health", () => {
  it("debe responder con status 200 y body OK", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("OK");
    expect(res.body.project).toBe("NexusHardware API");
  });
});
