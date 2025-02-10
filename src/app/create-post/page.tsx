'use client';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_POST, UPDATE_POST } from '@/app/api/graphql/mutation';

type PostData = {
  id: number,
  title: string,
  content: string,
  category: string
}
type CreateBlogProps ={
  button: "create" | "edit"; // Allow both create and edit values
  postData: PostData;
}

const CreatePost = ({ button, postData }: CreateBlogProps) => {
  const [title, setTitle] = useState(postData?.title || '');
  const [content, setContent] = useState(postData?.content || '');
  const [category, setCategory] = useState(postData?.category || '');
  const [showAlert, setShowAlert] = useState(false); // State for showing the alert
  const [alertMessage, setAlertMessage] = useState(''); // Store the message for the alert
  const [alertType, setAlertType] = useState<'success' | 'error'>('success'); // Alert type (success or error)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [createPost, { loading, error }] = useMutation(CREATE_POST);
  const [updatePost] = useMutation(UPDATE_POST);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) return alert('All fields are required!');
    if (button === undefined || button !== 'edit') {
      button = 'create'
    }
    try {
      if (button === 'create') {
        await createPost({ variables: { title, content, category } });
        setAlertMessage('Post created successfully!');
        setAlertType('success');
      } else if (button === 'edit' && postData?.id) {
        await updatePost({ variables: { id: postData.id, title, content, category } });
        setAlertMessage('Post updated successfully!');
        setAlertType('success');
      }
      // Reset form on success
      setTitle('');
      setContent('');
      setCategory('');
    } catch (err) {
      console.log(err)
      setAlertMessage('An error occurred while submitting the post.');
      setAlertType('error');
    } finally {
      setShowAlert(true); // Show the alert after submission
    }
  };

  const onViewPost = () => {
    router.push('/');
  };

  const closeAlert = () => {
    setShowAlert(false); // Hide the alert
  };
  useEffect(() => {
    const authToken = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!authToken) {
      router.replace('/login'); // Redirect to login if no token
    } else {
      setIsAuthenticated(true); // Allow rendering
    }
  }, [router]);
  if (!isAuthenticated) return null; // Prevent rendering if not authenticated


  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen tw-bg-gray-100 tw-p-4">
      <div className="tw-w-full tw-max-w-3xl tw-bg-white tw-shadow-lg tw-rounded-2xl tw-p-6 md:tw-p-8 lg:tw-p-10">
        <h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold tw-text-center tw-mb-6">
          {button === 'edit' ? 'Edit Blog Post' : 'Create a Blog Post'}
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
            {loading ? (button === 'edit' ? 'Updating...' : 'Creating...') : (button === 'edit' ? 'Edit Post' : 'Create Post')}
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

      {/* Alert Popup */}
      {showAlert && (
        <div className="tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-bg-black/50 tw-transition-opacity">
          <div className={`tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-xl tw-w-11/12 sm:tw-w-1/3 md:tw-w-1/4 lg:tw-w-1/5 tw-transition-transform tw-transform tw-scale-95 ${alertType === 'success' ? 'tw-border-green-500' : 'tw-border-red-500'}`}>
            <h3 className="tw-text-lg tw-font-semibold tw-text-center tw-mb-4">
              {alertMessage}
            </h3>
            <div className="tw-flex tw-justify-center tw-mt-4">
              <button
                onClick={closeAlert}
                className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-hover:bg-blue-700 tw-w-full sm:tw-w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
