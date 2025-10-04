const request = require("supertest");
const app = require("../src/app"); // لاحظ هنا: استوردت app مش index

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello, World!");
  });
});
