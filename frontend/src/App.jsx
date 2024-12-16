import { Routes, Route } from "react-router-dom"
import EditNote from "./pages/EditNote"
import NewNote from "./pages/NewNote"
import ViewNote from "./pages/ViewNote"
import Home from "./pages/Home"
import Header from "./pages/components/Header"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import ErrorBoundary from "./pages/components/ErrorBoundary"
import Errorfallback from "./pages/components/Errorfallback"
import { Suspense } from "react"
import SuspenseFallback from "./pages/components/SuspenseFallback"
import PrivateRoute from "./pages/components/PrivateRoute"
import Footer from "./pages/components/Footer"
import PageNotFound from "./pages/PageNotFound"
export default function App() {
  return (
    <>
    <ErrorBoundary fallback={<Errorfallback />}>
        <Suspense fallback={<SuspenseFallback />}>
          <Header />
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
                <Route path="/new" element={<NewNote />} />
                <Route path="/edit/:id" element={<EditNote />} />
                <Route path="/view/:id" element={<ViewNote />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Suspense>
    </ErrorBoundary>
    </>
  )
}




