import { gql } from "@apollo/client/core";
import { apolloClient } from "../config";

describe("authentication", () => {
  describe("when a user is not logged in", () => {
    it("should return a null result for the GraphQL 'me' query", async () => {
      const query = gql`
        query {
          me {
            id
          }
        }
      `;
      const response = await apolloClient.query({ query });
      expect(response.error).toBeUndefined();
      expect(response.data.me).toBeNull();
    });
  });

  describe("when a user is logged in", () => {
    describe("when the user is role ADMIN", () => {});
    describe("when the user is role USER", () => {});
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

    const response = await apolloClient.mutate({ mutation });
    expect(response.errors).toBeUndefined();
    expect(response.data.login.success).toBeFalsy();
    expect(response.data.login.message).toBeDefined();
    expect(response.data.login.token).toBeDefined();
  });
});
