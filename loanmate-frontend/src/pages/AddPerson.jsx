import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
import "./AddPerson.css";

function AddPerson() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      const res = await fetch(`${API}/api/persons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error adding person");
        return;
      }

      alert("Person added successfully ✅");

      // Clear form
      setName("");
      setPhone("");
      setAddress("");

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    }
  };

  return (
    <div className="addperson-page">
      <div className="addperson-card">
        <h2>Add New Person</h2>

        <label>Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Phone</label>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Address</label>
        <textarea
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Save Person
        </button>
      </div>
    </div>
  );
}

export default AddPerson;
