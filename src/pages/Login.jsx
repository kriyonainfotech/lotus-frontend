import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, History, ArrowRight, } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      const mockUser = {
        name: 'Admin Developer',
        email: email || 'admin@lotus.com',
        role: 'admin'
      };
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(7);

      login(mockUser, mockToken);
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-primary-100 selection:text-primary-700">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">

        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <History size={28} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Lotus Admin</span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              Build and manage <br />
              your platform <br />
              <span className="text-primary-200">effortlessly.</span>
            </h2>
            <p className="text-primary-100 text-lg max-w-sm font-medium leading-relaxed">
              The most powerful administrative interface for your modern applications.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-sm font-medium">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-primary-700 bg-primary-400 flex items-center justify-center">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-primary-200">Joined by 10k+ developers</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center relative">
          <div className="mb-12">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Enter your credentials to access the panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group space-y-2">
              <label className="text-sm font-bold text-slate-700 transition-colors group-focus-within:text-primary-600">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 transition-colors group-focus-within:text-primary-600">Password</label>
                <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500" size={20} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
            </div>

            {/* <button className="w-full py-3 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors duration-300">
              <Github size={20} className="text-slate-900" />
              <span className="font-bold text-slate-700">Github</span>
            </button> */}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have an eye? <a href="#" className="text-primary-600 font-bold hover:underline">Request access</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
