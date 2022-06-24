import supertest from "supertest";
import {
    BACKEND_URL,
    ALGORITHM1_URL,
    ALGORITHM2_URL,
    apollo_client,
} from "./test_config";

// Setup supertest for requests to each module
const request_backend = supertest(BACKEND_URL);
const request_algorithm1 = supertest(ALGORITHM1_URL);
const request_algorithm2 = supertest(ALGORITHM2_URL);

describe("Generate base schedule with courses to timeslots and professors to courses assigned", () => {
    it("should return a valid base schedule", async () => {
        // TODO: Add the actual tests to generate base schedule
        expect(true).toEqual(true);
    });
});