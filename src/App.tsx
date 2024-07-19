import './App.css'
import Account from "./components/Account.tsx";
import Login from "./components/Login.tsx";
import My from "./components/My.tsx";

import {
  Routes,
  Route
} from "react-router-dom";


function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element = {<Login />} />
        <Route path="/account" element = {<Account />} />
        <Route path="/my" element = {<My />} />
      </Routes>
    </>
  )
}

export default App
