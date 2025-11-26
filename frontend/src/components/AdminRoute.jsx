// frontend/src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { getUser } from "../services/session";

export default function AdminRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
