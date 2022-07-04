import supertest from "supertest";
import {
    BACKEND_URL,
    ALGORITHM1_URL,
    ALGORITHM2_URL,
    sendGraphQLQuery,
} from "./test_config";

// Setup supertest for requests to each module
const request_backend = supertest(BACKEND_URL);
const request_algorithm1 = supertest(ALGORITHM1_URL);
const request_algorithm2 = supertest(ALGORITHM2_URL);

describe("Algorithm 1 healthchecks", () => {
    it("should return a running message", async () => {
        const response = await request_algorithm1.get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual("Algorithm 1 REST server is alive!");
    });
});

describe("Algorithm 2 healthchecks", () => {
    it("should return a running message", async () => {
        const response = await request_algorithm2.get("/healthcheck");
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual("OK");
    });
})

describe("Backend healthchecks", () => {
    it("should return a running message", async () => {
        const response = await request_backend.get("/healthcheck");
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual("OK");
    });

    it("should return a null result for the GraphQL 'me' query", async () => {
        const responseMeQuery = await sendGraphQLQuery(
          `query {
            me {
              id
            }
          }`
        )

        const responseMeQueryJSON = await responseMeQuery.json();
        expect(responseMeQueryJSON.data.me).toBe(null);      
    });
});