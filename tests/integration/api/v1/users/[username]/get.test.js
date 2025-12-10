import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmo.case@test.com",
          password: "teste@123",
        }),
      });

      const response = await fetch(
        "http:localhost:3000/api/v1/users/MesmoCase",
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "MesmoCase",
        email: "mesmo.case@test.com",
      });
    });

    test("Case miss match", async () => {
      await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "case.diferente@test.com",
          password: "teste@123",
        }),
      });

      const response = await fetch(
        "http:localhost:3000/api/v1/users/casediferente",
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "CaseDiferente",
        email: "case.diferente@test.com",
      });
    });

    test("With none exists username", async () => {
      const response = await fetch(
        "http:localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
