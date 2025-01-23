import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

interface Investment {
  _id: string;
  userId: string;
  username: string;
  userEmail: string;
  tradingPair: string;
  investmentAmount: number;
  expectedProfit: string;
  withdrawalDate: string;
  proofFile: string;
  status: string;
  createdAt: string;
}

const InvestmentTable: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get<Investment[]>('https://cryptoaitrade.onrender.com/api/getAllInvestment');
        setInvestments(response.data);
      } catch (error) {
        console.error('Error fetching investment data:', error);
      }
    };

    fetchInvestments();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.post(`https://cryptoaitrade.onrender.com/api/updateInvestmentStatus/${id}`, { status: newStatus });
      setInvestments((prevInvestments) =>
        prevInvestments.map((investment) =>
          investment._id === id ? { ...investment, status: newStatus } : investment
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleExpectedProfitChange = async (id: string, newProfit: string) => {
    try {
      await axios.post(`https://cryptoaitrade.onrender.com/api/updateInvestmentProfit/${id}`, { expectedProfit: newProfit });
      setInvestments((prevInvestments) =>
        prevInvestments.map((investment) =>
          investment._id === id ? { ...investment, expectedProfit: newProfit } : investment
        )
      );
    } catch (error) {
      console.error('Error updating expected profit:', error);
    }
  };

  const handleProfitSignChange = (id: string, profit: string, isPositive: boolean) => {
    const updatedProfit = isPositive ? `+${profit}` : `-${profit}`;
    handleExpectedProfitChange(id, updatedProfit);
  };

  return (
    <div>
      <h2>Investment Details</h2>

      <button
          onClick={() => navigate("/admin")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
        >
          Go to Admin Table
        </button>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Trading Pair</th>
            <th>Investment Amount</th>
            <th>Expected Profit</th>
            <th>Withdrawal Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => {
            const isPositive = parseFloat(investment.expectedProfit) >= 0;
            return (
              <tr key={investment._id}>
                <td>{investment.username}</td>
                <td>{investment.userEmail}</td>
                <td>{investment.tradingPair}</td>
                <td>{investment.investmentAmount}</td>
                <td>
                  <div className="flex items-center">
                    <button
                      className="px-2 py-1 mr-2 text-green-500"
                      onClick={() => handleProfitSignChange(investment._id, investment.expectedProfit, true)}
                    >
                      +
                    </button>
                    <input
                      type="text"
                      value={investment.expectedProfit}
                      onChange={(e) => handleExpectedProfitChange(investment._id, e.target.value)}
                      className={`border p-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                    />
                    <button
                      className="px-2 py-1 ml-2 text-red-500"
                      onClick={() => handleProfitSignChange(investment._id, investment.expectedProfit, false)}
                    >
                      -
                    </button>
                  </div>
                </td>
                <td>{investment.withdrawalDate}</td>
                <td>
                  <select
                    value={investment.status}
                    onChange={(e) => handleStatusChange(investment._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentTable;
