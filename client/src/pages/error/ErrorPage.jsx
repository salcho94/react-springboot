import React from "react";

const ErrorPage = ({ errorMessage = "Something went wrong." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
            <p className="text-lg mb-6">{errorMessage}</p>
            <button
                className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                onClick={() => window.location.reload()}
            >
                Reload Page
            </button>
        </div>
    );
};

export default ErrorPage;
