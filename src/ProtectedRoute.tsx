import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { ValidateTokenAsync } from "@/Slice/Auth.Slice";
import { ThunkDispatch } from "@reduxjs/toolkit";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { token, isAuthenticated, isLoading, isLoggedOut } = useSelector(
    (state: RootState) => state.auth
  );
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateUserToken = async () => {
      if (token) {
        try {
          const result = await dispatch(ValidateTokenAsync(token));

          if (result.meta.requestStatus === "rejected") {
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Authentication Error",
            description: "Unable to validate your session. Please log in again.",
            variant: "destructive",
          });
        } finally {
          setIsValidating(false);
        }
      } else {
        setIsValidating(false);
      }
    };

    // if (!isLoggedOut) {
      validateUserToken();
    // } else {
    //   setIsValidating(false);
    //   dispatch(resetLogoutFlag()); // Reset the logout flag after handling redirection
    // }
  }, [token, dispatch, isLoggedOut]);

  // Show loading state while validating
  if (isValidating || isLoading) {
    return <div>Loading...</div>;
  }

  // If no token or not authenticated, redirect to login
  if (!token || !isAuthenticated) {
    if (!isLoggedOut) {
      toast({
        title: "Unauthorized",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
    return <Navigate to="/login" replace />;
  }

  // If token is valid, render children
  return <>{children}</>;
};

export default ProtectedRoute;
