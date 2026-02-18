import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/persons", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPersons(Array.isArray(data) ? data : []);
      } else {
        alert(data.message || "Failed to fetch persons");
      }
    } catch (err) {
      alert("Server error while fetching persons");
    } finally {
      setLoading(false);
    }
  };

  const filtered = persons.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="stat-card">
        <h4>Total Persons</h4>
        <p>{persons.length}</p>
      </div>

      <div className="person-list">
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No persons found</p>
        ) : (
          filtered.map((person) => (
            <div
              key={person._id}
              className="person-card"
              onClick={() => navigate(`/person/${person._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="avatar">
                {person.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3>{person.name}</h3>
                <p>{person.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
