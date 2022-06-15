import supertest from "supertest";
import fetch from "cross-fetch";
import {
  ApolloClient,
  gql,
  InMemoryCache,
  HttpLink,
} from "@apollo/client/core";

const BACKEND = process.env.BACKEND_URL || "http://localhost:4000";

// for REST based calls, could probably replace with formal fetch/axios etc.
const request = supertest(BACKEND);

// for GraphQL based calls. could need two instances for (for each company)
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${BACKEND}/graphql`,
    fetch,
  }),
  credentials: "include",
});

describe("HTTP Rest API Example", () => {
  it("should pass the healthcheck", async () => {
    const response = await request.get("/healthcheck");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("OK");
  });
});

describe("GraphQL API Example", () => {
  it("should return a null result for the 'me' query", async () => {
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
