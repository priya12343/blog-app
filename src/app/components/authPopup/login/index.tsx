import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import styles from "../../../../../public/styles/login.module.css";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/app/api/graphql/mutation";
import { useRouter } from "next/navigation";
// import { LOGIN_MUTATION } from "../";
// import { useRouter } from "next/router";

interface LoginFormProps {
  modalType: "login" | "signUp";
  closeModal: () => void;
}
const LoginForm = ({ modalType, closeModal }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // Track if the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);
 
  const formSubmit : SubmitHandler<FieldValues> = async (data) => {
    // closeModal();
    console.log("data getting loaded----",data)

    try {
      console.log("data====",login)

      const { data: loginData } = await login({
        variables: { email: data.username, password: data.password },

      });
      console.log("loginDataloginData",loginData)

      // Store JWT token in localStorage
      localStorage.setItem("token", loginData.login);

      // Close modal and navigate to home page after login
      if (mounted) {
        router.push("/blog/allblogs");
      }
      closeModal();
    } catch (e) {
      console.error("Login failed", e);
    }
  };
  
  return (
    <div className="popup">
        <div className="tw-justify-items-center tw-align-middle tw-w-full tw-h-1/5">
          <h2 className={styles.heading}>Login</h2>
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
            <button type="submit" className={styles.submitButton}>  {loading ? "Logging in..." : modalType === "login" ? "Login" : "Sign Up"}</button>
          </div>
        </form>
    </div>
  );
};

export default LoginForm;


