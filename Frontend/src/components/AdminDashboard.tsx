import React, { useState, useEffect } from "react";

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

  const API_URL = "http://localhost:5002/api/coins"; // Backend endpoint

  // Fetch coins from backend
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch coins");
        const data = await response.json();
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coins:", err);
        setError(err.message);
      }
    };
    fetchCoins();
  }, []);

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
        withdrawalDays: parseInt(withdrawalDays, 10), // Use this field consistently
        tradeHistory: tradeHistory.filter(
          (history) => history.value && history.type
        ),
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {error && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>
      )}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {editCoinId ? "Edit Trading Pair" : "Add New Trading Pair"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Coin Name"
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Min Investment"
            value={minInvest}
            onChange={(e) => setMinInvest(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Max Investment"
            value={maxInvest}
            onChange={(e) => setMaxInvest(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Min Profit"
            value={minProfit}
            onChange={(e) => setMinProfit(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Max Profit"
            value={maxProfit}
            onChange={(e) => setMaxProfit(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Withdrawal Days"
            value={withdrawalDays}
            onChange={(e) => setWithdrawalDays(e.target.value)}
            className="border p-2"
          />
          <div>
            <h3 className="font-semibold">Trade History</h3>
            {tradeHistory.map((history, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Value"
                  value={history.value}
                  onChange={(e) =>
                    handleTradeHistoryChange(index, "value", e.target.value)
                  }
                  className="border p-2 w-1/2"
                />
                <select
                  value={history.type}
                  onChange={(e) =>
                    handleTradeHistoryChange(index, "type", e.target.value)
                  }
                  className="border p-2 w-1/2"
                >
                  <option value="">Type</option>
                  <option value="profit">Profit</option>
                  <option value="loss">Loss</option>
                </select>
              </div>
            ))}
            <button
              onClick={handleAddTradeHistory}
              className="bg-gray-500 text-white px-2 py-1 rounded"
            >
              Add Trade History
            </button>
          </div>
          <button
            onClick={handleAddOrUpdateCoin}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : editCoinId ? "Update Coin" : "Add Coin"}
          </button>
          {editCoinId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Manage Trading Pairs</h2>
        {coins.map((coin) => (
          <div key={coin._id} className="border p-4 mb-4">
            <h3 className="text-xl">{coin.name}</h3>
            <p>Price: ${coin.price}</p>
            <p>Min Invest: {coin.minInvest}</p>
            <p>Max Invest: {coin.maxInvest}</p>
            <p>Min Profit: {coin.minProfit}%</p>
            <p>Max Profit: {coin.maxProfit}%</p>
            <p>Withdrawal Days: {coin.withdrawalDays} days</p>
            <button
              onClick={() => handleEditCoin(coin)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCoin(coin._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
