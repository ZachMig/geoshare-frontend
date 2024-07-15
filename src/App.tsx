import './App.css'
import Account from './components/Account.tsx';
import Login from './components/Login.tsx'

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
      </Routes>
    </>
  )
}

export default App
