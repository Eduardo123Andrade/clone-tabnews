import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
});

describe("Method not allowed /api/v1/migrations", () => {
  describe("Anonymous user - DELETE", () => {
    test("Throw MethodNotAllowedError", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Metodo não permitido para esse endpoint.",
        action: "Verifique se o método HTTP é válido para esse endpoint.",
        status_code: 405,
      });
    });
  });

  describe("Anonymous user - PATCH", () => {
    test("Throw MethodNotAllowedError", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations", {
        method: "PATCH",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Metodo não permitido para esse endpoint.",
        action: "Verifique se o método HTTP é válido para esse endpoint.",
        status_code: 405,
      });
    });
  });

  describe("Anonymous user - PUT", () => {
    test("Throw MethodNotAllowedError", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations", {
        method: "PUT",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Metodo não permitido para esse endpoint.",
        action: "Verifique se o método HTTP é válido para esse endpoint.",
        status_code: 405,
      });
    });
  });
});
