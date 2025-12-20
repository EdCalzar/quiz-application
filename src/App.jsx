import OnClick from "./practice/OnClick"
import OnChange from "./practice/OnChange"
import OnSubmit from "./practice/onSubmit"
import LandingPage from "./components/LandingPage"
import { Route, Routes } from "react-router-dom"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
    </Routes>
  )
}