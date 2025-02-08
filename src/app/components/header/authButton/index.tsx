"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
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

  const createNewBlog = () => router.push("/blog/create");
  const logout = () => {
    localStorage.removeItem("token"); // Clear authentication token
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="tw-min-h-screen tw-bg-gray-100">
      {/* Header */}
      <header className="tw-bg-white tw-shadow-md tw-p-4 tw-fixed tw-top-0 tw-left-0 tw-w-full tw-z-10">
        <div className="tw-max-w-4xl tw-mx-auto tw-flex tw-justify-between tw-items-center">
          <h1 className="tw-text-xl tw-font-bold tw-text-gray-800">
            My Blog
          </h1>
        </div>
      </header>

   
    </div>
  );
}
