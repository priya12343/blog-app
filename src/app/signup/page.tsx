"use client";

import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/app/api/graphql/mutation";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);
    const [mounted, setMounted] = useState(false);
  const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const formSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const { data: signUpData } = await signup({
                variables: {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                },
            });

            if (signUpData) {
                router.push('/login');
            } else {
            }
        } catch (e) {
        }
    };

    return (
        <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-bg-gray-100">
            <div className="tw-w-full tw-max-w-md tw-bg-white tw-shadow-lg tw-rounded-lg tw-p-6">
                <h2 className="tw-text-2xl tw-font-bold tw-text-center tw-text-gray-700">
                    Sign Up
                </h2>


                <form onSubmit={handleSubmit(formSubmit)} className="tw-mt-4 tw-space-y-3">
                    {/* Username Field */}
                    <div>
                        <label className="tw-text-sm tw-text-gray-700 tw-font-medium tw-mb-1 tw-block">
                            Username
                        </label>
                        <input
                            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                            {...register("username", { required: "Username is required" })}
                        />
                        <p className="tw-text-red-500 tw-text-sm tw-min-h-[20px] tw-text-center">
                            {errors.username && <span>
                                Username required
                            </span>}
                        </p>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="tw-text-sm tw-text-gray-700 tw-font-medium tw-mb-1 tw-block">
                            Email
                        </label>
                        <input
                            type="email"
                            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        <p className="tw-text-red-500 tw-text-sm tw-min-h-[20px] tw-text-center">
                            {errors.email && <span>
                                Email required
                            </span>}
                        </p>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="tw-text-sm tw-text-gray-700 tw-font-medium tw-mb-1 tw-block">
                            Password
                        </label>
                        <input
                            type="password"
                            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                            {...register("password", { required: "Password is required" })}
                        />
                        <p className="tw-text-red-500 tw-text-sm tw-min-h-[20px] tw-text-center">
                            {errors.password && <span>
                                Password required
                            </span>}
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="tw-text-sm tw-text-gray-700 tw-font-medium tw-mb-1 tw-block">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) =>
                                    value === watch("password") || "Passwords do not match",
                            })}
                        />
                        <p className="tw-text-red-500 tw-text-sm tw-min-h-[20px] tw-text-center">
                            {errors.confirmPassword && <span>
                                Confirm Password required
                            </span>}
                        </p>
                    </div>

                    {/* Global Error Message */}
                    <p className="tw-text-red-500 tw-text-xs tw-text-center tw-mb-2">
                        {error?.message || ""}
                    </p>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="tw-w-full tw-bg-blue-600 tw-text-white tw-font-medium tw-py-2 tw-rounded-md hover:tw-bg-blue-700 tw-transition tw-duration-300"
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>


                {/* Already have an account? */}
                <p className="tw-text-center tw-text-sm tw-text-gray-500 tw-mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="tw-text-blue-500 hover:tw-underline">
                        Log in here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUpForm;
