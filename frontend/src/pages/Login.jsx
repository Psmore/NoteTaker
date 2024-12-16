import userStore from "../store/userStore";
import { shallow } from "zustand/shallow";
import { Suspense, lazy } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Errorfallback from "./components/Errorfallback.jsx";

const SuspenseFallback = lazy(() => import("./components/SuspenseFallback.jsx"));

export default function Login() {
  const saveUser = userStore((state) => state.saveUser, shallow);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "/api/v1/auth/login",
        {
          ...data,
        },
        { withCredentials: true }
      );
      saveUser(response.data.data);
      return response.data;
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.log(error.message);
      return error;
    },
  });

  const onSubmit = function (data) {
    mutation.mutate(data);
  };

  return (
    <>
      <title>Login</title>
      <meta name="login" content="login page" />
      <ErrorBoundary fallback={<Errorfallback />}>
        <Suspense fallback={<SuspenseFallback />}>
          <section className=" max-w-full flex flex-col items-center my-10">
            <div className="flex items-center flex-col max-w-min border py-4 px-2 rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold font-serif">Log In</h2>
              <form
                className="flex flex-col mx-10 my-4 p-4 text-lg min-w-96 rounded-lg "
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  className="px-4 py-2 border-4 my-3 rounded-lg"
                  type="email"
                  {...register("email", { required: { value: true, message: "Email is required !"}})}
                  placeholder="Enter your Email..."
                />
                {
                    errors?.email && (<p className="text-red-500">{errors?.email?.message}</p>)
                }
                <input
                  className="px-4 py-2 border-4 my-3 rounded-lg"
                  type="password"
                  {...register("password", { required: { value: true, message: "Password is required !"}})}
                  placeholder="Enter your password..."
                />
                {
                    errors?.password && (<p className="text-red-500"> { errors?.password?.message }</p>)
                }

                <button
                  className="bg-blue-600 py-2 px-4 rounded-xl max-w-full my-3 font-semibold text-2xl 
                         btnTransition hover:bg-blue-400 font-serif hover:shadow hover:shoadow-lg hover:shadow-blue-800 text-white hover:text-black"
                  type="submit"
                >
                  {mutation.isPending ? "Loading ...." : "Login"}
                </button>
                <p className="flex gap-2">
                  Don&apos;t have Account ?{" "}
                  <Link
                    className="text-blue-600 hover:underline"
                    to={"/signup"}
                  >
                    Signup here....
                  </Link>
                </p>
                <p>
                  {mutation?.isError ? (
                    <span className="text-red-500 font-semibold text-lg">
                      {mutation.error.message}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </form>
            </div>
          </section>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
