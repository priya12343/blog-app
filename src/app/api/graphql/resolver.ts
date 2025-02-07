// import { prisma } from "../../../../prisma/db";
import { createToken } from '@/app/lib/jwt';
import { PrismaClient ,Prisma} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
  export const resolvers = {
  Query: {
    getPosts: async (_parent: any, { page, limit, search }: any) => {
      try {
        // Calculate pagination
        const skip = (page - 1) * limit;
    
        // Create the search condition
        const whereCondition: Prisma.PostWhereInput = search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
              ],
            }
          : {};
    
        // Query posts with pagination and search
        const posts = await prisma.post.findMany({
          where: whereCondition,
          include: { author: true }, // Including author information
          take: limit,
          skip: skip,
        });
    
        // Get total number of posts matching the search condition
        const totalPosts = await prisma.post.count({
          where: whereCondition,
        });
    
        // Return the posts and pagination info
        return {
          data: posts,
          pagination: {
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
          },
        };
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    },
    
  
    getPost: async ({ id }:any) => {
      return await prisma.post.findUnique({ where: { id }, include: { author: true } });
    },
  },
  Mutation: {
    signup: async(_: any, { username,email, password }: {username:string; email: string; password: string }) => {
      console.log("signupdata========",username,email,password)
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("Email already in use. Please login or use another email.");
      }
      const user = await prisma.user.create({
        data: {username, email, password: hashedPassword },
      });

      // Create JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      // Return the token and user in a single response object
      return {
        token,
        user: user,
      };
    },
  
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error('Invalid password');

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    console.log("tokentoken-------------",token,user)
    // const tokens = localStorage.getItem("token");
      return {

        token:token.toString(), // Return token
        user,  // Return user object
      };
    },
 
    createPost: async (_: any, { title, content, category }: any, context: any) => {
      console.log("Context in createPost:", context); // Log the context
    
      // if (!context.userId) {
      //   throw new Error("Not authenticated");
      // }
    
      return await prisma.post.create({
        data: {
          title,
          content,
          category,
          authorId: context.userId,
        },
      });
    },
    
    
    updatePost: async ({ id, title, content }:any, context:any) => {
      if (!context.userId) throw new Error('Not authenticated');
      return await prisma.post.update({
        where: { id },
        data: { title, content },
      });
    },
    deletePost: async ({ id }:any, context:any) => {
      if (!context.userId) throw new Error('Not authenticated');
      await prisma.post.delete({ where: { id } });
      return true;
    },
  },

  };
