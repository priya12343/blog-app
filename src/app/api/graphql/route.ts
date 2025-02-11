
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver";
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req: NextRequest) => {
    try {
      const authHeader = req?.headers?.get("authorization");

      const token = authHeader?.split(" ")[1]; // Extract the token

      if (!token) {
        return { userId: null, prisma }; // Return a valid context even when no token
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { userId: null, prisma }; // Token invalid, still return valid context
      }

      return { userId: decoded.userId, prisma }; // Attach user info and Prisma client to context
    } catch (error) {
      console.log(error)
      return { userId: null, prisma }; // Handle any unexpected errors, still return context
    }
  },
});

export { handler as GET, handler as POST };
