import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl mt-4">Oops! Page not found</p>
        <p className="mt-2 text-gray-500">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
