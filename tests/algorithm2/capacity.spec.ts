import { request } from "../../config";

describe("capacity generation", () => {
  describe("no courses", () => {
    it("doesn't throw an error", async () => {
      const response = await request.algorithm2
        .post("/predict_class_size")
        .send([]);
      expect(response.body).toEqual([]);
    });
  });

  describe("single course - capacity is not provided", () => {
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
      expect(response.body[0].capacity).toBeGreaterThan(20);
    });
  });

  describe("single course - capacity is provided", () => {
    it("doesn't change the capacity value", async () => {
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
    })
  });

  describe("multiple courses - capacity is not provided", () => {
    it("predicts a capacity for all courses", async () => {
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
          {
            subject: "SENG",
            code: "310",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 0,
          },
          {
            subject: "ECE",
            code: "355",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 0,
          },
        ]);
      expect(response.body[0].capacity).toBeGreaterThan(20);
      expect(response.body[1].capacity).toBeGreaterThan(20);
      expect(response.body[2].capacity).toBeGreaterThan(20);
    })
  });

  describe("multiple courses - capacity is provided for all", () => {
    it("doesn't change the capacity values", async () => {
      const response = await request.algorithm2
        .post("/predict_class_size")
        .send([
          {
            subject: "CSC",
            code: "225",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 30,
          },
          {
            subject: "SENG",
            code: "310",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 40,
          },
          {
            subject: "ECE",
            code: "355",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 50,
          },
        ]);
      expect(response.body[0].capacity).toEqual(30);
      expect(response.body[1].capacity).toEqual(40);
      expect(response.body[2].capacity).toEqual(50);
    })
  });

  describe("multiple courses - capacity is provided for some", () => {
    it("doesn't change the capacity values for those with capacities provided, does predict capacities for those with no value provided", async () => {
      const response = await request.algorithm2
        .post("/predict_class_size")
        .send([
          {
            subject: "CSC",
            code: "225",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 30,
          },
          {
            subject: "SENG",
            code: "310",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 0,
          },
          {
            subject: "ECE",
            code: "355",
            seng_ratio: 0.75,
            semester: "SUMMER",
            capacity: 50,
          },
        ]);
      expect(response.body[0].capacity).toEqual(30);
      expect(response.body[1].capacity).toBeGreaterThan(20);
      expect(response.body[2].capacity).toEqual(50);
    })
  });

});