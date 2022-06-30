import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import fetch from "cross-fetch";
import supertest from "supertest";

// Declare URLs for algorithm 1, algorithm 2, and backend
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
export const ALGORITHM1_URL =
  process.env.ALGORITHM1_URL || "http://localhost:4040/";
export const ALGORITHM2_URL =
  process.env.ALGORITHM2_URL || "http://localhost:5000/";

// Setup ApolloClient to execute GraphQL calls in backend
export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${BACKEND_URL}/graphql`,
    fetch,
  }),
  credentials: "include",
});

export const request = {
  backend: supertest(BACKEND_URL),
  algorithm1: supertest(ALGORITHM1_URL),
  algorithm2: supertest(ALGORITHM2_URL),
};
