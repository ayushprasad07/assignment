import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import User from './components/User.jsx';
import { ToastContainer } from 'react-toastify';


function App() {

  return (
    <Router>
      <Navbar/>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/user-page" element={<User/>}/>
      </Routes>
    </Router>
  )
}

export default App
