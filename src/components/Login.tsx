import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("");
  const [submitResponse, setSubmitResponse] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Login
    if (action === "login") {
      auth.logout();
      const loginSuccess = await auth.login(username, password);
      if (loginSuccess) {
        setSubmitResponse("");
        navigate("/my");
      } else {
        setSubmitResponse("Error Logging In.");
      }
    }

    //Create Account
    else if (action === "create") {
      //Create
      const createAccountSuccess = await auth.createAccount(username, password);
      if (!createAccountSuccess) {
        setSubmitResponse("Error Creating Account.");
      }
      //Login
      const loginSuccess = await auth.login(username, password);
      if (loginSuccess) {
        setSubmitResponse("");
        navigate("/manage");
      } else {
        setSubmitResponse(
          "Account Created, but Error Logging in With New Account."
        );
      }
    } else {
      console.error(`Something went horribly wrong, action = ${action}`);
    }
  };

  return (
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
        <h4 className="mt-3" style={{ textAlign: "center" }}>
          {submitResponse}
        </h4>
      </form>
    </div>
  );
}

export default Login;
