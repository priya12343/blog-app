"use client";

import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { GET_POSTS } from "@/app/api/graphql/mutation";
import { useRouter } from "next/navigation";

export default function BlogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { page: 1, limit: 5, search: "" },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    refetch({ page: 1, limit: 5, search: e.target.value });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch({ page: newPage, limit: 5, search });
  };

  const createNewBlog = () => {
    router.push("/blog/create");
  };

  if (loading)
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
        <p className="tw-text-lg tw-text-gray-700">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
        <p className="tw-text-lg tw-text-red-500">Error loading posts</p>
      </div>
    );

  return (
    <div className="tw-max-w-4xl tw-mx-auto tw-px-4 tw-py-6">
      {data?.getPosts?.data?.length > 0 ? (
        <>
          {/* Search Input */}
          <div className="tw-mb-6">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search posts..."
              className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
            />
          </div>

          {/* Blog Post List */}
          <ul className="tw-space-y-4">
            {data?.posts?.data?.map((post: any) => (
              <li
                key={post.id}
                className="tw-p-6 tw-bg-white tw-border tw-rounded-lg tw-shadow-md tw-transition-transform tw-transform hover:tw-scale-105"
              >
                <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800">
                  {post.title}
                </h2>
                <p className="tw-text-gray-600 tw-mt-2">{post.content}</p>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="tw-flex tw-justify-between tw-items-center tw-mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="tw-bg-gray-200 tw-text-gray-700 tw-font-medium tw-px-4 tw-py-2 tw-rounded-lg tw-transition-all tw-hover:bg-gray-300 disabled:tw-opacity-50"
            >
              Previous
            </button>
            <span className="tw-text-lg tw-font-medium">
              Page {data?.posts?.pagination?.currentPage}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= data?.posts?.pagination?.totalPages}
              className="tw-bg-gray-200 tw-text-gray-700 tw-font-medium tw-px-4 tw-py-2 tw-rounded-lg tw-transition-all tw-hover:bg-gray-300 disabled:tw-opacity-50"
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
  );
}
