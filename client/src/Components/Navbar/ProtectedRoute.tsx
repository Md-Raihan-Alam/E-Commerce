import React from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext, GlobalContextTypes } from "../../context";
interface ProtectedRouteProps {
  element: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { user } = context;
  if (!user) {
    return <Navigate to="/Login" />;
  }
  return <>{element}</>;
};
export default ProtectedRoute;
