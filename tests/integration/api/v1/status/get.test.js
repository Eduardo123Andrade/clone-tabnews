test("GET to /api/v1/status shout return 200", async () => {
  const response = await fetch("http:localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const newDate = new Date(responseBody.updated_at);
  expect(responseBody.updated_at).toBe(newDate.toISOString());

  expect(responseBody.dependencies.database.version).toBe("16.0");
  expect(responseBody.dependencies.database.max_connections).toBe(100);
  expect(responseBody.dependencies.database.open_connections).toBe(1);
});
