import { gql } from "@apollo/client/core";
import { request } from "../config";

describe("authentication", () => {
  describe("when a user is not logged in", () => {
    it("should return a null result for the GraphQL 'me' query", async () => {
      const client = request.createApolloClient();
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

  describe("when a user is logged in", () => {
    describe("when the user is role ADMIN", () => {
      it("logins in as ADMIN and returns the role from the me query", async () => {
        const client = request.createApolloClient();
        const mutation = gql`
          mutation {
            login(username: "testadmin", password: "testpassword") {
              message
              token
              success
            }
          }
        `;

        const loginResponse = await client.mutate({ mutation });
        expect(loginResponse.errors).toBeUndefined();
        expect(loginResponse.data.login.success).toBeTruthy();
        expect(loginResponse.data.login.message).toBeDefined();
        expect(loginResponse.data.login.token).toBeDefined();

        const query = gql`
          query {
            me {
              role
            }
          }
        `;

        const response = await client.query({ query });
        expect(response.error).toBeUndefined();
        expect(response.data.me).not.toBeNull();
      });
    });
    describe("when the user is role USER", () => {});
  });

  it("should fail login with invalid credentials", async () => {
    const client = request.createApolloClient();
    // user doesn't exist
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
    expect(response.data.login.success).toBeFalsy();
    expect(response.data.login.message).toBeDefined();
    expect(response.data.login.token).toBeDefined();
  });
});
