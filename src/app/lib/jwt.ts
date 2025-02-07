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

export const verifyToken = (token: string): UserPayload | null => {
  try {
    console.log("Token received for verification:", token); 
    console.log("Type of token:", typeof token); // Print token type

    if (!token || typeof token !== "string") {
      console.error("Invalid token format:", token);
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    console.log("Decoded Token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null; 
  }
};


