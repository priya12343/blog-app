import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL, // Use your DB URL here
});

client.connect();

// User interface to define the user data structure
export interface User {
  id: string;
  email: string;
  password: string;
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};


// Function to close the connection (optional, can be used in a server shutdown or during testing)
export const closeConnection = async () => {
  await client.end();
};
