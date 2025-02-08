import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver";
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";
 // Import Prisma instance

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
      return {}; // No token
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return {}; // Token invalid
    }

    return { userId: decoded.userId, prisma }; // Attach user info and Prisma client to context
  } catch (error) {
    return {}; // Handle any unexpected errors
  }
},

  });
  
  

export { handler as GET, handler as POST };
