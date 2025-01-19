import React, { useState, useCallback } from 'react';
import {
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Wallet,
  Send,
  Clock,
  CheckCircle2,
  Copy,
  Upload,
  DollarSign,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { TradingChart } from './TradingChart';
import { Dashboard } from './Dashboard';
import { useNavigate } from 'react-router-dom';
import { mockInvestments } from './Dashboard';

function MainPage() {
  const [view, setView] = useState<'trading' | 'dashboard'>('trading');
  const [step, setStep] = useState<'select' | 'amount' | 'pool' | 'upload' | 'success'>('select');
  const [selectedPair, setSelectedPair] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const API_ENDPOINT = "http://localhost:5002/api"

  const tradingPairs = [
    { 
      pair: 'JUP/USDT',
      price: '0.7234',
      minInvest: 50,
      maxInvest: Number.POSITIVE_INFINITY,
      minProfit: 50,
      maxProfit: 100,
      withdrawalDays: 7,
      tradeHistory: [
        { value: '+5', type: 'profit' },
        { value: '-10', type: 'loss' },
        { value: '+15', type: 'profit' },
        { value: '+29', type: 'profit' }
      ]
    },
    { 
      pair: 'RAY/USDT',
      price: '1.456',
      minInvest: 50,
      maxInvest: Number.POSITIVE_INFINITY,
      minProfit: 75,
      maxProfit: 150,
      withdrawalDays: 10,
      tradeHistory: [
        { value: '+8', type: 'profit' },
        { value: '+25', type: 'profit' },
        { value: '+18', type: 'profit' }
      ]
    },
    { 
      pair: 'SOL/USDT',
      price: '125.32',
      minInvest: 50,
      maxInvest: Number.POSITIVE_INFINITY,
      minProfit: 100,
      maxProfit: 200,
      withdrawalDays: 14,
      tradeHistory: [
        { value: '+12', type: 'profit' },
        { value: '+22', type: 'profit' },
        { value: '+17', type: 'profit' }
      ]
    },
  ];

  const generateChartData = useCallback((tradeHistory: any[]) => {
    const data = [];
    let basePrice = 100;
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now);
      time.setMinutes(time.getMinutes() - i);
      
      const historyIndex = Math.floor((29 - i) / (30 / tradeHistory.length));
      const trade = tradeHistory[Math.min(historyIndex, tradeHistory.length - 1)];
      const change = parseFloat(trade.value) / 100;
      
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
    
    return data.sort((a, b) => a.time - b.time);
  }, []);

  const filteredPairs = tradingPairs.filter(pair =>
    pair.pair.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPairData = tradingPairs.find(pair => pair.pair === selectedPair);

  const handleCoinSelect = (pair: string) => {
    setSelectedPair(pair);
    setStep('amount');
  };

  const poolAddress = "0x1234...5678";

  const formatDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(poolAddress);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderStepper = () => {
    const steps = [
      { number: 1, label: 'Amount', isActive: step === 'amount' },
      { number: 2, label: 'Payment', isActive: step === 'pool' },
      { number: 3, label: 'Verification', isActive: step === 'upload' },
    ];

    const activeIndex = steps.findIndex(s => s.isActive);

    return (
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative flex justify-between">
          {steps.map((s, i) => {
            const isCompleted = activeIndex > i;
            const isActive = s.isActive;
            
            const showProgressLine = i < steps.length - 1;
            const isNextStepActive = steps[i + 1]?.isActive;
            const progressWidth = isCompleted ? '100%' : (isActive && isNextStepActive ? '50%' : '0%');

            return (
              <div key={s.label} className="relative flex-1 flex flex-col items-center">
                {showProgressLine && (
                  <div className="absolute top-4 left-[calc(50%+16px)] right-[calc(50%-16px)] h-1 bg-gray-700">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ 
                        width: progressWidth,
                        marginLeft: isActive && !isCompleted ? '50%' : '0%'
                      }}
                    />
                  </div>
                )}
                
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${
                    isActive 
                      ? 'bg-blue-500 text-white scale-110 ring-4 ring-blue-500/20'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : s.number}
                </div>
                
                <span className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                  isActive 
                    ? 'text-blue-500'
                    : isCompleted
                      ? 'text-green-500'
                      : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!screenshot || !amount || !selectedPair) {
      alert("All fields are required!");
      return;
    }
  
    const base64Screenshot = await getBase64(screenshot);


  // for (let i = 0; i < sessionStorage.length; i++) {
  //   const key = sessionStorage.key(i);
  //   const value = sessionStorage.getItem(key);
  //   console.log(`${key}: ${value}`);
  // }
  
    const requestData = {
      userId: sessionStorage.getItem("userId"), 
      username: sessionStorage.getItem('name'), 
      userEmail : sessionStorage.getItem('email'),
      tradingPair: selectedPair,
      status : "pending",
      investmentAmount: amount,
      expectedProfit: `${selectedPairData.minProfit} - ${selectedPairData.maxProfit}`,
      withdrawalDate: formatDate(selectedPairData.withdrawalDays),
      proofFileBase64: base64Screenshot,
    };


  
    try {
      const response = await fetch(`${API_ENDPOINT}/submit-investment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message); 
        setStep("success"); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  const getBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleLogout = () => {
    sessionStorage.clear(); 
    alert("You have successfully logged out.");
    navigate('/login'); 
  };

  
  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{step === 'success' ? 'Investment submitted successfully!' : 'Address copied to clipboard!'}</span>
          </div>
        </div>
      )}

      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <LineChart className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">Signal Trader</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView('trading')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'trading' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Trading
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {view === 'dashboard' ? (
        <Dashboard />
      ) : (
        <main className="max-w-7xl mx-auto p-4">
          {step !== 'select' && renderStepper()}

          {step === 'select' && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search trading pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPairs.map((item) => (
                  <button
                    key={item.pair}
                    onClick={() => handleCoinSelect(item.pair)}
                    className="bg-gray-800 p-6 rounded-lg text-left hover:bg-gray-700 transition-all"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">{item.pair}</span>
                      <span className="text-lg text-blue-400">${item.price}</span>
                    </div>
                    <div className="h-40 mb-4">
                      <TradingChart 
                        data={generateChartData(item.tradeHistory)} 
                        pair={item.pair}
                      />
                    </div>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Min Investment:</span>
                        <span className="text-white">${item.minInvest} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Profit:</span>
                        <span className="text-green-400">${item.minProfit} - ${item.maxProfit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Withdrawal Period:</span>
                        <span className="text-white">{item.withdrawalDays} days</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'amount' && selectedPairData && (
            <div className="max-w-lg mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Investment Amount</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Enter Investment Amount (USDT)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Minimum $50 USDT"
                        className="w-full bg-gray-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={50}
                        required
                      />
                      <span className="absolute right-4 top-3 text-gray-400">USDT</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('pool')}
                    disabled={!amount || Number(amount) < 50}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'pool' && (
            <div className="max-w-lg mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Pool Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Send {amount} USDT to this address
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-lg px-4 py-3">
                        {poolAddress}
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('upload')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    I've Made the Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'upload' && (
            <div className="max-w-lg mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Upload Payment Proof</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Transaction Screenshot
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                        className="hidden"
                        id="screenshot"
                        required
                      />
                      <label
                        htmlFor="screenshot"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">
                          {screenshot ? screenshot.name : 'Click to upload screenshot'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStep('success');
                      setShowToast(true);
                      handleSubmit();
                      setTimeout(() => setShowToast(false), 5000);
                      setTimeout(() => {
                        setView('dashboard');
                        setStep('select');
                      }, 2000);
                    }}
                    disabled={!screenshot}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && selectedPairData && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-center mb-6 text-green-500">
                  <CheckCircle2 className="w-16 h-16" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Investment Successful!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm text-gray-400">Invested Amount</span>
                    <p className="text-xl font-bold">${amount} USDT</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm text-gray-400">Expected Profit</span>
                    <p className="text-xl font-bold text-green-400">
                      ${selectedPairData.minProfit} - ${selectedPairData.maxProfit}
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm text-gray-400">Trading Pair</span>
                    <p className="text-xl font-bold">{selectedPair}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm text-gray-400">Withdrawal Date</span>
                    <p className="text-xl font-bold">
                      {formatDate(selectedPairData.withdrawalDays)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default MainPage;