
  "use client";
  import { ApolloProvider } from "@apollo/client";
  import client from "./lib/apolloClient";
  import "./globals.css";

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <ApolloProvider client={client}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ApolloProvider>
    );
  }