import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <>
      <section className="flex flex-col items-center mt-20">
        <h1 className="text-9xl font-semibold">
          4<span className="text-blue-500">0</span>4
        </h1>
        <div className="text-2xl font-semibold">
          Opps<span className="text-blue-600">....</span> page not found.
        </div>
        <p>
          Go back to{" "}
          <Link className="text-blue-500 underline" to={"/"}>
            Homepage
          </Link>
        </p>
      </section>
    </>
  );
}
