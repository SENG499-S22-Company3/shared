import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  from,
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
    // store the cookie values
    let session: null | string = null;

    // inject the cookie into the header
    const middlewareLink = new ApolloLink((operation, forward) => {
      if (session) {
        operation.setContext({
          headers: {
            Cookie: session.split(";")[0],
          },
        });
      }

      return forward(operation);
    });

    // extract the cookie from the header
    const afterwareLink = new ApolloLink((operation, forward) => {
      return forward(operation).map((response) => {
        const context = operation.getContext();
        const {
          response: { headers },
        } = context;

        if (headers) {
          const sid = headers.get("Set-Cookie");
          if (sid) {
            session = sid;
          }
        }

        return response;
      });
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: from([middlewareLink, afterwareLink, httpLink]),
    });
  },
};
