import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import userStore from "../../store/userStore";
import { shallow } from "zustand/shallow";
import { Suspense, useState, lazy } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary.jsx";
import Errorfallback from "./Errorfallback.jsx";

const SuspenseFallback = lazy(() => import("../components/SuspenseFallback.jsx"));

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const user = userStore((state) => state.user, shallow);
  const deleteUser = userStore((state) => state.deleteUser);
  const navigate = useNavigate();

  const profileToggle = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const logOutUser = (e) => {
    e.preventDefault();
    deleteUser();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get("/api/v1/auth/deleteUser");
      return response;
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.log("Error while deleting the user", error.message);
      return error;
    },
  });

  const deleteUserReq = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
  //console.log("Header user state:", user);

  return (
    <ErrorBoundary fallback={<Errorfallback />}>
      <Suspense fallback={<SuspenseFallback />}>
        <header className="flex items-center justify-between px-3 py-3 sticky border-b-2 shadow-sm">
          <Link to="/">
            <h1 className="text-3xl font-semibold font-serif">
              Note<span className="text-blue-600">Taker</span>
            </h1>
          </Link>
          <div>
            {user ? (
              <button
                onClick={(e) => profileToggle(e)}
                className="transition ease-in-out delay-100 hover:scale-110 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
            ) : (
              <>
                <SLbutton />
              </>
            )}
          </div>

          {isOpen && user && (
            <div className="flex justify-end gap-3 flex-col bg-gray-100 absolute z-50 right-4 top-11 px-4 pt-1 pb-2 rounded-md border border-gray-500">
              <div className="font-serif text-2xl font-semibold  ">
                {user?.username || "Guest"}
              </div>
              <button
                className="bg-blue-500 text-lg font-serif font-semibold text-white transition ease-in-out delay-100 hover:scale-105
                                 hover:text-black hover:bg-white hover:border-2 hover:border-black px-5 py-2 rounded-lg"
                onClick={(e) => logOutUser(e)}
              >
                Logout
              </button>
              <button
                onClick={(e) => deleteUserReq(e)}
                className="bg-white text-lg font-serif font-semibold text-red-500 transition ease-in-out delay-100 hover:scale-105
                                 hover:text-white hover:bg-red-500 border-2 border-red-500 px-5 py-2 rounded-lg mb-3"
              >
                Delete Account
              </button>
              {mutation?.error && (
                <>
                  <div>{mutation?.error?.message}</div>
                </>
              )}
            </div>
          )}
        </header>
      </Suspense>
    </ErrorBoundary>
  );
}

function SLbutton() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/login" ? (
        <NavLink
          className={
            "SLbtn bg-white  border-black hover:bg-blue-700 hover:text-white"
          }
          to="/signup"
        >
          Signup
        </NavLink>
      ) : (
        <NavLink
          className={
            "SLbtn bg-blue-700 hover:border-black hover:text-black hover:bg-white text-white "
          }
          to={"/login"}
        >
          Login
        </NavLink>
      )}
    </>
  );
}

