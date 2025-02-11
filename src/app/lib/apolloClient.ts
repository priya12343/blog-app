// lib/apolloClient.ts

'use client';
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL + "/api/graphql" || 'https://blog-app-priya12343-priya-vinayagams-projects.vercel.app//api/graphql',
});

const authLink = setContext((_, { headers }) => {
  if (typeof window === "undefined") {
    return { headers }; // Avoid accessing localStorage on the server
  }

  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined", // Enable SSR mode for server-side execution
});


export default client;
