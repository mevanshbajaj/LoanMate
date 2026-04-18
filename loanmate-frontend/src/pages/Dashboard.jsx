import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import api from "../services/api";
import "./Dashboard.css";

function StatCard({ label, value, color, icon }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon-wrap">{icon}</div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

function PersonSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 68, borderRadius: 8 }} />
      ))}
    </div>
  );
}

function Dashboard() {
  const [persons, setPersons] = useState([]);
  const [summary, setSummary] = useState({
    totalGiven: 0,
    totalPaid: 0,
    totalPending: 0,
    activeLoans: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    try {
      const [personsRes, summaryRes, chartRes] = await Promise.all([
        api.get("/persons"),
        api.get("/loans/summary/all"),
        api.get("/loans/monthly-stats"),
      ]);
      setPersons(personsRes.data);
      setSummary(summaryRes.data);
      setChartData(chartRes.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = persons.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your lending overview</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/add-person")}>
          + Add Person
        </button>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Given" value={fmt(summary.totalGiven)} color="blue" icon="💰" />
        <StatCard label="Total Paid" value={fmt(summary.totalPaid)} color="green" icon="✅" />
        <StatCard label="Pending" value={fmt(summary.totalPending)} color="red" icon="⏳" />
        <StatCard label="Active Loans" value={summary.activeLoans} color="purple" icon="📋" />
      </div>

      {chartData.length > 0 && (
        <div className="chart-card">
          <p className="section-title" style={{ marginBottom: 20 }}>
            Monthly Lending Activity
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradGiven" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value, name) => [fmt(value), name]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
              />
              <Area
                type="monotone"
                dataKey="given"
                stroke="#4F46E5"
                strokeWidth={2}
                fill="url(#gradGiven)"
                name="Given"
              />
              <Area
                type="monotone"
                dataKey="paid"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#gradPaid)"
                name="Paid"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="people-card">
        <div className="people-header">
          <p className="section-title">
            People {!loading && `(${persons.length})`}
          </p>
          <input
            className="search-box"
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <PersonSkeleton />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">👤</p>
            <p>{search ? "No results found." : "No people added yet."}</p>
            {!search && (
              <button className="btn-primary" onClick={() => navigate("/add-person")}>
                Add your first person
              </button>
            )}
          </div>
        ) : (
          <div className="person-list">
            {filtered.map((person) => (
              <div
                key={person._id}
                className="person-row"
                onClick={() => navigate(`/person/${person._id}`)}
              >
                <div className="person-avatar">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div className="person-meta">
                  <span className="person-name">{person.name}</span>
                  <span className="person-phone">{person.phone}</span>
                </div>
                <span className="row-arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
