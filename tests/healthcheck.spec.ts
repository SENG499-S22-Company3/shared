import { request } from "../config";

describe("Algorithm 1 healthchecks", () => {
  it("should return a running message", async () => {
    const response = await request.algorithm1.get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("Algorithm 1 REST server is alive!");
  });
});

describe("Algorithm 2 healthchecks", () => {
  it("should return a running message", async () => {
    const response = await request.algorithm2.get("/healthcheck");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("OK");
  });
});

// TODO: Enable healthchecks for backend
describe("Backend healthchecks", () => {
  it("should return a running message", async () => {
    const response = await request.backend.get("/");
    //expect(response.statusCode).toBe(200);
  });
});
