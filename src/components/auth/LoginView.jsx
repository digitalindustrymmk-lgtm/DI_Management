import React, { useState } from 'react';
import { DatabaseIcon, UserIcon, ChevronRightIcon } from '../Icons';

const LoginView = ({ onLogin, loading, error }) => {
    const [email, setEmail] = useState('admin@dilistname.com');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onLogin(email, password);
    };
  
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden font-sans">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
  
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl w-full max-w-md m-4 animate-fade-in z-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              
              <div className="flex flex-col items-center mb-10">
                  <div className="h-20 w-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 transform rotate-6 border border-white/20">
                      <DatabaseIcon className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">HR PRO</h1>
                  <p className="text-slate-400 text-sm font-medium">Please sign in to continue</p>
              </div>
  
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Email Address</label>
                      <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <UserIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                          </div>
                          <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="block w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                              placeholder="admin@dilistname.com"
                              required
                          />
                      </div>
                  </div>
  
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Password</label>
                      <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                          <input 
                              type="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                              placeholder="••••••••••••"
                              required
                          />
                      </div>
                  </div>
  
                  {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-200 text-sm animate-pulse">
                          <div className="h-2 w-2 rounded-full bg-red-500 shrink-0"></div>
                          {error}
                      </div>
                  )}
  
                  <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                  >
                      {loading ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                          <>Sign In <ChevronRightIcon className="h-5 w-5" /></>
                      )}
                  </button>
              </form>
              
              <div className="mt-10 text-center">
                  <p className="text-slate-500 text-xs font-medium">Secured by Google Firebase</p>
              </div>
          </div>
      </div>
    );
};

export default LoginView;