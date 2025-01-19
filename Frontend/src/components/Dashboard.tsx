import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, ArrowUpRight, Clock, Wallet, DollarSign } from 'lucide-react';
import { TradingChart } from './TradingChart';

function generateMockTradingData() {
  const data = [];
  let basePrice = 100;
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const time = new Date(now);
    time.setMinutes(time.getMinutes() - i);

    const change = (Math.random() - 0.5) * 2;
    basePrice *= 1 + change / 20;

    const volatility = 0.02;
    const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
    const close = basePrice * (1 + (Math.random() - 0.5) * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);

    data.push({
      time: Math.floor(time.getTime() / 1000),
      open,
      high,
      low,
      close,
    });
  }

  return data;
}

export function Dashboard() {
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_ENDPOINT = 'http://localhost:5002/api';

  useEffect(() => {
    const fetchInvestments = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        alert('User ID not found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post(`${API_ENDPOINT}/fetch-investments`, { userId });
        const fetchedInvestments = response.data;

        // Add mock trading data to each investment
        const formattedInvestments = fetchedInvestments.map((inv) => ({
          ...inv,
          data: generateMockTradingData(), // Add mock trading chart data
        }));

        setInvestments(formattedInvestments);
      } catch (error) {
        console.error('Error fetching investments:', error.message);
        alert('Failed to fetch investments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalProfit = investments.reduce((sum, inv) => {
    const [minProfit, maxProfit] = inv.expectedProfit.split('-').map(Number);
    return sum + (maxProfit - minProfit); // Approximate profit calculation
  }, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <LineChart className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">Investment Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Total Invested</div>
              <div className="text-lg font-bold">${totalInvested.toFixed(2)}</div>
            </div>
            <div className="px-4 py-2 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Total Profit</div>
              <div className="text-lg font-bold text-green-400">+${totalProfit.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {isLoading ? (
          <p className="text-center text-gray-400">Loading investments...</p>
        ) : investments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {investments.map((investment) => (
              <div key={investment._id} className="bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{investment.tradingPair}</h3>
                        <p className="text-sm text-gray-400">
                          Invested on {new Date(investment.createdAt).toISOString().split('T')[0]}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            investment.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {investment.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                    <div className="h-48">
                      <TradingChart data={investment.data} pair={investment.tradingPair} />
                    </div>
                  </div>
                  <div className="lg:border-l lg:border-gray-700 lg:pl-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-400">Investment Amount</div>
                          <div className="text-lg font-bold">${investment.investmentAmount.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ArrowUpRight className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-sm text-gray-400">Current Profit</div>
                          {investment.status === 'pending' ? (
                            <div className="text-lg font-bold text-yellow-400">
                              After admin approval, profit will be displayed.
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-green-400">
                              +${investment.expectedProfit}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-400">Auto-withdrawal Date</div>
                          <div className="text-lg font-bold">{investment.withdrawalDate}</div>
                        </div>
                      </div>
                      {investment.status === 'completed' && (
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="text-sm text-gray-400">Total Withdrawn</div>
                            <div className="text-lg font-bold text-green-400">
                              ${(investment.investmentAmount + parseFloat(investment.expectedProfit)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No investments found.</p>
        )}
      </main>
    </div>
  );
}
