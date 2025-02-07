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
    const authHeader = req.headers.get("authorization");
    console.log("Authorization Header:", authHeader); // Debug log

    const token = authHeader?.split(" ")[1]; // Extract the token

    if (!token) {
      console.warn("No token provided");
      return {}; // No token
    }
console.log("tokentoken-----",)

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error("Invalid or expired token");
      return {}; // Token invalid
    }

    console.log("Decoded Token:", decoded); // Debugging output
    return { userId: decoded.userId, prisma }; // Attach user info and Prisma client to context
  } catch (error) {
    console.error("Error in context function:", error);
    return {}; // Handle any unexpected errors
  }
},

  });
  
  

export { handler as GET, handler as POST };
