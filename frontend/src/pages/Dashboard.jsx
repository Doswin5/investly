import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

  const allocationData = dashboard.assetAllocation || [];

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

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-lg font-bold">Asset Allocation</h2>
          <p className="text-slate-400 text-sm mt-1">
            Portfolio value grouped by asset type.
          </p>

          {allocationData.length === 0 ? (
            <p className="text-slate-400 mt-6">No allocation data yet.</p>
          ) : (
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="value"
                    nameKey="assetType"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={entry.assetType} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
          <p className="text-slate-400 text-sm mt-1">
            Latest buy and sell records.
          </p>

          <div className="mt-4 space-y-3">
            {dashboard.recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="border border-slate-800 rounded-xl p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium capitalize">
                      {transaction.type} {transaction.asset?.symbol}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {transaction.quantity} units at ₦
                      {transaction.price.toLocaleString()}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₦{transaction.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {dashboard.recentTransactions.length === 0 && (
              <p className="text-slate-400">No transactions yet.</p>
            )}
          </div>
        </section>
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