import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/user");
      setDashboard(res.data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-slate-400 mt-1">
        Your portfolio summary and recent activity.
      </p>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <SummaryCard title="Portfolios" value={dashboard.totalPortfolios} />
        <SummaryCard title="Assets" value={dashboard.totalAssets} />
        <SummaryCard
          title="Invested"
          value={`₦${dashboard.totalInvested.toLocaleString()}`}
        />
        <SummaryCard
          title="Current Value"
          value={`₦${dashboard.totalPortfolioValue.toLocaleString()}`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <SummaryCard
          title="Gain / Loss"
          value={`₦${dashboard.totalGainLoss.toLocaleString()}`}
        />
        <SummaryCard
          title="Gain / Loss %"
          value={`${dashboard.gainLossPercentage.toFixed(2)}%`}
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}