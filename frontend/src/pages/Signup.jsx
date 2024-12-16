import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { lazy, Suspense } from "react";
import userStore from "../store/userStore.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Errorfallback from "./components/Errorfallback.jsx";

const SuspenseFallback = lazy(() => import("./components/SuspenseFallback.jsx"));

export default function Signup() {
  const navigate = useNavigate();
  const saveUser = userStore((state) => state.saveUser);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "/api/v1/auth/register",
        {
          ...data,
        },
        { withCredentials: true }
      );
      saveUser(response.data.data);
      return response.data.data;
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error(error.message);
      return error;
    },
  });

  const onSubmit = function (data) {
    mutation.mutate(data);
  };

  return (
    <ErrorBoundary fallback={<Errorfallback />}>
      <Suspense fallback={<SuspenseFallback />}>
        <section className=" max-w-full flex flex-col items-center my-10">
          <div className="flex items-center flex-col max-w-min border py-4 px-2 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold font-serif">Sign Up</h2>
            <form
              className="flex flex-col mx-10 my-4 p-4 text-lg min-w-96 rounded-lg "
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className="px-4 py-2 border-4 my-3 rounded-lg"
                type="text"
                {...register("username", {
                  required: { value: true, message: "Username is required !" },
                })}
                placeholder="Enter Username..."
              />
              {errors?.username && (
                <p className="text-red-500">{errors?.username?.message}</p>
              )}
              <input
                className="px-4 py-2 border-4 my-3 rounded-lg"
                type="email"
                {...register("email", {
                  required: { value: true, message: "Email is required !" },
                })}
                placeholder="Enter Email"
              />
              {errors?.email && (
                <p className="text-red-500">{errors?.email?.message}</p>
              )}

              <input
                className="px-4 py-2 border-4 my-3 rounded-lg"
                type="password"
                {...register("password", {
                  required: { value: true, message: "Password is required ! " },
                })}
                placeholder="Enter password"
              />
              {errors?.password && (
                <p className="text-red-500">{errors?.password?.message}</p>
              )}
              <button
                className="bg-blue-600 py-2 px-4 rounded-xl max-w-full my-3 font-semibold text-2xl 
                         btnTransition hover:bg-blue-400 font-serif hover:shadow hover:shoadow-lg hover:shadow-blue-800 text-white hover:text-black"
                type="submit"
              >
                {mutation.isPending ? "Loading ...." : "Sign Up"}
              </button>
              <p className="flex gap-2">
                Already have Account ?{" "}
                <Link className="text-blue-600 hover:underline" to={"/login"}>
                  Login here....
                </Link>
              </p>
              <p>
                {mutation.isError && <span>{mutation?.error?.message}</span>}
              </p>
            </form>
          </div>
        </section>
      </Suspense>
    </ErrorBoundary>
  );
}
