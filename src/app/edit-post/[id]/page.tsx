"use client";

import { useParams, useRouter } from "next/navigation"; // To get dynamic params
import { useQuery } from "@apollo/client";
import CreatePost from "@/app/create-post/page";
import { GET_POST_BY_ID } from "@/app/api/graphql/mutation";
import { useEffect, useState } from "react";

const EditPost = () => {
  const params = useParams(); // Use `useParams` to get the dynamic `id` from the route
  const [postId, setPostId] = useState<number | null>(null); // State to hold parsed `id`
  const router = useRouter();

 // When `params.id` changes, set the postId
 const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
    skip: postId === null, // Skip the query if postId is null
  });
  useEffect(() => {
    if (params?.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      setPostId(parseInt(id as string)); // Set the ID
    }
  }, [params?.id]);

  return (
    <>
      {postId === null ? (
        <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-text-center tw-text-lg tw-font-semibold">
          Loading...
        </div>
      ) : loading ? (
        <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-text-center tw-text-lg tw-font-semibold">
          Loading...
        </div>
      ) : error ? (
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen tw-text-center">
          <p className="tw-text-lg tw-font-semibold tw-text-red-500">Error: {error.message}</p>
          <button
            onClick={() => router.push('/')}
            className="tw-mt-4 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-font-semibold tw-px-6 tw-py-2 tw-rounded-lg tw-transition-all"
          >
            View Posts
          </button>
        </div>
      ) : (
        <CreatePost button="edit" postData={data?.getPostById} />
      )}
    </>
  );
  
};

export default EditPost;
