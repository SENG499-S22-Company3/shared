import { gql } from "@apollo/client/core";
import { request } from "../config";

describe("authentication", () => {
  describe("when a user is not logged in", () => {
    it("should return a null result for the GraphQL 'me' query", async () => {
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

  describe("when a user is logged in", () => {
    describe("when the user is role ADMIN", () => {
      it("logins in as ADMIN and returns the role from the me query", async () => {
        const { client, setToken } = request.createApolloClient();
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
        expect(loginResponse.data.login.token).toBeDefined();

        setToken(loginResponse.data.login.token);

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
        expect(response.data.me.role).toBe("ADMIN");
      });
    });
    describe("when the user is role USER", () => {
      it("logins in as ADMIN and returns the role from the me query", async () => {
        const { client, setToken } = request.createApolloClient();
        const mutation = gql`
          mutation {
            login(username: "testuser", password: "testpassword") {
              message
              token
              success
            }
          }
        `;

        const loginResponse = await client.mutate({ mutation });
        expect(loginResponse.errors).toBeUndefined();
        expect(loginResponse.data.login.success).toBeTruthy();
        expect(loginResponse.data.login.token).toBeDefined();

        setToken(loginResponse.data.login.token);

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
        expect(response.data.me.role).toBe("USER");
      });
    });
  });

  it("should fail login with invalid credentials", async () => {
    const { client } = request.createApolloClient();
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
    expect(response.data.login.token).toEqual("");
  });

  it("should 'logout' successfully after being logged in, i.e.", async () => {
    const { client } = request.createApolloClient();

    // Log in
    const loginMutation = gql`
      mutation {
        login(username: "testadmin", password: "testpassword") {
          message
          token
          success
        }
      }
    `;

    const loginResponse = await client.mutate({ mutation: loginMutation });
    expect(loginResponse.errors).toBeUndefined();
    expect(loginResponse.data.login.success).toBeTruthy();
    expect(loginResponse.data.login.message).toBeDefined();
    expect(loginResponse.data.login.token).toBeDefined();

    // Log out
    const logoutMutation = gql`
      mutation {
        logout {
          message
          token
          success
        }
      }
    `;

    // Response is dummy since it is up to the client-side to implement logout.
    const logoutResponse = await client.mutate({ mutation: logoutMutation });
    expect(logoutResponse.errors).toBeUndefined();
    expect(logoutResponse.data.logout.success).toBeTruthy();
    expect(logoutResponse.data.logout.message).toEqual("logged out");
    expect(logoutResponse.data.logout.token).toEqual("");
  });
});
