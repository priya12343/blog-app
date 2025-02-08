"use client"

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_POST, GET_POSTS } from "@/app/api/graphql/mutation";
import { useRouter } from "next/navigation";
import { HiPencil, HiTrash, HiEye } from 'react-icons/hi'; // Heroicons variant

import Header from "../header";

export default function BlogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [errorVal, setErrorVal] = useState<any>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<number | null>(null);

  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { page: 1, limit: 5, search: "" },
  });

  const [deletePost] = useMutation(DELETE_POST);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    refetch({ page: 1, limit: 5, search: e.target.value });
  };

  const posts: any = data?.getPosts?.data;
  const filteredUsers = search
    ? posts?.filter(
      (post: { title: string; content: string }) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
    )
    : posts;

  const sortedUsers = filteredUsers ? [...filteredUsers] : [];
  sortedUsers.sort((a, b) => a.content - b.content);
  sortedUsers.sort((a, b) => a.title - b.title);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch({ page: newPage, limit: 5, search });
  };

  const handleEdit = (postId: any) => {
    router.push(`/edit-post/${postId}`);
  };

  const handleDelete = async () => {
    if (!postIdToDelete) return;

    try {
      const { data } = await deletePost({ variables: { id: postIdToDelete } });

      if (data.deletePost) {
        refetch(); // Refresh the post list
      }
      setIsModalOpen(false); // Close modal after delete
    } catch (error) {
    }
  };

  const handleViewPost = (postId: any) => {
    router.push(`/posts/${postId}`);
  };

  const createNewBlog = () => {
    router.push("/create-post");
  };

  const onLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    setToken(getToken);
    refetch({ page: 1, limit: 5, search: "" });
    setErrorVal(error);
  });


  return (
    <>
      {loading && (
        <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
          <p className="tw-text-lg tw-text-gray-700">Loading...</p>
        </div>
      )}
  
      {error || !token ? (
        <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-flex-col">
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center ">
            <p className="tw-text-lg tw-text-red-500">{error?.message}</p>
          </div>
          {(error?.message === "No User Found" || !token) && (
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mb-56">
              <button
                onClick={onLogin}
                className="tw-mt-4 tw-bg-blue-600 tw-text-white tw-font-semibold tw-px-6 tw-py-3 tw-rounded-lg tw-transition-all hover:tw-bg-blue-700"
              >
                Login
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Header />
          <div className="tw-max-w-4xl tw-mx-auto tw-px-4 tw-py-6 tw-pt-[4rem]">
            {sortedUsers.length > 0 ? (
              <>
                <div className="tw-sticky tw-top-0 tw-mb-6 tw-mt-6 tw-flex tw-justify-center">
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search posts..."
                    className="tw-w-3/4 tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                  />
                </div>
  
                <div className="tw-max-h-[66vh] tw-overflow-y-auto tw-pb-0">
                  <ul className="tw-space-y-4">
                    {sortedUsers.map((post: any) => (
                      <li
                        key={post.id}
                        className="tw-p-4 tw-bg-white tw-border tw-rounded-lg tw-shadow-md tw-max-w-3xl tw-w-full tw-h-1/6 tw-mx-auto"
                      >
                        <div className="tw-flex tw-justify-between tw-items-center">
                          <div>
                            <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">{post.title}</h2>
                            <p className="tw-text-gray-600 tw-mt-2">
                              {post.content.length > 20 ? post.content.substring(0, 70) + '...' : post.content}
                            </p>
                          </div>
                          <div className="tw-space-x-4">
                            <button
                              onClick={() => handleEdit(post.id)}
                              className="tw-bg-blue-400 tw-text-white tw-p-2 tw-rounded-lg hover:tw-bg-blue-500"
                            >
                              <HiPencil className="tw-h-5 tw-w-5" />
                            </button>
  
                            <button
                              onClick={() => {
                                setPostIdToDelete(post.id);
                                setIsModalOpen(true); // Open the confirmation modal
                              }}
                              className="tw-bg-red-400 tw-text-white tw-p-2 tw-rounded-lg hover:tw-bg-red-500"
                            >
                              <HiTrash className="tw-h-5 tw-w-5" />
                            </button>
  
                            <button
                              onClick={() => handleViewPost(post.id)}
                              className="tw-bg-green-400 tw-text-white tw-p-2 tw-rounded-lg hover:tw-bg-green-500"
                            >
                              <HiEye className="tw-h-5 tw-w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
  
                <div className="tw-flex tw-justify-between tw-items-center tw-mt-4">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="tw-bg-gray-200 tw-text-gray-700 tw-font-medium tw-px-3 tw-py-1 tw-rounded-lg tw-transition-all tw-hover:bg-gray-300 disabled:tw-opacity-50"
                  >
                    Previous
                  </button>
                  <span className="tw-text-sm tw-font-medium">
                    {data?.getPosts?.pagination?.currentPage} / {data?.getPosts?.pagination?.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= data?.getPosts?.pagination?.totalPages}
                    className="tw-bg-gray-200 tw-text-gray-700 tw-font-medium tw-px-3 tw-py-1 tw-rounded-lg tw-transition-all tw-hover:bg-gray-300 disabled:tw-opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-96">
                <p className="tw-text-gray-600 tw-text-lg">No posts found.</p>
                <button
                  onClick={createNewBlog}
                  className="tw-mt-4 tw-bg-blue-600 tw-text-white tw-font-semibold tw-px-6 tw-py-3 tw-rounded-lg tw-transition-all hover:tw-bg-blue-700"
                >
                  Create New Blog
                </button>
              </div>
            )}
          </div>
  
          {/* Delete Confirmation Modal */}
          {isModalOpen && (
            <div className="tw-fixed tw-inset-0 tw-bg-gray-500 tw-bg-opacity-75 tw-flex tw-items-center tw-justify-center">
              <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96 tw-shadow-xl">
                <h3 className="tw-text-lg tw-font-semibold tw-text-gray-700">Are you sure you want to delete this post?</h3>
                <div className="tw-mt-4 tw-flex tw-justify-between">
                  <button
                    onClick={handleDelete}
                    className="tw-bg-red-500 tw-text-white tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-red-600"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)} // Close modal
                    className="tw-bg-gray-300 tw-text-gray-700 tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>  
            </div>
          )}
        </>
      )}
    </>
  );
  

}
