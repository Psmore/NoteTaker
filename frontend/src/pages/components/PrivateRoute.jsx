import { Outlet, Navigate } from "react-router-dom";
import userStore from "../../store/userStore";

export default function PrivateRoute() {
  const user = userStore((state) => state?.user);
  return user ? <Outlet /> : <Navigate to={"/signup"} />;
}
