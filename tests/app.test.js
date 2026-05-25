const request = require("supertest");
const app = require("../src/app");

describe("GET /", () => {
  it("returns 200 with message and version", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("version");
  });
});

describe("GET /health", () => {
  it("returns status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("GET /info", () => {
  it("returns system info", async () => {
    const res = await request(app).get("/info");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("node");
    expect(res.body).toHaveProperty("platform");
    expect(res.body).toHaveProperty("memory");
  });
});