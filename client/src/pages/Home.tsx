import React from 'react'
import Navbar from '../components/Navbar'
import ChatWidget from '../components/ChatWidget'
import { Rocket, Shield, Zap, TrendingUp, ChevronRight, Play } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <main className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
          <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[200px] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Native TypeScript Architecture
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Transform Your 
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Data Intelligence
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              BloomAudit is the premium PERN stack command center designed for modern enterprises. 
              Real-time analytics, instant collaboration, and unrivaled performance.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <button className="px-10 py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/25 flex items-center gap-3 group">
                Start for Free
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-2xl font-bold text-lg transition-all flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play size={14} className="fill-white ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-center animate-in fade-in duration-1000 delay-500">
              {[
                { label: 'Uptime', val: '99.99%', icon: <Zap size={20} className="text-yellow-400" /> },
                { label: 'Security', val: 'AES-256', icon: <Shield size={20} className="text-emerald-400" /> },
                { label: 'Performance', val: 'Sub-1s', icon: <Rocket size={20} className="text-orange-400" /> },
                { label: 'Growth', val: '+450%', icon: <TrendingUp size={20} className="text-blue-400" /> },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10">{stat.icon}</div>
                  <div className="text-3xl font-black">{stat.val}</div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default Home
