import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import PrivateRoutes from "./utils/Protected"
import Signin from "./pages/Signin"
import NoteEditor from "./components/NoteEditor"
// import { DotPattern } from "./components/ui/dot-pattern"
import { AnimatedGridPattern } from "./components/ui/animated-grid-pattern"

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Background dots */}
      <AnimatedGridPattern className="absolute inset-0 -z-10" />

      {/* Pages content */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/note-editor" element={<NoteEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App
