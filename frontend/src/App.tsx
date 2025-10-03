import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import PrivateRoutes from "./utils/Protected"
import Signin from "./pages/Signin"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin></Signin>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route element={ <PrivateRoutes></PrivateRoutes> }>
            <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>  
  )
}

export default App
