import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {

    test("Retrieving current system status", async () => {
      const response = await fetch("http:localhost:3000/api/v1/status");

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const newDate = new Date(responseBody.updated_at);
      expect(responseBody.updated_at).toBe(newDate.toISOString());

      expect(responseBody.dependencies.database.version).toBe("16.0");
      expect(responseBody.dependencies.database.max_connections).toBe(100);
      expect(responseBody.dependencies.database.open_connections).toBe(1);
    })
  })
})
