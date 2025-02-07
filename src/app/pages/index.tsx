// pages/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, gql } from '@apollo/client';
import { useState } from 'react';

const GET_POSTS = gql`
  query GetPosts($page: Int!, $search: String!) {
    getPosts(page: $page, search: $search) {
      id
      title
      content
      createdAt
      author {
        email
      }
    }
  }
`;

const Home = () => {
  const [search, setSearch] = useState('');
  const { loading, data } = useQuery(GET_POSTS, {
    variables: { page: 1, search },
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search posts" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      <ul>
        {data.getPosts.map((post: any) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
