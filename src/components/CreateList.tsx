import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

interface CreateListProps {
  fetchLists: () => {};
}

//COMPONENT
const CreateList = ({ fetchLists }: CreateListProps) => {
  const [submitResponse, setSubmitResponse] = useState("");
  const [listInfo, setListInfo] = useState<{
    description: string;
    name: string;
    userID: string | null;
  }>({
    description: "",
    name: "",
    userID: localStorage.getItem("userID"),
  });

  //Create New List
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!listInfo.name) {
      setSubmitResponse("Please enter a name.");
      return;
    }

    if (!listInfo.description) {
      setSubmitResponse("Please enter a description.");
      return;
    }

    setSubmitResponse("");

    const url = `http://localhost:8080/api/lists/create`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };

    try {
      const response = await axios.post(url, listInfo, config);
      console.log("Create list response: " + response.data);
      setSubmitResponse("Create list response: " + response.data);

      //Reset all input fields
      setListInfo({
        ...listInfo,
        description: "",
        name: "",
      });
      //Refresh lists in application storage
      fetchLists();
    } catch (error) {
      console.error("Error creating list: " + error);
      setSubmitResponse("Error creating list: " + error);
    }
  };

  //Return TSX
  return (
    <div>
      <span>{submitResponse}</span>
      <form onSubmit={handleSubmit} className="mt-2 mx-auto">
        <div className="mt-2">
          <label htmlFor="url" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="url"
            maxLength={255}
            placeholder="Iconic Mountain Ranges..."
            value={listInfo.name}
            onChange={(e) => setListInfo({ ...listInfo, name: e.target.value })}
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="desc" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="desc"
            maxLength={65535}
            placeholder="Locations that can be identified by mountains in view..."
            value={listInfo.description}
            onChange={(e) =>
              setListInfo({ ...listInfo, description: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-2">
          Create New List
        </button>
      </form>
    </div>
  );
};

export default CreateList;
