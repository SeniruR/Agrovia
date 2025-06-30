import React, { useState } from 'react';
import { User, Lock, Shield, ShoppingCart } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.toLowerCase().replace(' ', '_'), selectedRole);
    }
  };

  const demoUsers = {
    buyer: [
      { username: 'john_smith', display: 'John Smith' },
      { username: 'maria_garcia', display: 'Maria Garcia' },
      { username: 'robert_chen', display: 'Robert Chen' }
    ],
    admin: [
      { username: 'admin', display: 'Administrator' },
      { username: 'sarah_johnson', display: 'Sarah Johnson' },
      { username: 'mike_davis', display: 'Mike Davis' }
    ]
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
              <p className="text-slate-600">Sign in to access the complaint management system</p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'buyer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Buyer</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'admin'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Admin</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  selectedRole === 'buyer'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white'
                }`}
              >
                Sign In as {selectedRole === 'buyer' ? 'Buyer' : 'Admin'}
              </button>
            </form>

            {/* Demo Users */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-3">Demo {selectedRole === 'buyer' ? 'Buyers' : 'Admins'}:</p>
              <div className="space-y-2">
                {demoUsers[selectedRole].map((user) => (
                  <button
                    key={user.username}
                    onClick={() => {
                      setUsername(user.username);
                      onLogin(user.username, selectedRole);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {user.display}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;