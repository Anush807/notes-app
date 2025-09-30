import './App.css'
import { SignupPage } from './pages/Signup'
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignupPage></SignupPage>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
