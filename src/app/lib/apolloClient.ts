
'use client'

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({ uri: process.env.NEXT_PUBLIC_API_URL+"/api/graphql" ||'http://localhost:3000/api/graphql'  });

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token"); // Only access localStorage in the browser
  }
  console.log('localStorage.getItem("token")---',localStorage.getItem("token"))
  return null;
};
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Attach token to headers
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${getAuthToken()}`, // Call the function instead
  },
});

export default client;
