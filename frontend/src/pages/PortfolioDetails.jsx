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

  const [assets, setAssets] = useState([]);
  const [assetForm, setAssetForm] = useState({
    name: "",
    symbol: "",
    assetType: "stock",
    currentPrice: "",
  });
  const [addingAsset, setAddingAsset] = useState(false);

  const [transactions, setTransactions] = useState([]);
const [transactionForm, setTransactionForm] = useState({
  assetId: "",
  type: "buy",
  quantity: "",
  price: "",
  note: "",
});
const [recordingTransaction, setRecordingTransaction] = useState(false);

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

  const fetchAssets = async () => {
    try {
      const res = await API.get(`/portfolios/${id}/assets`);
      setAssets(res.data.assets);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assets.");
    }
  };

  const fetchTransactions = async () => {
  try {
    const res = await API.get(`/transactions/${id}`);
    setTransactions(res.data.transactions);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to load transactions.");
  }
};

  useEffect(() => {
  fetchPortfolio();
  fetchAssets();
  fetchTransactions();
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
      "Delete this portfolio? This cannot be undone.",
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

  const handleAssetChange = (e) => {
    setAssetForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addAsset = async (e) => {
    e.preventDefault();
    setAddingAsset(true);
    setError("");

    try {
      const res = await API.post(`/portfolios/${id}/assets`, {
        ...assetForm,
        currentPrice: Number(assetForm.currentPrice),
      });

      setAssets((prev) => [res.data.asset, ...prev]);

      setAssetForm({
        name: "",
        symbol: "",
        assetType: "stock",
        currentPrice: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add asset.");
    } finally {
      setAddingAsset(false);
    }
  };

  const updateAssetPrice = async (assetId) => {
    const price = prompt("Enter new current price:");

    if (!price) return;

    try {
      const res = await API.patch(`/assets/${assetId}/price`, {
        currentPrice: Number(price),
      });

      setAssets((prev) =>
        prev.map((asset) => (asset._id === assetId ? res.data.asset : asset)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update asset price.");
    }
  };

  const deleteAsset = async (assetId) => {
    const confirmed = window.confirm("Delete this asset?");
    if (!confirmed) return;

    try {
      await API.delete(`/assets/${assetId}`);

      setAssets((prev) => prev.filter((asset) => asset._id !== assetId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete asset.");
    }
  };

  const handleTransactionChange = (e) => {
  setTransactionForm((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const recordTransaction = async (e) => {
  e.preventDefault();
  setRecordingTransaction(true);
  setError("");

  if (
  !transactionForm.assetId ||
  !transactionForm.quantity ||
  !transactionForm.price
) {
  setError("Asset, quantity, and price are required.");
  setRecordingTransaction(false);
  return;
}

if (Number(transactionForm.quantity) <= 0 || Number(transactionForm.price) <= 0) {
  setError("Quantity and price must be greater than 0.");
  setRecordingTransaction(false);
  return;
}

  try {
    const endpoint =
      transactionForm.type === "buy"
        ? "/transactions/buy"
        : "/transactions/sell";

    await API.post(endpoint, {
      portfolioId: id,
      assetId: transactionForm.assetId,
      quantity: Number(transactionForm.quantity),
      price: Number(transactionForm.price),
      note: transactionForm.note,
    });

    setTransactionForm({
      assetId: "",
      type: "buy",
      quantity: "",
      price: "",
      note: "",
    });

    await fetchAssets();
    await fetchTransactions();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to record transaction.");
  } finally {
    setRecordingTransaction(false);
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

      <section className="mt-10">
        <h2 className="text-xl font-bold">Assets</h2>
        <p className="text-slate-400 mt-1">
          Add assets under this portfolio. Quantity changes only through
          transactions.
        </p>

        <form
          onSubmit={addAsset}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-5 grid gap-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={assetForm.name}
              onChange={handleAssetChange}
              placeholder="Asset name"
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            />

            <input
              name="symbol"
              value={assetForm.symbol}
              onChange={handleAssetChange}
              placeholder="Symbol e.g. FSDH-FUND"
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="assetType"
              value={assetForm.assetType}
              onChange={handleAssetChange}
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            >
              <option value="stock">Stock</option>
              <option value="bond">Bond</option>
              <option value="mutual_fund">Mutual fund</option>
              <option value="fixed_income">Fixed income</option>
              <option value="cash">Cash</option>
            </select>

            <input
              name="currentPrice"
              type="number"
              value={assetForm.currentPrice}
              onChange={handleAssetChange}
              placeholder="Current price"
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            />
          </div>

          <button
            disabled={addingAsset}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white rounded-lg py-3 font-semibold"
          >
            {addingAsset ? "Adding..." : "Add asset"}
          </button>
        </form>
      </section>

      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="text-left p-4">Asset</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Qty</th>
              <th className="text-left p-4">Avg Price</th>
              <th className="text-left p-4">Current Price</th>
              <th className="text-left p-4">Value</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset._id} className="border-t border-slate-800">
                <td className="p-4">
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-slate-500">{asset.symbol}</p>
                </td>

                <td className="p-4">{asset.assetType}</td>
                <td className="p-4">{asset.quantity}</td>
                <td className="p-4">
                  ₦{asset.averageBuyPrice.toLocaleString()}
                </td>
                <td className="p-4">₦{asset.currentPrice.toLocaleString()}</td>
                <td className="p-4">
                  ₦{(asset.quantity * asset.currentPrice).toLocaleString()}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => updateAssetPrice(asset._id)}
                    className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg"
                  >
                    Price
                  </button>

                  <button
                    onClick={() => deleteAsset(asset._id)}
                    className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {assets.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-slate-400">
                  No assets yet. Add your first asset.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <section className="mt-10">
  <h2 className="text-xl font-bold">Record Transaction</h2>
  <p className="text-slate-400 mt-1">
    Buy and sell transactions update asset quantity automatically.
  </p>

  <form
    onSubmit={recordTransaction}
    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-5 grid gap-4"
  >
    <div className="grid md:grid-cols-2 gap-4">
      <select
        name="assetId"
        value={transactionForm.assetId}
        onChange={handleTransactionChange}
        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
      >
        <option value="">Select asset</option>
        {assets.map((asset) => (
          <option key={asset._id} value={asset._id}>
            {asset.name} ({asset.symbol})
          </option>
        ))}
      </select>

      <select
        name="type"
        value={transactionForm.type}
        onChange={handleTransactionChange}
        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
      >
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <input
        name="quantity"
        type="number"
        min="0"
        step="0.0001"
        value={transactionForm.quantity}
        onChange={handleTransactionChange}
        placeholder="Quantity"
        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
      />

      <input
        name="price"
        type="number"
        min="0"
        step="0.01"
        value={transactionForm.price}
        onChange={handleTransactionChange}
        placeholder="Price per unit"
        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
      />
    </div>

    <textarea
      name="note"
      value={transactionForm.note}
      onChange={handleTransactionChange}
      placeholder="Optional note"
      className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
    />

    <button
      disabled={recordingTransaction}
      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white rounded-lg py-3 font-semibold"
    >
      {recordingTransaction ? "Recording..." : "Record transaction"}
    </button>
  </form>
</section>

<section className="mt-10">
  <h2 className="text-xl font-bold">Transaction History</h2>

  <div className="mt-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-slate-950 text-slate-400">
        <tr>
          <th className="text-left p-4">Type</th>
          <th className="text-left p-4">Asset</th>
          <th className="text-left p-4">Quantity</th>
          <th className="text-left p-4">Price</th>
          <th className="text-left p-4">Total</th>
          <th className="text-left p-4">Date</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction._id} className="border-t border-slate-800">
            <td className="p-4 capitalize">{transaction.type}</td>

            <td className="p-4">
              <p className="font-medium">{transaction.asset?.name}</p>
              <p className="text-slate-500">{transaction.asset?.symbol}</p>
            </td>

            <td className="p-4">{transaction.quantity}</td>
            <td className="p-4">₦{transaction.price.toLocaleString()}</td>
            <td className="p-4">₦{transaction.totalAmount.toLocaleString()}</td>
            <td className="p-4">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}

        {transactions.length === 0 && (
          <tr>
            <td colSpan="6" className="p-4 text-slate-400">
              No transactions yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>

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
