'use client';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_POST } from '@/app/api/graphql/mutation';

const BlogPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [createPost, { loading, error }] = useMutation(CREATE_POST);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) return alert('All fields are required!');

    try {
      await createPost({ variables: { title:title, content:content, category:category } });
      setTitle('');
      setContent('');
      setCategory('');
      alert('Post created successfully!');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };



  const onViewPost = () => {
    router.push('/blog/allblogs');
  };

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen tw-bg-gray-100 tw-p-4">
      <div className="tw-w-full tw-max-w-3xl tw-bg-white tw-shadow-lg tw-rounded-2xl tw-p-6 md:tw-p-8 lg:tw-p-10">
        <h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold tw-text-center tw-mb-6">
          Create a Blog Post
        </h2>

        {error && <p className="tw-text-red-500 tw-text-center">{error.message}</p>}

        <form onSubmit={handleSubmit} className="tw-space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-text-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-text-lg tw-h-40 tw-resize-none focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-text-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-font-semibold tw-text-lg tw-py-3 tw-rounded-lg tw-transition-all disabled:tw-bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>

        <button
          onClick={onViewPost}
          disabled={loading}
          className="tw-w-full tw-bg-gray-800 hover:tw-bg-gray-900 tw-text-white tw-font-semibold tw-text-lg tw-py-3 tw-rounded-lg tw-transition-all tw-mt-4 disabled:tw-bg-gray-500"
        >
          View Posts
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
