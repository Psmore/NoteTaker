import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./ErrorBoundary.jsx";
import Errorfallback from "./Errorfallback.jsx";

const SuspenseFallback = lazy(() => import("../components/SuspenseFallback.jsx"));

export default function NoteList() {
  const navigate = useNavigate();
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get("/api/v1/note/listAll", {
        withCredentials: true,
      });
      return data;
    },
  });

  const viewNote = (note) => {
    navigate(`/view/${note._id}`, { state: { Note: note } });
  };

  return (
    <>
      <ErrorBoundary fallback={<Errorfallback />}>
        <Suspense fallback={<SuspenseFallback />}>
          <div className="py-8 px-4">
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded-md border border-black font-semibold btnTransition hover:text-white hover:bg-black"
                onClick={() => refetch()}
              >
                {isLoading ? (
                  "Loading...."
                ) : (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 inline mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>{" "}
                    <span>Reload Notes</span>
                  </div>
                )}
              </button>
              <Link
                className="bg-blue-500 px-6 py-2 text-xl rounded-md border hover:border-blue-500 text-white font-semibold font-serif btnTransition hover:bg-white hover:text-blue-500"
                to={"/new"}
              >
                Create Note
              </Link>
            </div>
            <div className="flex justify-start gap-4 mx-1 my-1 py-5 cursor-pointer ">
              {data?.length > 0 &&
                data?.map((note) => (
                  <div
                    className="noteCard"
                    onClick={() => viewNote(note)}
                    key={note?._id}
                  >
                    <h2 className="font-bold uppercase text-xl">
                      {note?.heading}
                    </h2>
                    <p className="flex gap-2">
                      {note?.tags?.map((tag, index) => (
                        <span
                          className="bg-blue-500 px-2 py-1 border border-black text-xl font-serif text-md font-semibold rounded-md"
                          key={index}
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
            </div>
            <p>{error && <>{error.message}</>}</p>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

