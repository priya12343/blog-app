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

// Function to retrieve a user by email
// export const getUserByEmail = async (email: string): Promise<User | null> => {
//   try {
//     const res = await client.query('SELECT id, email, password FROM users WHERE email = $1', [email]);
//     if (res.rows.length === 0) {
//       return null; // User not found
//     }
//     return res.rows[0]; // Return the user object
//   } catch (error) {
//     console.error('Error retrieving user by email:', error);
//     throw new Error('Database query failed');
//   }
// };

// lib/db.ts
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
