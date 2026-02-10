import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/persons");
      const data = await res.json();
      setPersons(data);
    } catch (error) {
      console.error("Failed to fetch persons", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Client-side search (name or phone)
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase()) ||
    person.phone.includes(search)
  );

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>

        <input
          className="search-input"
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <h4>Total Persons</h4>
          <p>{persons.length}</p>
        </div>
      </div>

      {loading && <p>Loading persons...</p>}


{/* Person Grid */}
<div className="person-grid">
  {!loading && filteredPersons.map((person) => (
    <div
      key={person._id}
      className="person-card"
      onClick={() => navigate(`/person/${person._id}`)}
    >
      <div className="avatar">
        {getInitials(person.name)}
      </div>
      <div className="person-info">
        <h4>{person.name}</h4>
        <p>{person.phone}</p>
      </div>
    </div>
  ))}
</div>


      {/* Empty Search Result */}
      {!loading && filteredPersons.length === 0 && (
        <p style={{ marginTop: 20 }}>No matching person found.</p>
      )}
    </div>
  );
}

export default Dashboard;
