import { Resolvers } from '@apollo/client';
import { PrismaClient, Prisma, User, Post } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
export interface GraphQLContext {
  userId?: number;
}

export const resolvers: Resolvers = {
  Query: {
    getPosts: async (
      _parent: unknown,
      { page, limit, search }: { page: number; limit: number; search?: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error("No User Found");
      }

      try {
        const skip = (page - 1) * limit;
        const whereCondition: Prisma.PostWhereInput = search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
              ],
            }
          : {};

        const posts = await prisma.post.findMany({
          where: whereCondition,
          include: { author: true },
          take: limit,
          skip: skip,
        });

        const totalPosts = await prisma.post.count({
          where: whereCondition,
        });

        return {
          data: posts,
          pagination: {
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
          },
        };
      } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch posts");
      }
    },

    getPostById: async (
      _parent: unknown,
      { id }: { id: number },
    ): Promise<Post | null> => {
      if (!id) {
        throw new Error("Post ID is required.");
      }

      const post = await prisma.post.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    },
  },

  Mutation: {
    signup: async (
      _parent: unknown,
      { username, email, password }: { username: string; email: string; password: string }
    ): Promise<{ token: string; user: User }> => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email already in use. Please login or use another email.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      return { token, user };
    },

    login: async (
      _parent: unknown,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; user: User }> => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) throw new Error("User not found");

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      return { token, user };
    },

    createPost: async (
      _parent: unknown,
      { title, content, category }: { title: string; content: string; category: string },
      context: GraphQLContext
    ): Promise<Post> => {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      return prisma.post.create({
        data: {
          title,
          content,
          category,
          authorId: context.userId,
        },
      });
    },

    updatePost: async (
      _parent: unknown,
      { id, title, content, category }: { id: number; title: string; content: string; category: string },
    ): Promise<Post> => {
      if (!id) {
        throw new Error("Post ID is required");
      }

      return prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          category,
        },
      });
    },

    deletePost: async (
      _parent: unknown,
      { id }: { id: number },
    ): Promise<boolean> => {
      try {
        await prisma.post.delete({
          where: { id },
        });
        return true;
      } catch (error) {
        console.log(error)
        return false;
      }
    },
  },
};
