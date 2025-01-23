// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InvestmentTable from "./InvestmentTable"; // Ensure this is correctly imported if still using tabs

const AdminDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [newCoin, setNewCoin] = useState("");
  const [price, setPrice] = useState("");
  const [minInvest, setMinInvest] = useState("");
  const [maxInvest, setMaxInvest] = useState("");
  const [minProfit, setMinProfit] = useState("");
  const [maxProfit, setMaxProfit] = useState("");
  const [withdrawalDays, setWithdrawalDays] = useState("");
  const [tradeHistory, setTradeHistory] = useState([{ value: "", type: "" }]);
  const [editCoinId, setEditCoinId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const API_URL = "https://cryptoaitrade.onrender.com/api/coins"; // Backend endpoint for coins

  // Fetch coins from backend on mount
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch coins");
        const data = await response.json();
        // Convert price and other fields to numbers
        const formattedData = data.map((coin) => ({
          ...coin,
          price: Number(coin.price),
          minInvest: Number(coin.minInvest),
          maxInvest: Number(coin.maxInvest),
          minProfit: Number(coin.minProfit),
          maxProfit: Number(coin.maxProfit),
          withdrawalDays: Number(coin.withdrawalDays),
        }));
        setCoins(formattedData);
      } catch (err) {
        console.error("Error fetching coins:", err);
        setError(err.message);
      }
    };
    fetchCoins();
  }, []);

  // Handle Add or Update Coin
  const handleAddOrUpdateCoin = async () => {
    if (
      !newCoin ||
      !price ||
      !minInvest ||
      !maxInvest ||
      !minProfit ||
      !maxProfit ||
      !withdrawalDays ||
      tradeHistory.some((history) => !history.value || !history.type)
    ) {
      setError("All fields are required and trade history must be complete.");
      return;
    }

    setError("");
    setIsLoading(true);

    const coinData = {
      name: newCoin,
      price: parseFloat(price),
      minInvest: parseFloat(minInvest),
      maxInvest: parseFloat(maxInvest),
      minProfit: parseFloat(minProfit),
      maxProfit: parseFloat(maxProfit),
      withdrawalDays: parseInt(withdrawalDays, 10),
      tradeHistory: tradeHistory.filter((history) => history.value && history.type),
    };

    try {
      if (editCoinId) {
        const response = await fetch(`${API_URL}/${editCoinId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coinData),
        });
        if (!response.ok) throw new Error("Failed to update coin");
        const updatedCoin = await response.json();
        // Ensure updatedCoin has price as a number
        updatedCoin.price = Number(updatedCoin.price);
        setCoins((prevCoins) =>
          prevCoins.map((coin) => (coin._id === editCoinId ? updatedCoin : coin))
        );
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coinData),
        });
        if (!response.ok) throw new Error("Failed to add coin");
        const addedCoin = await response.json();
        // Ensure addedCoin has price as a number
        addedCoin.price = Number(addedCoin.price);
        setCoins((prevCoins) => [...prevCoins, addedCoin]);
      }
      resetForm();
    } catch (err) {
      console.error("Error adding/updating coin:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoin = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this coin?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete coin");
      setCoins((prevCoins) => prevCoins.filter((coin) => coin._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCoin = (coin) => {
    setEditCoinId(coin._id);
    setNewCoin(coin.name);
    setPrice(coin.price);
    setMinInvest(coin.minInvest);
    setMaxInvest(coin.maxInvest);
    setMinProfit(coin.minProfit);
    setMaxProfit(coin.maxProfit);
    setWithdrawalDays(coin.withdrawalDays);
    setTradeHistory(coin.tradeHistory);
  };

  const resetForm = () => {
    setEditCoinId(null);
    setNewCoin("");
    setPrice("");
    setMinInvest("");
    setMaxInvest("");
    setMinProfit("");
    setMaxProfit("");
    setWithdrawalDays("");
    setTradeHistory([{ value: "", type: "" }]);
    setError("");
  };

  const handleAddTradeHistory = () => {
    setTradeHistory((prev) => [...prev, { value: "", type: "" }]);
  };

  const handleTradeHistoryChange = (index, field, value) => {
    setTradeHistory((prev) =>
      prev.map((history, i) =>
        i === index ? { ...history, [field]: value } : history
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Navigation Buttons */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/InvestmentTable")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
        >
          Go to Investment Table
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white p-4 mb-6 rounded">
          {error}
        </div>
      )}

      {/* Add/Edit Coin Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editCoinId ? "Edit Trading Pair" : "Add New Trading Pair"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Coin Name"
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            placeholder="Min Investment"
            value={minInvest}
            onChange={(e) => setMinInvest(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            placeholder="Max Investment"
            value={maxInvest}
            onChange={(e) => setMaxInvest(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            placeholder="Min Profit (%)"
            value={minProfit}
            onChange={(e) => setMinProfit(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            placeholder="Max Profit (%)"
            value={maxProfit}
            onChange={(e) => setMaxProfit(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            placeholder="Withdrawal Days"
            value={withdrawalDays}
            onChange={(e) => setWithdrawalDays(e.target.value)}
            className="border rounded px-4 py-2"
          />
        </div>

        {/* Trade History */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Trade History</h3>
          {tradeHistory.map((history, index) => (
            <div key={index} className="flex space-x-4 mb-2">
              <input
                type="text"
                placeholder="Value"
                value={history.value}
                onChange={(e) =>
                  handleTradeHistoryChange(index, "value", e.target.value)
                }
                className="border rounded px-4 py-2 w-1/2"
              />
              <select
                value={history.type}
                onChange={(e) =>
                  handleTradeHistoryChange(index, "type", e.target.value)
                }
                className="border rounded px-4 py-2 w-1/2"
              >
                <option value="">Select Type</option>
                <option value="profit">Profit</option>
                <option value="loss">Loss</option>
              </select>
            </div>
          ))}
          <button
            onClick={handleAddTradeHistory}
            className="mt-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Add Trade History
          </button>
        </div>

        {/* Form Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleAddOrUpdateCoin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : editCoinId
              ? "Update Coin"
              : "Add Coin"}
          </button>
          {editCoinId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Coins List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Trading Pairs</h2>
        {coins.length === 0 ? (
          <p>No trading pairs available.</p>
        ) : (
          <div className="space-y-4">
            {coins.map((coin) => (
              <div
                key={coin._id}
                className="border rounded p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h3 className="text-xl font-bold">{coin.name}</h3>
                  <p>
                    Price: $
                    {typeof coin.price === "number" && !isNaN(coin.price)
                      ? coin.price.toFixed(2)
                      : "N/A"}
                  </p>
                  <p>
                    Investment: ${coin.minInvest.toLocaleString()} - $
                    {coin.maxInvest.toLocaleString()}
                  </p>
                  <p>
                    Profit: {coin.minProfit}% - {coin.maxProfit}%
                  </p>
                  <p>Withdrawal Days: {coin.withdrawalDays} days</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => handleEditCoin(coin)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCoin(coin._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
