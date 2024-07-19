import axios from "axios";
import { useEffect } from "react";

const My = () => {
  const baseUrl = "http://localhost:8080";
  const username = localStorage.getItem("username");

  useEffect(() => {
    const url = `${baseUrl}/api/lists/findformatted?uname=${username}`;
    console.log(`Pinging ${url}`);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };

    axios
      .get(url, config)
      .then(function (response) {
        //handle no error
      })
      .catch(function (error) {
        //Handle error
      })
      .finally(function () {
        //Always executed
      });
  }, []);

  return (
    <>
      <div className="container mt-5">Hello </div>
    </>
  );
};

export default My;
