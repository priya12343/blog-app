"use client";

import { useState } from "react";
import LoginForm from "../../authPopup/login";
import SignUpForm from "../../authPopup/signUp";

const AuthButtons = ()=>{
    const [modalType, setModalType] = useState<"login" | "signUp" | null>(null);
    const handleAuthClick = (type: "login" | "signUp") => {
        setModalType(type);
    };
    const closeModal = () => {
        console.log("closeModal---------------")
        setModalType(null);
    };
   
    return(
        <section className="tw-flex tw-justify-around lg:tw-w-[15%]">
        <button onClick={() => handleAuthClick("login")} className="tw-border tw-px-8 tw-py-1">
            Login
        </button>
        <button onClick={() => handleAuthClick("signUp")} className="tw-border tw-px-8 tw-py-1">
            Sign Up
        </button>

        {/* Popup Modal */}
        {modalType==='login' && (
            <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-justify-center tw-items-center tw-h-full">
                <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-lg tw-relative tw-w-1/3 tw-h-1/2">
                    <button className="tw-absolute tw-top-2 tw-right-2 tw-text-xl" onClick={closeModal}>
                        &times;
                    </button>
                    <LoginForm modalType={modalType} closeModal={closeModal} />
                </div>
            </div>
        )}
        {modalType==='signUp' && (
            <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-justify-center tw-items-center tw-h-full">
                <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-lg tw-relative tw-w-1/3 tw-h-3/4">
                    <button className="tw-absolute tw-top-2 tw-right-2 tw-text-xl" onClick={closeModal}>    
                        &times;
                    </button>
                    <SignUpForm modalType={modalType} closeModal={closeModal} />
                </div>
            </div>
        )}
    </section>
    )
}

export default AuthButtons;