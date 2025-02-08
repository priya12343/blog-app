import jwt from 'jsonwebtoken';

// Secret key for signing JWT (store this securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || '25a3eb189093cd4cc249102af2d1680e644d4c74af60cd9976606cb821a189aab936feeed27d59288e59c92cecc78aa3a1d05b2fe0bcc71263b30e8d2fc755f0';

export interface UserPayload {
  userId: number;
  email: string;
}

// Create JWT Token
export const createToken = (user: UserPayload): string => {
  const payload: UserPayload = { userId: user.userId, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiry
};

export function verifyToken(token: string) {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("No token provided");
    }

    const decoded = jwt?.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}


