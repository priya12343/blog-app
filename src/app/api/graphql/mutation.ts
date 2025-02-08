import { gql } from "@apollo/client";
export const SIGNUP_MUTATION = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
  signup(username: $username, email: $email, password: $password) {
    token
    user {
      id
      username
      email
      createdAt
    }
  }
}
`;
export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;
export const GET_POSTS = gql`
  query getPosts($page: Int!, $limit: Int!, $search: String) {
    getPosts(page: $page, limit: $limit, search: $search) {
      data {
        id
        title
        content
        category
      }
      pagination {
        totalPages
        currentPage
      }
    }
  }
`;
export const GET_POST_BY_ID = gql`
  query getPostById($id: Int!) {
    getPostById(id: $id) {
      id
      title
      content
      category
    }
  }
`;
export const CREATE_POST = gql`
  mutation createPost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      id
      title
      content
      category
      createdAt
    }
  }
`;
export const UPDATE_POST = gql`
  mutation updatePost($id: Int!, $title: String!, $content: String!, $category: String!) {
    updatePost(id: $id, title: $title, content: $content, category: $category) {
      id
      title
      content
      category
    }
  }
`;
export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;



