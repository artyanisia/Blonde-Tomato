import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRole && user && user.role !== allowedRole) {
    const targetPath =
      user.role === "professor" ? "/professor/dashboard" : "/student/dashboard";

    if (window.location.pathname !== targetPath) {
      return <Navigate to={targetPath} />;
    }
  }

  return children;
};

export default ProtectedRoute;
