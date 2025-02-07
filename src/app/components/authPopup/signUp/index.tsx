import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import styles from "../../../../../public/styles/login.module.css";
import { useMutation } from "@apollo/client";
import {  SIGNUP_MUTATION } from "@/app/api/graphql/mutation";
// import { LOGIN_MUTATION } from "../";
// import { useRouter } from "next/router";

interface SignUpFormProps {
  modalType: "login" | "signUp";
  closeModal: () => void;
}
const SignUpForm = ({ modalType, closeModal }: SignUpFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);
  // const router = useRouter();
  const [mounted, setMounted] = useState(false); // Track if the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const formSubmit : SubmitHandler<FieldValues> = async (data) => {
    // closeModal();
    console.log("data getting loaded----",data)

    try {
      console.log("data====",signup)

      const { data: signUpData } = await signup({
        variables: {
          username: data.username,  // Ensure this is being passed correctly
          email: data.email,        // Ensure this is being passed correctly
          password: data.password,  // Ensure this is being passed correctly
        },
      });
      if (signUpData) {
        const { token, user } = signUpData.signup;
        console.log("Token:", token);
        console.log("User:", user);
  
        // Store JWT token in localStorage
        localStorage.setItem("token", token);
  
        // Close modal and navigate to home page after login
        if (mounted) {
          // router.push("/home");
        }
        closeModal();
      } else {
        console.error("No signup data returned");
      }
      console.log("signupsignup",signUpData)
    } catch (e) {
      console.error("Login failed", e);
    }
  };
  
  return (
    <div className="popup">
        <div className="tw-justify-items-center tw-align-middle tw-w-full tw-h-1/5">
          <h2 className={styles.heading}>SignUp</h2>
        </div>
        <form onSubmit={handleSubmit(formSubmit)} className={styles.formContainer}>
          <div  className="tw-w-3/4 tw-h-1/6 tw-flex-col tw-justify-items-center tw-align-middle">
            <label className="tw-justify-items-center tw-align-middle tw-w-full tw-h-1/5">Username:</label>
            <input
              className={styles.inputField}
              {...register("username", { required: true })}
            />
            {errors.username && <span className="error">This field is required</span>}
          </div>

          <div  className="tw-w-3/4 tw-h-1/6 tw-flex-col tw-justify-items-center tw-align-middle">
            <label className="tw-justify-items-center tw-align-middle tw-w-full tw-h-1/5">Email Id:</label>
            <input
              className={styles.inputField}
              {...register("email", { required: true })}
            />
            {errors.email && <span className="error">This field is required</span>}
          </div>
          <div className="tw-w-3/4 tw-h-1/4 tw-flex-col tw-justify-items-center tw-align-middle">
            <label className="tw-justify-items-center tw-align-middle tw-w-full tw-h-1/5">Password:</label>
            <input
              className={styles.inputField}
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <span className="error">This field is required</span>}
          </div>
          <div className="tw-w-3/4 tw-h-1/4 tw-flex-col tw-justify-items-center tw-align-middle">
            <label className="tw-justify-items-center tw-align-middle tw-w-full tw-h-1/5"> Confirm Password:</label>
            <input
              className={styles.inputField}
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <span className="error">This field is required</span>}
          </div>

          <div className="tw-w-3/4 tw-h-1/4 tw-flex-col tw-justify-items-center tw-align-middle">
            <button type="submit" className={styles.submitButton}>  {loading ? "Registring..." : modalType === "login" ? "Login" : "Sign Up"}</button>
          </div>
        </form>
    </div>
  );
};

export default SignUpForm;


