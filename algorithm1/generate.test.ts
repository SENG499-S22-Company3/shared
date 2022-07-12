import { request } from "../config";
import input from "./data/algo1-test-input.json";

describe("algorithm 1", () => {
  it("works for min input", async () => {
    const res = await request.algorithm1.post("/schedule").send(input);
    expect(res.statusCode).toBe(200);
  });
});
