import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "filipedeschamps",
          email: "teste@test.com",
          password: "teste@123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "filipedeschamps",
        email: "teste@test.com",
        password: "teste@123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated email", async () => {
      const response1 = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emaildDuplicado1",
          email: "duplicado@test.com",
          password: "teste@123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emaildDuplicado2",
          email: "Duplicado@test.com",
          password: "teste@123",
        }),
      });

      expect(response1.status).toBe(201);
      expect(response2.status).toBe(400);

      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado",
        action: "Utilize outro email para realizar o cadastro",
        status_code: 400,
      });
    });

    test("With duplicated username", async () => {
      const response1 = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameDuplicado",
          email: "email1@test.com",
          password: "teste@123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameDuplicado",
          email: "email2@test.com",
          password: "teste@123",
        }),
      });

      expect(response1.status).toBe(201);
      expect(response2.status).toBe(400);

      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O nome de usuário informado já está sendo utilizado",
        action: "Utilize outro nome de usuário para realizar o cadastro",
        status_code: 400,
      });
    });
  });
});
