import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Errorfallback from "./components/Errorfallback.jsx";


const SuspenseFallback = lazy(() => import("./components/SuspenseFallback.jsx"));


export default function EditNote() {
  const location = useLocation();
  const navigate = useNavigate();
  const { editNote } = location.state || {
    editNote: { heading: "", tags: [], noteData: "" },
  };

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      heading: editNote?.heading || "",
      tags: editNote?.tags || [],
      noteData: editNote?.noteData || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.patch(
        "/api/v1/note/edit",
        {
          ...data,
          tags: data?.tags?.map((tag) =>
            typeof tag === "string" ? tag : tag?.value || tag?.label
          ),
          noteId: editNote?._id,
        }
      );
      navigate(`/view/${response?.data?.data?._id}`, {
        state: { Note: response?.data?.data },
      });
      return response?.data;
    },
    onError: (error) => {
      console.error("Error while editing:", error);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (data) => {
      const noteId = data._id;
      const response = await axios.delete("/api/v1/note/delete", {
        data: { noteId },
        withCredentials: true,
      });
      return response;
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error(error.message);
      return error;
    },
  });

  const deleteNote = (editNote, e) => {
    e.preventDefault();
    deleteNoteMutation.mutate(editNote);
  };

  const onSubmit = (data) => {
    const transformedData = {
      ...data,
      tags: data?.tags?.map((tag) => tag.value || tag), 
    };
    mutation.mutate(transformedData); 
  };

  return (
    <>
      <ErrorBoundary fallback={<Errorfallback />}>
        <Suspense fallback={<SuspenseFallback />}>
          <section className="my-5">
            <div className="flex justify-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col  gap-4 w-4/5 border border-black px-4 py-2 
                 rounded-md shadow-lg"
              >
                <div className="flex justify-between input">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold font-serif">
                      Heading
                    </h2>
                    <input
                      className=" text-lg border border-black px-2 py-1 rounded-lg"
                      type="text"
                      {...register("heading")}
                      placeholder="Edit Heading"
                    />
                  </div>

                  <div className="flex gap-4 items-center">
                    <button
                      type="submit"
                      className="btnTransition btn bg-blue-500 px-4 py-3 rounded-xl font-semibold
                       text-white hover:text-black hover:bg-white border hover:border-2 hover:border-black text-md"
                      disabled={mutation.isLoading}
                    >
                      {mutation.isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <Link
                      className="btnTransition px-4 py-3 bg-gray-400 rounded-xl text-white hover:text-black font-semibold
                     hover:bg-white border hover:border-2 hover:border-black"
                      to={".."}
                    >
                      Cancel
                    </Link>
                    <button
                      className="btnTransition bg-red-500 text-white hover:text-black font-semibold hvoer:text-black px-4
                     py-3 rounded-xl hover:bg-white border hover:border-2 hover:border-black"
                      onClick={(e) => deleteNote(editNote, e)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-semibold font-serif">Tags:</h2>
                  <Controller
                    name="tags"
                    control={control}
                    defaultValue={
                      editNote?.tags?.map((tag) =>
                        typeof tag === "string"
                          ? { value: tag, label: tag }
                          : {}
                      ) || []
                    }
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        isMulti
                        placeholder="Edit tags..."
                        onChange={(selected) => field?.onChange(selected)}
                        value={field.value?.map((tag) =>
                          typeof tag === "string"
                            ? { value: tag, label: tag }
                            : tag
                        )}
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => e.value}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <h2 className="text-2xl font-semibold font-serif">Note : </h2>
                  <textarea
                    rows={10}
                    {...register("noteData", { required: { value: true, message: "Note cann't be empty..."}})}
                    placeholder="Edit Note Content"
                    className="textarea p-2 shadow-inner border border-black"
                  ></textarea>
                  {
                    errors?.noteData && (
                      <p className="text-red-500">{errors?.noteData?.message}</p>
                    )
                  }
                </div>
                <p className="text-red-500 text-lg ">
                  {mutation?.isError || deleteNoteMutation?.isError ? (
                    <>
                      <span>{mutation?.error?.message}</span>
                      <span>{deleteNoteMutation?.error?.message}</span>
                    </>
                  ) : (
                    <></>
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

