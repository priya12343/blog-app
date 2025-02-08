// import { prisma } from "../../../../prisma/db";
import { createToken } from '@/app/lib/jwt';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
export const resolvers = {
  Query: {
    getPosts: async (_parent: any, { page, limit, search }: any, context: any) => {
      if (!context.userId) {
        throw new Error("No User Found");
      }
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
        throw new Error("Failed to fetch posts");
      }
    },

    getPostById: async (_parent: any, { id }: any, context: any) => {
      if (!id) {
        throw new Error("Post ID is required.");
      }
      const postId = parseInt(id, 10);
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true },
      });
      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    }
  },

  Mutation: {
    signup: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("Email already in use. Please login or use another email.");
      }
      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
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

      const token = jwt?.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return {

        token: token.toString(), // Return token
        user,  // Return user object
      };
    },

    createPost: async (_: any, { title, content, category }: any, context: any) => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      return await prisma.post.create({
        data: {
          title,
          content,
          category,
          authorId: context.userId,
        },
      });
    },


    updatePost: async (_parent: any, { id, title, content, category }: any, context: any) => {
      // Ensure `id` is being passed correctly
      if (!id) {
        throw new Error('Post ID is required');
      }
      // Your logic for updating the post
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          category,
        },
      });
      return updatedPost;
    },

    deletePost: async (_parent: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error('Not authenticated');
      
      try {
        const deletePost = await prisma.post.delete({
          where: { id }
        });
    
        // If the post is successfully deleted, return true.
        return true;
      } catch (error) {
        // If the deletion fails, return false.
        return false;
      }
    },
    
  },

};
