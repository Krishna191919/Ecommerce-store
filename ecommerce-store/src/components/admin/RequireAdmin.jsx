import { Navigate } from "react-router-dom";
import { getUser } from "../../utils/auth";

const RequireAdmin = ({ children }) => {
  const user = getUser();

  if (!user || user.role !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default RequireAdmin;
