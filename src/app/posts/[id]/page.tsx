"use client";

import { GET_POST_BY_ID } from "@/app/api/graphql/mutation";
import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react"; // Import Lucide icon

const ViewPostById = () => {
    const router = useRouter();
    const params = useParams();
    const [postId, setPostId] = useState<number | null>(null);
    const [showFullContent, setShowFullContent] = useState(false); // Toggle for content expansion

    const { data, loading, error } = useQuery(GET_POST_BY_ID, {
        variables: { id: postId },
        skip: postId === null,
    });
    const post = data?.getPostById;
    const isLongContent = post?.content?.length > 100;
    useEffect(() => {
        if (params?.id) {
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            setPostId(parseInt(id as string));
        }
    }, [params?.id]);

    return (
        <div className="tw-max-w-2xl tw-mx-auto tw-p-4 tw-min-h-screen">
            {loading ? (
                <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen tw-text-center">
                    <p className="tw-text-gray-500 tw-text-lg tw-font-semibold">Loading...</p>
                </div>
            ) : error ? (
                <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen tw-text-center">

                    <p className="tw-text-lg tw-font-semibold tw-text-red-500">{error.message}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="tw-mt-4 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-font-semibold tw-px-6 tw-py-2 tw-rounded-lg tw-transition-all"
                    >
                        View Posts
                    </button>
                </div>
            ) : post ? (
                <div className="tw-bg-white tw-shadow-lg tw-rounded-lg tw-p-6 tw-w-full">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="tw-flex tw-items-center tw-gap-2 tw-text-blue-500 hover:tw-underline tw-mb-4"
                    >
                        <ArrowLeft className="tw-w-5 tw-h-5" />
                    </button>

                    {/* Post Title */}
                    <div className="tw-mb-4 tw-flex tw-items-center">
                        <label className="tw-text-gray-600 tw-text-sm tw-font-semibold tw-mr-2">Title:</label>
                        <h1 className="tw-text-2xl tw-font-bold tw-mt-0">{post?.title}</h1>
                    </div>


                    {/* Category */}
                    <div className="tw-mb-4">
                        <label className="tw-text-gray-600 tw-text-sm tw-font-semibold">Category:</label>
                        <span className="tw-text-sm tw-bg-blue-100 tw-text-blue-600 tw-px-3 tw-py-1 tw-rounded tw-ml-2">
                            {post?.category}
                        </span>
                    </div>

                    {/* Content (Aligned to Top) */}
                    <div className="tw-mb-4">
                        <label className="tw-text-gray-600 tw-text-sm tw-font-semibold">Content:</label>
                        <p className="tw-mt-1 tw-text-gray-700">
                            {isLongContent && !showFullContent ? `${post.content.slice(0, 100)}...` : post.content}
                        </p>
                        {isLongContent && (
                            <button
                                onClick={() => setShowFullContent(!showFullContent)}
                                className="tw-text-blue-500 tw-text-sm tw-mt-2 hover:tw-underline"
                            >
                                {showFullContent ? "Show Less" : "Show More"}
                            </button>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );


};

export default ViewPostById;
