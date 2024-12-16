import { useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Errorfallback from "./components/Errorfallback.jsx";

const SuspenseFallback = lazy(() => import("./components/SuspenseFallback.jsx"));


export default function ViewNote() {
  const location = useLocation();
  const navigate = useNavigate();
  const { Note } = location.state || {};
  const homeBtn = () => {
    navigate("/");
  };

  const editBtn = () => {
    navigate(`/edit/${Note._id}`, { state: { editNote: Note } });
  };
  return (
    <>
      <title>View note</title>
      <meta name="view note" content={Note?.heading} />
      <ErrorBoundary fallback={<Errorfallback />}>
        <Suspense fallback={<SuspenseFallback />}>
          <section
            key={Note._id}
            className="flex flex-col gap-3 m-3 border
                    border-black px-6 py-4 rounded-lg"
          >
            <div className="flex flex-col justify-between sm:flex-row ">
              <h2 className="text-2xl font-serif font-semibold ">
                Heading: <br />
                <strong className="text-3xl font-serif">{Note.heading} </strong>
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={editBtn}
                  className="bg-blue-600 noteNavBtn hover:bg-white hover:text-blue-500 "
                >
                  Edit
                </button>
                <button
                  onClick={homeBtn}
                  className="bg-gray-500 hover:bg-white noteNavBtn text-white hover:text-black"
                >
                  home
                </button>
              </div>
            </div>
            <div>
              {/* Display tags */}
              <strong className="text-2xl font-serif">Tags:</strong>{" "}
              {Note.tags && Note.tags.length > 0 ? (
                <ul className="tag-list flex gap-4 text-lg font-sans font-semibold">
                  {Note.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="tag text-white bg-blue-500 px-2 py-1 rounded-md"
                    >
                      {/* Handle different structures */}
                      {typeof tag === "string" ? tag : tag.label || tag.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>No tags available</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-2xl font-serif">
                Note&apos;s description :{" "}
              </h3>
              <p className="font-mono text-lg my-2">{Note.noteData}</p>
            </div>
          </section>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
