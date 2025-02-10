// export default Header;
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const router = useRouter();
  
  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu after a link is clicked

  const toggleLogoutPopup=()=>{
    setIsLogoutOpen(!isLogoutOpen);

  }
  // Handle logout popup toggle
  const onLogout = () => {
    setIsLogoutOpen(!isLogoutOpen);
  };
const onCreateBlog=()=>{
    router.push('/create-post')
}
  // Handle actual logout (you can implement your logic here)
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push("/login"); // Redirect to login page after logout
    setIsLogoutOpen(false); // Close the popup after logout
  };

  return (
    <header className="tw-bg-white tw-shadow-md tw-p-4 tw-fixed tw-top-0 tw-w-full tw-z-10">
      <div className="tw-container tw-mx-auto tw-flex tw-items-center tw-justify-between">
        {/* Blog Title - Centered */}
        <div className="tw-flex-1 tw-flex tw-justify-center">
          <h1 className="tw-text-xl tw-font-bold tw-text-gray-800">My Blog</h1>
        </div>

        {/* Mobile Menu Button */}
        <div className="tw-block lg:tw-hidden">
          <button
            onClick={toggleMenu}
            className="tw-flex tw-items-center tw-justify-center tw-p-2 tw-border tw-border-gray-300 tw-rounded-md tw-text-gray-800"
          >
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="tw-h-6 tw-w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`tw-transition-all tw-duration-300 tw-ease-in-out tw-bg-white tw-shadow-md tw-absolute tw-right-0 tw-top-13 tw-z-20 tw-w-1/2 sm:tw-w-1/3 lg:tw-hidden ${
          isMenuOpen ? "tw-block" : "tw-hidden"
        }`}
      >
        {/* Navigation Links */}
        <div className="tw-p-4 tw-w-full tw-flex tw-flex-col tw-items-center tw-space-y-4">
          <a
            className="tw-text-gray-800 hover:tw-text-blue-600 tw-block"
            onClick={onCreateBlog}
          >
            Create Blog
          </a>
          <a
            className="tw-text-gray-800 hover:tw-text-blue-600 tw-block"
            onClick={onLogout}
          >
            Logout
          </a>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {isLogoutOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-opacity-90 tw-z-50 tw-flex tw-items-center tw-justify-center">
          <div className="tw-bg-white tw-p-6 tw-rounded-md tw-shadow-lg tw-max-w-sm tw-w-full tw-sm:max-w-xs tw-lg:max-w-md">
            <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">Confirm Logout</h2>
            <p className="tw-text-gray-600 tw-mt-4">Are you sure you want to log out?</p>
            <div className="tw-flex tw-mt-6 tw-justify-between tw-space-x-4">
              {/* Cancel Button */}
              <button
                onClick={toggleLogoutPopup}
                className="tw-bg-gray-300 tw-text-gray-800 tw-font-semibold tw-px-4 tw-py-2 tw-rounded-md tw-hover:tw-bg-gray-400 tw-w-full sm:tw-w-auto"
              >
                Cancel
              </button>

              {/* Confirm Logout Button */}
              <button
                onClick={handleLogout}
                className="tw-bg-red-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-md tw-hover:tw-bg-red-700 tw-w-full sm:tw-w-auto"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;






