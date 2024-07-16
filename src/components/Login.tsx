import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [action, setAction] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      

      if (action === "login") {
        login();
      } else if (action === "create") {
        await createUser();
        await login();
      }

      //TODO
      //Redirect to a landing page here
      //navigate.('/dashboard');
    };


    //Create new user
    async function createUser() {

    const url = "http://localhost:8080/api/users/create";

    const requestBody = {
      username,
      password
    };

    try {
      const response = await axios.post(url, requestBody,
        {
          headers: {
            "content-type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        console.log("User created successfully.");
      }

    } catch (e) {
      console.error(`Error attempting to create user. ${e}`);
    }

  }

    //Login and get JWT
    async function login() {

    const url = "http://localhost:8080/api/auth/gettoken";

    const requestBody = {
      username,
      password
    };

    try {
      const response = await axios.post(url, requestBody,
        {
          headers: {
            "content-type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        const jwt = response.data;
        localStorage.setItem("jwt", jwt);
        console.log("User logged in successfully.");
      }

    } catch (e) {
      console.error(`Error attempting to login. ${e}`);
    }

  }
  



    return (
      <div className="container mt-5">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4 w-50 mx-auto" >
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button onClick={() => setAction("login")} type="submit" className="btn btn-primary w-100">Login</button>
          <h4 className="text-center p-3">or</h4>
          <button onClick={() => setAction("create")} type="submit" className="btn btn-primary w-100">Create Account</button>
        </form>
      </div>
    );

}



export default Login;