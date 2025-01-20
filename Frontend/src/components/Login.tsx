import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Shield,
  ArrowRight,
  AlertCircle,
  Globe2,
  Lock,
  User,
  Mail,
  EyeOff,
  Eye,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:5002/api";

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const endpoint = `${API_BASE_URL}/${activeTab}`;
      const payload = { email, password, ...(activeTab === "signup" && { name }) };
  
      const response = await axios.post(endpoint, payload);
      toast.success(response.data.message);

      console.log("respinse .....", response.data)

      if (response.data.token) {
        const { token, user } = response.data; // Destructure token and user from the response
        const userData = {
          token,
          userId: user._id || "", // Extract _id from the user object
          email: user.email || email, // Use email from the response or input
          name: user.name || name || "", // Prioritize the response name
        };
      
        // Store user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(userData));
      
        // Optionally store individual items for easier access
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", userData.userId);
        sessionStorage.setItem("email", userData.email);
        sessionStorage.setItem("name", userData.name);
      
        // Redirect to Main Page
        if (
          (activeTab === "signin" && email.toLowerCase() === "admin@gmail.com") || 
          (activeTab === "signup" && name.toLowerCase() === "admin")
        ) {
          navigate("/admin"); // Redirect to Admin Dashboard
        } else {
          navigate("/mainpage"); // Redirect to Main Page for normal users
        }
      }      
    } catch (err: any) {
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      toast.error(message); 
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleTabChange = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#0c1220] flex">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <LineChart className="w-10 h-10 text-blue-400" />
            <span className="text-2xl font-bold text-white">TradePro</span>
          </div>
          <div className="mt-24">
            <h1 className="text-4xl font-bold text-white mb-6">
              Professional Trading <br />
              Platform for Global Markets
            </h1>
            <p className="text-blue-200 text-lg mb-8">
              Access real-time market data, advanced charting tools, and seamless trading
              execution.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe2 className="w-6 h-6 text-blue-400" />
                <span className="text-white">24/7 Global Market Access</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-white">Bank-Grade Security</span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6 text-blue-400" />
                <span className="text-white">Regulatory Compliant</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-sm text-blue-200">© 2024 TradePro. All rights reserved.</p>
        </div>
      </div>
      {/* Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            {/* Tabs */}
            <div className="flex mb-8 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => handleTabChange("signin")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "signin"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleTabChange("signup")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "signup"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-400 mb-8">
              {activeTab === "signin"
                ? "Sign in to access your trading dashboard"
                : "Start your trading journey today"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {activeTab === "signup" && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="John Doe"
                    />
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="name@company.com"
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={
                      activeTab === "signup" ? "Create a strong password" : "Enter your password"
                    }
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {activeTab === "signin" ? "Access Trading Platform" : "Create Trading Account"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
