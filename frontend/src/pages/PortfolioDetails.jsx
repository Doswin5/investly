import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axiosInstance";

export default function PortfolioDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "medium",
    baseCurrency: "NGN",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchPortfolio = async () => {
    try {
      const res = await API.get(`/portfolios/${id}`);
      setPortfolio(res.data.portfolio);
      setFormData({
        name: res.data.portfolio.name,
        description: res.data.portfolio.description || "",
        riskLevel: res.data.portfolio.riskLevel,
        baseCurrency: res.data.portfolio.baseCurrency,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updatePortfolio = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await API.patch(`/portfolios/${id}`, formData);
      setPortfolio(res.data.portfolio);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update portfolio.");
    } finally {
      setSaving(false);
    }
  };

  const deletePortfolio = async () => {
    const confirmed = window.confirm(
      "Delete this portfolio? This cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await API.delete(`/portfolios/${id}`);
      navigate("/portfolios");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete portfolio.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading portfolio...</p>;
  if (error && !portfolio) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <button
        onClick={() => navigate("/portfolios")}
        className="text-slate-400 hover:text-white mb-4"
      >
        ← Back to portfolios
      </button>

      <h1 className="text-2xl font-bold">{portfolio.name}</h1>
      <p className="text-slate-400 mt-1">Portfolio settings and details.</p>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      <form
        onSubmit={updatePortfolio}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-6 grid gap-4 max-w-2xl"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <select
            name="riskLevel"
            value={formData.riskLevel}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
          >
            <option value="low">Low risk</option>
            <option value="medium">Medium risk</option>
            <option value="high">High risk</option>
          </select>

          <select
            name="baseCurrency"
            value={formData.baseCurrency}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
          >
            <option value="NGN">NGN</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <button
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white rounded-lg py-3 font-semibold"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <button
        onClick={deletePortfolio}
        disabled={deleting}
        className="mt-6 bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white rounded-lg px-5 py-3"
      >
        {deleting ? "Deleting..." : "Delete portfolio"}
      </button>
    </div>
  );
}