import { request } from "../config";

describe("capacity generation", () => {
  describe("when a capacity is passed provided", () => {
    it("leaves the capacity as is", async () => {
      const response = await request.algorithm2
        .post("/predict_class_size")
        .send([
          {
            subject: "CSC",
            code: "225",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 50,
          },
        ]);
      expect(response.body[0].capacity).toEqual(50);
    });
  });
  describe("when a capacity is not provided", () => {
    it("generates a reasonable capacity value", async () => {
      const response = await request.algorithm2
        .post("/predict_class_size")
        .send([
          {
            subject: "CSC",
            code: "225",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 0,
          },
        ]);
      expect(response.body[0].capacity).toEqual(50);
    });
  });
});
