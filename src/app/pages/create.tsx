// pages/create.tsx
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      id
      title
    }
  }
`;

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [createPost] = useMutation(CREATE_POST);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost({ variables: { title, content, category } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Content" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Category" 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
