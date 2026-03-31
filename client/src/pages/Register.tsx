import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Mail, Lock, User, Building2, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company_type: '',
    no_of_users: 1,
    package_name: 'Basic'
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (response.data.success) {
        alert('Registration successful! Redirecting to login...');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 bg-white/5 p-10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
             <Shield className="text-white h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-center text-sm text-slate-400">
             Join BloomAudit and setup your space
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Type</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-slate-400" />
                     </div>
                     <input
                        name="company_type"
                        type="text"
                        required
                        className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Tech, Retail..."
                        value={formData.company_type}
                        onChange={handleChange}
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">No. Users</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                     </div>
                     <input
                        name="no_of_users"
                        type="number"
                        min="1"
                        required
                        className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="1"
                        value={formData.no_of_users}
                        onChange={handleChange}
                     />
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Selected Package</label>
              <select
                name="package_name"
                className="appearance-none block w-full px-4 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.package_name}
                onChange={handleChange}
              >
                <option value="Basic">Basic ($49.99/mo) - Core features</option>
                <option value="Pro">Pro ($99.99/yr) - Advanced analytics</option>
                <option value="Enterprise">Enterprise ($249.99/yr) - Full access</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#0f172a] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Complete Registration'}
            </button>
          </div>
          
          <div className="text-center text-sm text-slate-400">
             Already have an account? <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
