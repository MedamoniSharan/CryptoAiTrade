import React, { useState, useEffect, ChangeEvent } from "react";

// Define a type for an investment
export interface Investment {
  _id: string;
  userId: string;
  username: string;
  userEmail: string;
  tradingPair: string;
  investmentAmount: number;
  expectedProfit: string;
  withdrawalDate: string;
  proofFile?: string;
  status: string;
  createdAt?: string;
}

const InvestmentsAdmin: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [error, setError] = useState<string>("");
  const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Change this URL to match your backend investments endpoint
  const INVESTMENTS_API_URL = "https://cryptoaitrade.onrender.com/api/investments";

  // Fetch all investments on component mount
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await fetch(`${INVESTMENTS_API_URL}/all`);
        if (!res.ok) throw new Error("Failed to fetch investments");
        const data: Investment[] = await res.json();
        setInvestments(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchInvestments();
  }, []);

  // Handle status change for an investment
  const handleStatusChange = (investmentId: string, newStatus: string) => {
    setStatusUpdates((prev) => ({ ...prev, [investmentId]: newStatus }));
  };

  // Update the investment status in the backend
  const updateStatus = async (investmentId: string) => {
    const newStatus = statusUpdates[investmentId];
    if (!newStatus) {
      setError("Please select a new status before updating.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${INVESTMENTS_API_URL}/${investmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updatedInvestment: Investment = await res.json();
      setInvestments((prev) =>
        prev.map((inv) =>
          inv._id === investmentId ? updatedInvestment : inv
        )
      );
      // Clear the status update for this investment
      setStatusUpdates((prev) => ({ ...prev, [investmentId]: "" }));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Investment Management</h1>
      {error && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded">
          {error}
        </div>
      )}
      {investments.length === 0 ? (
        <p>No investments found.</p>
      ) : (
        investments.map((investment) => (
          <div key={investment._id} className="border p-4 mb-4">
            <h3 className="text-xl mb-2">
              Trading Pair: {investment.tradingPair}
            </h3>
            <p>
              <strong>User:</strong> {investment.username} ({investment.userEmail})
            </p>
            <p>
              <strong>Investment Amount:</strong> ${investment.investmentAmount}
            </p>
            <p>
              <strong>Expected Profit:</strong> {investment.expectedProfit}
            </p>
            <p>
              <strong>Withdrawal Date:</strong> {investment.withdrawalDate}
            </p>
            <p>
              <strong>Current Status:</strong> {investment.status}
            </p>
            {investment.proofFile && (
              <div className="my-2">
                <strong>Payment Proof:</strong>
                <br />
                <img
                  src={investment.proofFile}
                  alt="Payment Proof"
                  className="mt-2 max-w-xs"
                />
              </div>
            )}
            <div className="mt-3">
              <select
                value={statusUpdates[investment._id] || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleStatusChange(investment._id, e.target.value)
                }
                className="border p-2 mr-2"
              >
                <option value="">Select new status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => updateStatus(investment._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InvestmentsAdmin;
