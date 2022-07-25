import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  from,
  gql,
} from "@apollo/client/core";
import fetch from "cross-fetch";
import supertest from "supertest";

// Declare URLs for algorithm 1, algorithm 2, and backend
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export const ALGORITHM1_URL =
  process.env.ALGORITHM1_URL || "http://localhost:4040/";
export const ALGORITHM2_URL =
  process.env.ALGORITHM2_URL || "http://localhost:5000/";

const httpLink = createHttpLink({
  uri: BACKEND_URL,
  fetch,
  credentials: "include",
});

export const request = {
  backend: supertest(BACKEND_URL),
  algorithm1: supertest(ALGORITHM1_URL),
  algorithm2: supertest(ALGORITHM2_URL),
  createApolloClient: () => {
    let token: null | string = null;

    // inject the cookie into the header
    const middlewareLink = new ApolloLink((operation, forward) => {
      if (token) {
        operation.setContext({
          headers: {
            Authorization: token,
          },
        });
      }

      return forward(operation);
    });

    return {
      client: new ApolloClient({
        cache: new InMemoryCache(),
        link: from([middlewareLink, httpLink]),
      }),
      setToken: (newToken: string) => {
        token = newToken;
      },
    };
  },
};

export const login = async (role: "ADMIN" | "USER") => {
  const { client, setToken } = request.createApolloClient();
  // login as admin
  const res = await client.mutate({
    mutation: gql`
      mutation ($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          success
          token
        }
      }
    `,
    variables: {
      username: role === "ADMIN" ? "testadmin" : "testuser",
      password: "testpassword",
    },
  });
  expect(res.data.login.success).toBeTruthy();
  expect(res.data.login.token).toBeDefined();
  setToken(res.data.login.token);
  return client;
};
