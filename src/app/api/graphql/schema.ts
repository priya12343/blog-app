import { gql } from 'graphql-tag';  // Use graphql-tag instead of @apollo/client for server-side

export const typeDefs = gql`
scalar DateTime
scalar ID
  type UserSignUp {
    id: Int
    username:String
    email: String
    createdAt: String
  }
  type User {
    id: Int
    email: String
    createdAt: String
  }

  type Post {
  id: Int!
  title: String!
  content: String!
  category: String!
  createdAt: DateTime!
  author: User!
  authorId: Int!
}
  type AuthPayload {
    token: String
    user: User
  }
  type AuthPayloadSignUp {
    token: String
    user: UserSignUp
  }
  type Pagination {
      totalPages: Int
      currentPage: Int
    }
  type PostConnection {
    data: [Post]
    pagination: Pagination
    }
  type Query {
    getPosts(page: Int!, limit: Int!, search: String): PostConnection
    getPostById(id: Int!): Post
  }

  type Mutation {
    signup(username:String!,email: String!, password: String!): AuthPayloadSignUp
    login(email: String!, password: String!): AuthPayload
    createPost(title: String!, content: String!, category: String!): Post!
    updatePost(id: Int!, title: String, content: String, category: String): Post
    deletePost(id: Int!): Boolean
  }
`;
