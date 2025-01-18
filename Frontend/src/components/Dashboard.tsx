import React from 'react';
import { LineChart, ArrowUpRight, Clock, Wallet, DollarSign } from 'lucide-react';
import { TradingChart } from './TradingChart';

interface Investment {
  id: string;
  pair: string;
  amount: number;
  date: string;
  profit: number;
  withdrawalDate: string;
  status: 'pending' | 'completed';
  data: any[];
}

// Mock data - in a real app, this would come from your backend
export const mockInvestments: Investment[] = [];

// Helper function to generate mock trading data
function generateMockTradingData() {
  const data = [];
  let basePrice = 100;
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now);
    time.setMinutes(time.getMinutes() - i);
    
    const change = (Math.random() - 0.5) * 2;
    basePrice *= (1 + change / 20);
    
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
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = mockInvestments.reduce((sum, inv) => sum + inv.profit, 0);

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
        {mockInvestments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No investments yet. Start trading to see your portfolio!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {mockInvestments.map((investment) => (
              <div key={investment.id} className="bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{investment.pair}</h3>
                        <p className="text-sm text-gray-400">Invested on {investment.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          investment.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {investment.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                    <div className="h-48">
                      <TradingChart 
                        data={investment.data}
                        pair={investment.pair}
                      />
                    </div>
                  </div>
                  <div className="lg:border-l lg:border-gray-700 lg:pl-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-400">Investment Amount</div>
                          <div className="text-lg font-bold">${investment.amount.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ArrowUpRight className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-sm text-gray-400">Current Profit</div>
                          <div className="text-lg font-bold text-green-400">
                            +${investment.profit.toFixed(2)}
                          </div>
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
                              ${(investment.amount + investment.profit).toFixed(2)}
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
        )}
      </main>
    </div>
  );
}