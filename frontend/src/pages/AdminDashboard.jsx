import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      const [dashboardRes, usersRes, logsRes] = await Promise.all([
        API.get("/dashboard/admin"),
        API.get("/admin/users"),
        API.get("/admin/audit-logs"),
      ]);

      setDashboard(dashboardRes.data.dashboard);
      setUsers(usersRes.data.users);
      setLogs(logsRes.data.logs);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const updateUserStatus = async (userId, isActive) => {
    try {
      const res = await API.patch(`/admin/users/${userId}/status`, {
        isActive,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, isActive: res.data.user.isActive }
            : user
        )
      );

      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status.");
    }
  };

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-slate-400 mt-1">
        Monitor users, portfolio activity, and audit records.
      </p>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <SummaryCard title="Total Users" value={dashboard.totalUsers} />
        <SummaryCard title="Active Users" value={dashboard.activeUsers} />
        <SummaryCard title="Portfolios" value={dashboard.totalPortfolios} />
        <SummaryCard title="Transactions" value={dashboard.totalTransactions} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Users</h2>

        <div className="mt-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Joined</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-800">
                  <td className="p-4">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-slate-500">{user.email}</p>
                  </td>

                  <td className="p-4 capitalize">{user.role}</td>

                  <td className="p-4">
                    {user.isActive ? "Active" : "Disabled"}
                  </td>

                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {user.role === "admin" ? (
                      <span className="text-slate-500">Protected</span>
                    ) : (
                      <button
                        onClick={() =>
                          updateUserStatus(user._id, !user.isActive)
                        }
                        className={
                          user.isActive
                            ? "bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg"
                            : "bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg"
                        }
                      >
                        {user.isActive ? "Disable" : "Enable"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Audit Logs</h2>

        <div className="mt-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left p-4">Action</th>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Entity</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t border-slate-800">
                  <td className="p-4">{log.action}</td>

                  <td className="p-4">
                    <p className="font-medium">{log.user?.name}</p>
                    <p className="text-slate-500">{log.user?.email}</p>
                  </td>

                  <td className="p-4">{log.entityType}</td>

                  <td className="p-4">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-slate-400">
                    No audit logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
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