import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import userStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Errorfallback from "./components/Errorfallback.jsx";

const SuspenseFallback = lazy(() => import("./components/SuspenseFallback.jsx"));

export default function NewNote() {
  const navigate = useNavigate();

  const user = userStore((state) => state.user);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      heading: "",
      noteData: "",
      tags: [],
      owner: user?._id,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "/api/v1/note/create",
        {
          ...data,
          tags: data.tags.map((tag) => tag.value), 
        },
        { withCredentials: true }
      );
      navigate(`/view/${response.data.data._id}`, {
        state: { Note: response.data.data },
      });
      return response.data;
    },
    onSuccess: () => {
      console.log("note created Successfully");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <ErrorBoundary fallback={<Errorfallback />}>
        <Suspense fallback={<SuspenseFallback />}>
          <section className="flex flex-col py-8 px-2 max-w-full items-center">
            <div className="flex items-center flex-col w-3/4 border py-4 px-2 rounded-lg shadow-lg">
              <form
                className="flex flex-col mx-1 w-4/5 my-4 p-4 text-lg rounded-lg gap-6 "
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <h2 className="text-3xl font-bold font-serif">
                    Create a <span className="text-blue-600"> Note</span>
                  </h2>

                  <button
                    className="btnTransition text-2xl font-semibold font-serif rounded-xl border sm:min-w-max 
                                    px-8 py-1.5 bg-blue-500 text-center hover:text-white"
                    type="submit"
                  >
                    {mutation.isPending ? "Loading..." : "+ new post"}
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold font-serif">
                      Heading
                </h2>
                <input
                  className="text-xl border py-2 px-4 sm:min-w-max rounded-lg"
                  type="text"
                  placeholder="Enter Note Heading"
                  {...register("heading", {
                    required: { value: true, message: "Heading is required !" },
                  })}
                />
                {errors?.heading && (
                  <p className="text-red-500">{errors?.heading?.message}</p>
                )}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-semibold font-serif">Tags: </h2>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <CreatableSelect
                      {...field}
                      isMulti
                      placeholder="Add tags..."
                      onChange={(selected) => field.onChange(selected)}
                      value={field.value} 
                    />
                  )}
                />
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-semibold font-serif">Enter Note</h2>
                <textarea
                  rows={20}
                  className="border shadow-inner shoadow-lg px-4 py-2"
                  placeholder="Start writting your notes here..."
                  {...register("noteData", {
                    required: {
                      value: true,
                      message: "Note Cannot be empty..",
                    },
                  })}
                ></textarea>
                </div>
                {errors?.noteData && (
                  <p className="text-red-500">{errors?.noteData?.message}</p>
                )}
              </form>
            </div>
          </section>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
