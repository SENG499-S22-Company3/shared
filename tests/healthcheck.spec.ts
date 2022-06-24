import supertest from "supertest";
import {
    gql,
} from "@apollo/client/core";
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
        const query = gql`
          query {
            me {
              id
            }
          }
        `;
        const response = await apollo_client.query({ query });
        expect(response.error).toBeUndefined();
        expect(response.data.me).toBe(null);        
    });

    it("should fail login with invalid credentials", async () => {
      const mutation = gql`
        mutation {
          login(username: "test", password: "test") {
            message
            token
            success
          }
        }
      `;
  
      const response = await apollo_client.mutate({ mutation });
      expect(response.errors).toBeUndefined();
      expect(response.data.login.success).toBe(false);
      expect(response.data.login.message).toBeDefined();
      expect(response.data.login.token).toBeDefined();    
    });
});