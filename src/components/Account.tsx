import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const Account = () => {
  const auth = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCompare, setNewPasswordCompare] = useState("");
  const [curPassword, setCurPassword] = useState("");
  const [submitResponse, setSubmitResponse] = useState("");

  const config = {
    headers: {
      Authorization: "Bearer " + auth.user.jwt,
    },
  };

  //CHANGE EMAIL
  const handleNewEmailSubmit = async (e: any) => {
    e.preventDefault();
    if (!curPassword) {
      setSubmitResponse("Must Include Current Password!");
      return;
    }

    const url = "https://api.geosave.org:8443/api/users/setemail";
    const requestBody = {
      password: curPassword,
      newEmail: newEmail,
    };

    try {
      const response = await axios.put(url, requestBody, config);
      console.log(
        "E-mail change request handled successfully. " + response.data
      );
      setSubmitResponse("E-mail change request handled successfully.");
      setCurPassword("");
      setNewEmail("");
    } catch (error) {
      console.error("Error handling E-mail change request. " + error);
      setSubmitResponse("Error handling E-mail change request.");
    }
  };

  //CHANGE PASSWORD
  const handleNewPasswordSubmit = async (e: any) => {
    e.preventDefault();

    if (!(newPassword.localeCompare(newPasswordCompare) === 0)) {
      setSubmitResponse("Passwords Do Not Match!");
      return;
    }

    if (!curPassword) {
      setSubmitResponse("Must Include Current Password!");
      return;
    }

    const url = "https://api.geosave.org:8443/api/users/setpassword";
    const requestBody = {
      password: curPassword,
      newPassword: newPassword,
    };

    try {
      const response = await axios.put(url, requestBody, config);
      console.log(
        "Password change request handled successfully. " + response.data
      );
      setSubmitResponse("Password change request handled successfully.");
      setCurPassword("");
      setNewPassword("");
      setNewPasswordCompare("");
    } catch (error) {
      console.error("Error handling password change request. " + error);
      setSubmitResponse("Error handling password change request.");
    }
  };

  const handleNewEmailChange = (e: any) => {
    setNewEmail(e.target.value);
  };

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
  };

  const handleNewPasswordCompareChange = (e: any) => {
    setNewPasswordCompare(e.target.value);
  };

  const handleCurPasswordChange = (e: any) => {
    setCurPassword(e.target.value);
  };

  return (
    <div className="col-4 mt-5 ms-4">
      <h1>My Account</h1>
      {/* Current Account Details */}
      <div className="row">
        <h4>Username: {auth.user.username}</h4>
        <h4>
          E-Mail Address:{" "}
          {auth.user.email ||
            "E-Mail Address Not Set Yet - Please Set One In Case You Need to Recover Your Account!"}
        </h4>
      </div>
      <span>{submitResponse}</span>
      {/* Current Password */}
      <div className="row mt-5">
        <h4>Current Password, Required for Any Changes</h4>
        <form>
          <input
            type="password"
            className="form-control"
            value={curPassword}
            onChange={handleCurPasswordChange}
            required
          />
        </form>
      </div>
      {/* New Email */}
      <div>
        <div className="row mt-5">
          <h4>Change E-Mail Address</h4>
          <form onSubmit={handleNewEmailSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="New E-Mail Address"
              value={newEmail}
              onChange={handleNewEmailChange}
              required
            />
            <button className="btn btn-primary mt-1" type="submit">
              Set New Email
            </button>
          </form>
        </div>
        {/* New Password */}
        <div className="row mt-5">
          <h4>Change Password</h4>
          <form onSubmit={handleNewPasswordSubmit}>
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <input
              type="password"
              className="form-control mt-2"
              placeholder="You Know the Drill"
              value={newPasswordCompare}
              onChange={handleNewPasswordCompareChange}
              required
            />
            <button className="btn btn-primary mt-1" type="submit">
              Set New Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
