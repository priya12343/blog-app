
# Blog Platform

This project is a full-stack blog platform built with Next.js, GraphQL, PostgreSQL, and Tailwind CSS. It allows users to sign up, log in, create, update, delete, and view posts. The platform provides a responsive UI and supports authentication via JWT tokens.

## Features

- **User Authentication**: 
  - Sign up, login, and logout functionalities.
  - JWT-based authentication for secure login and token management.
  
- **Blog Post CRUD Operations**: 
  - **Create Post**: Authenticated users can create new blog posts.
  - **Update Post**: Authenticated users can update their existing posts.
  - **Delete Post**: Authenticated users can delete posts they created.
  - **View All Posts**: View a list of all published posts.
  - **View Post by ID**: View a single post by its ID.
  
- **Pagination and Filtering**: 
  - Pagination for viewing multiple posts.
  - Filter posts by title or category for easy searching.
  
- **Responsive Design**: 
  - The platform is built with Tailwind CSS to provide a mobile-first, responsive UI.
  
- **SEO Optimization**: 
  - Pages are optimized for SEO using Next.js features like Static Site Generation (SSG) and Incremental Static Regeneration (ISR).

## Technologies Used

- **Next.js**: For building the frontend and backend in one place (API routes for GraphQL).
- **Tailwind CSS**: For responsive and utility-first styling.
- **GraphQL**: For querying and mutating blog data.
- **PostgreSQL**: For storing user and blog post data.
- **Apollo Client**: For handling GraphQL mutations and queries on the frontend.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Node.js**: For the backend API and server-side logic.

## Setup Instructions

### Prerequisites

Ensure that you have the following tools installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) for your database

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/blog-platform.git

   Navigate into the project directory:
   cd blog-app

   Install the dependencies:
   npm install

Set up your PostgreSQL database. Make sure to create a database for the project and adjust the connection settings in your .env file.

Set up the GraphQL API server by running the following command to start the Next.js development server:  npm run dev

This will start the application at http://localhost:3000.

Environment Variables

Create a .env file in the root directory with the following values:

DATABASE_URL="postgresql://postgres:PostgrePass@localhost:8080/postgres?schema=public"
JWT_SECRET="25a3eb189093cd4cc249102af2d1680e644d4c74af60cd9976606cb821a189aab936feeed27d59288e59c92cecc78aa3a1d05b2fe0bcc71263b30e8d2fc755f0"
NEXT_PUBLIC_API_URL="http://localhost:3000"

Make sure to replace <username>, <password>, and <your-database-name> with your actual PostgreSQL credentials.
Features

Authentication

Sign Up: Users can create an account by providing an email and password.
Login: Users can log in using their email and password. A JWT token is stored for subsequent authenticated requests.
Logout: Users can log out, and the JWT token will be removed.



Blog Post Management

Create Post: Authenticated users can create a new post by providing a title and content.
Update Post: Users can update their existing posts by providing a new title or content.
Delete Post: Authenticated users can delete posts that they created.
View All Posts: Displays a list of all blog posts with pagination and search functionality.
View Post by ID: Users can view the full content of a post by its unique ID.

Pagination and Search


Pagination: Users can navigate between pages of blog posts using "Previous" and "Next" buttons.
Search Posts: Filter posts by title or category to easily find specific content

Usage

Sign up: Navigate to the /signup page and create a new account.
Login: After signing up, log in with your credentials at the /login page.
Create a Post: Once logged in, you can create a new blog post via the "Create New Post" button.
View All Posts: On the home page, you can see all available posts. You can also search and filter posts.
Edit or Delete Post: Click on any post to edit or delete it if you're the author.


## Features

  
- **Responsive Design**: 
  - The platform is built with Tailwind CSS to provide a mobile-first, responsive UI.
  
- **SEO Optimization**: 
  - Pages are optimized for SEO using Next.js features like Static Site Generation (SSG) and Incremental Static Regeneration (ISR).

## Prisma Setup

This project uses **Prisma** to manage the PostgreSQL database and provide a strongly-typed schema for querying the database.

### Installation

1. Install Prisma CLI as a development dependency:

   ```bash
   npm install prisma --save-dev

Initialize Prisma and create the initial schema:

npx prisma init

Define the Prisma schema in prisma/schema.prisma. Here's an example of the schema:
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}



Database Migrations

Generate Prisma Client:

npx prisma generate

Create Migration:
npx prisma migrate dev --name init

Explanation of GraphQL Schema

User: Represents the user object with an ID, email, password, and a list of associated posts.
Post: Represents the blog post object with an ID, title, content, published status, and timestamps.

Query:

posts: Fetches all posts.
post(id: Int!): Fetches a post by its unique ID.
users: Fetches all users.

Mutation:

createUser: Allows creating a new user with email and password.
loginUser: Handles the login process and returns a JWT token for authentication.
createPost: Allows the creation of a new blog post.
updatePost: Allows updating an existing blog post.
deletePost: Allows deleting a blog post by its ID.
AuthPayload: Defines the structure of the response for the login mutation, which returns a JWT token.