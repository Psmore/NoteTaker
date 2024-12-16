import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import userStore from "../store/userStore";
import bookImg from "../assets/Books.jpg";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Errorfallback from "./components/Errorfallback.jsx";

const NoteList = lazy(() => import("./components/NoteList"));
const SuspenseFallback = lazy(() => import("./components/SuspenseFallback.jsx"));



export default function Home() {
  const user = userStore((state) => state.user);
  return (
    <>
      <title>{user ? "Welcome" : "Home"}</title>
      <meta name="Home" content="Home page" />
      <ErrorBoundary fallback={<Errorfallback />}>
        <Suspense fallback={<SuspenseFallback />}>
          <div>
            {user ? (
              <>
                <NoteList user={user} />
              </>
            ) : (
              <HomeBody />
            )}
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function HomeBody() {
  return (
    <>
      <section className="bg-blue-50 py-16 px-6 sm:px-12 lg:px-24">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between">
          <div className="text-center lg:text-left max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-700">
              Simplify Your <span className="text-blue-500">Note-Taking</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Effortlessly organize, edit, and access your notes anytime,
              anywhere. Experience productivity like never before!
            </p>
            <div className="mt-6 flex justify-center lg:justify-start gap-4">
              <Link
                to={"/signup"}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:w-1/2 mt-12 lg:mt-0">
            <img
              src={bookImg}
              alt="Note-taking illustration"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
}

