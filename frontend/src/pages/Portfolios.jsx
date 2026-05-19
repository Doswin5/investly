import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance";

export default function Portfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "medium",
    baseCurrency: "NGN",
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchPortfolios = async () => {
    try {
      const res = await API.get("/portfolios");
      setPortfolios(res.data.portfolios);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load portfolios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createPortfolio = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await API.post("/portfolios", formData);
      setPortfolios((prev) => [res.data.portfolio, ...prev]);
      setFormData({
        name: "",
        description: "",
        riskLevel: "medium",
        baseCurrency: "NGN",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create portfolio.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p>Loading portfolios...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Portfolios</h1>
      <p className="text-slate-400 mt-1">
        Create and manage your investment portfolios.
      </p>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      <form
        onSubmit={createPortfolio}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-6 grid gap-4"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Portfolio name"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short description"
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
          disabled={creating}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white rounded-lg py-3 font-semibold"
        >
          {creating ? "Creating..." : "Create portfolio"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {portfolios.map((portfolio) => (
          <Link
            key={portfolio._id}
            to={`/portfolios/${portfolio._id}`}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-600"
          >
            <h2 className="font-semibold text-lg">{portfolio.name}</h2>
            <p className="text-slate-400 text-sm mt-2">
              {portfolio.description || "No description"}
            </p>
            <p className="text-slate-500 text-sm mt-4">
              {portfolio.riskLevel} risk · {portfolio.baseCurrency}
            </p>
          </Link>
        ))}
      </div>

      {portfolios.length === 0 && (
        <p className="text-slate-400 mt-6">
          No portfolios yet. Create your first one.
        </p>
      )}
    </div>
  );
}