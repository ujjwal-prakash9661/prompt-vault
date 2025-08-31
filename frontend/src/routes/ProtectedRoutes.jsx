import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoutes = ({ children }) => {
  const { user, authLoading } = useContext(AuthContext);

  // While auth state is hydrating from localStorage, don't redirect
  if (authLoading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes