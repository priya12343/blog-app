import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: number;
  email: string;
}

export function verifyToken(token: string): UserPayload | null { // Return UserPayload | null
  try {
    if (!token || typeof token !== "string") {
      return null; // Return null if no token
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    return decoded;
  } catch (error) {
    console.error("Token Verification Error:", error);
    return null; // Return null on error
  }
}


