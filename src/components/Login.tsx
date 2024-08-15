import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (action === "login") {
      auth.logout();
      await auth.login(username, password);
    } else if (action === "create") {
      await auth.createAccount(username, password);
      await auth.login(username, password);
    } else {
      console.error(`Something went horribly wrong, action = ${action}`);
    }
    //Redirect to a landing page here
    navigate("/my");
  };

  return (
    <>
      <div className="container mt-5">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4 w-50 mx-auto">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
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
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            onClick={() => setAction("login")}
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>
          <h4 className="text-center p-3">or</h4>
          <button
            onClick={() => setAction("create")}
            type="submit"
            className="btn btn-primary w-100"
          >
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
