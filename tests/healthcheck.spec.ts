import fetch from "cross-fetch";
import supertest from "supertest";
import {
    ApolloClient,
    gql,
    InMemoryCache,
    HttpLink,
} from "@apollo/client/core";

// Declare URLs for algorithm 1, algorithm 2, and backend
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const ALGORITHM1_URL = process.env.ALGORITHM1_URL || "http://localhost:4040/";
const ALGORITHM2_URL = process.env.ALGORITHM2_URL || "http://localhost:5000/";

// Setup supertest for requests to each module
const request_backend = supertest(BACKEND_URL);
const request_algorithm1 = supertest(ALGORITHM1_URL);
const request_algorithm2 = supertest(ALGORITHM2_URL);

// Setup ApolloClient to execute GraphQL calls
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${BACKEND_URL}/graphql`,
      fetch,
    }),
    credentials: "include",
});

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
        const response = await client.query({ query });
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
  
      const response = await client.mutate({ mutation });
      expect(response.errors).toBeUndefined();
      expect(response.data.login.success).toBe(false);
      expect(response.data.login.message).toBeDefined();
      expect(response.data.login.token).toBeDefined();    
    });
});