import fetch, { Headers } from "cross-fetch";
require('isomorphic-fetch');

// Declare URLs for algorithm 1, algorithm 2, and backend
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
export const ALGORITHM1_URL = process.env.ALGORITHM1_URL || "http://localhost:4040/";
export const ALGORITHM2_URL = process.env.ALGORITHM2_URL || "http://localhost:5000/";

// This method uses fetch to send a GraphQL query/mutation to the specified server, otherwise the default Backend URL
export const sendGraphQLQuery = async (query: string, sessionCookie: string | null = null, URL: string = `${BACKEND_URL}/graphql`) => {
  // Set request headers, and set cookie if provided.
  const headers = new Headers();
  headers.set("Content-type", "application/json");
  if (sessionCookie != null) {
    headers.set("Cookie", sessionCookie);
  }

  // Send request
  const response = await fetch(URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: query})
  })
  return response;
}