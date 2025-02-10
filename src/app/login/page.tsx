"use client";

import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/app/api/graphql/mutation";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const { data: loginData } = await login({
        variables: { email: data.username, password: data.password },
      });

      if (loginData?.login?.token) {
        localStorage.setItem("token", loginData.login.token);
        if (mounted) {
          router.push("/");
        }
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-bg-gray-100">
      <div className="tw-w-full tw-max-w-md tw-bg-white tw-shadow-lg tw-rounded-lg tw-p-8">
        <h2 className="tw-text-2xl tw-font-bold tw-text-center tw-text-gray-700 tw-mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit(formSubmit)} className="tw-space-y-4">
          {/* Username Field */}
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">
              Username
            </label>
            <input
              className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              {...register("username", { required: "Username is required" })}
            />
            <p className="tw-text-red-500 tw-text-sm tw-min-h-[20px] tw-text-center">
              {errors.username && (
                <span className="tw-text-red-500 tw-text-sm tw-mt-2 block">
                  This field is required
                </span>
              )}
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">
              Password
            </label>
            <input
              type="password"
              className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />
            <p className="tw-text-red-500 tw-text-sm tw-min-h-[20px] tw-text-center">
              {errors.password && (
                <span className="tw-text-red-500 tw-text-sm tw-mt-2 block">
                  Password required
                </span>
              )}
            </p>
          </div>

          {/* Error Message */}
          <p className="tw-text-red-500 tw-text-sm tw-min-h-[20px] tw-text-center">
            {error && (
              <span>{error.message || "Login failed. Please try again."}</span>
            )}
          </p>

          {/* Login Button */}
          <button
            type="submit"
            className="tw-w-full tw-bg-blue-600 tw-text-white tw-font-medium tw-py-2 tw-rounded-md hover:tw-bg-blue-700 tw-transition tw-duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="tw-text-center tw-text-sm tw-text-gray-500 tw-mt-4">
          {"Don't have an account?"}
          <Link href="/signup" className="tw-text-blue-500 hover:tw-underline">
            Sign up here
          </Link>
        </p>

      </div>
    </div>

  );
};

export default LoginForm;
