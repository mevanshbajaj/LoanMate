import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

function Dashboard() {
  const [persons, setPersons] = useState([]);
  const [summary, setSummary] = useState({
    totalGiven: 0,
    totalPaid: 0,
    totalPending: 0,
    activeLoans: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersons();
    fetchSummary();
  }, []);

  const fetchPersons = async () => {
    try {
      const res = await fetch(`${API}/api/persons`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setPersons(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      alert("Server error while fetching persons");
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `${API}/api/loans/summary/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSummary(data);
      }
    } catch (err) {
      alert("Error fetching summary");
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

      {/* 🔥 SUMMARY CARDS */}
      <div className="summary-grid">
        <div className="summary-card blue">
          <h4>Total Given</h4>
          <p>₹ {summary.totalGiven}</p>
        </div>

        <div className="summary-card green">
          <h4>Total Paid</h4>
          <p>₹ {summary.totalPaid}</p>
        </div>

        <div className="summary-card red">
          <h4>Total Pending</h4>
          <p>₹ {summary.totalPending}</p>
        </div>

        <div className="summary-card purple">
          <h4>Active Loans</h4>
          <p>{summary.activeLoans}</p>
        </div>
      </div>

      {/* Persons Count */}
      <div className="stat-card">
        <h4>Total Persons</h4>
        <p>{persons.length}</p>
      </div>

      {/* Person List */}
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