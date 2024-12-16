import { Link } from "react-router-dom";

export default function Errorfallback() {
  return (
    <h2>
      Some thing went wrong....{" "}
      <Link className="text-blue-600 underline decoration-blue-500" to={"/"}>
        return to home.
      </Link>
    </h2>
  );
}
