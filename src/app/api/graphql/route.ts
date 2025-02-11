import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// ✅ Middleware to add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to your frontend domain if necessary
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Handle GraphQL requests with CORS headers
const handler = async (req: NextRequest) => {
  const response = await startServerAndCreateNextHandler(apolloServer, {
    context: async () => {
      try {
        const authHeader = req?.headers?.get("authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) return { userId: null, prisma };

        const decoded = verifyToken(token);
        if (!decoded) return { userId: null, prisma };

        return { userId: decoded.userId, prisma };
      } catch (error) {
        console.log(error);
        return { userId: null, prisma };
      }
    },
  })(req);

  // ✅ Attach CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

// ✅ Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export { handler as GET, handler as POST };
