import { Navigate } from "react-router-dom";
import { getUser } from "../../utils/auth";

const RequireRole = ({ roles, children }) => {
  const user = getUser();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default RequireRole;
