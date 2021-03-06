import { request } from "../config";
import { gql } from "@apollo/client/core";

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

describe("Backend healthchecks", () => {
  it("should return a running message", async () => {
    const { client } = request.createApolloClient();
    const query = gql`
      query {
        me {
          id
        }
      }
    `;
    const response = await client.query({ query });
    expect(response.error).toBeUndefined();
    expect(response.data.me).toBeNull();
  });
});
