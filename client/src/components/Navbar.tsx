import React, { useState, useEffect } from 'react';
import { Home, ClipboardList, Ticket, PhoneCall, Bell, User, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', icon: <Home size={18} />, href: '#' },
    { name: 'My Plan', icon: <ClipboardList size={18} />, href: '#' },
    { name: 'Tickets', icon: <Ticket size={18} />, href: '#' },
    { name: 'Quick Contact', icon: <PhoneCall size={18} />, href: '#' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:block">BloomAudit</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors group">
              <span className="text-slate-500 group-hover:text-blue-400 transition-colors">{link.icon}</span>
              {link.name}
            </a>
          ))}
        </div>

        {/* Icons & Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 border-r border-white/10 pr-4 sm:pr-6">
            <button className="text-slate-400 hover:text-white relative transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <User size={20} />
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
            <button className="text-slate-300 hover:text-white text-sm font-semibold px-4 py-2 transition-colors">
              Login
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              Register
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-slate-300 hover:text-white flex items-center gap-4 text-lg font-medium">
                {link.icon}
                {link.name}
              </a>
            ))}
            <hr className="border-white/5" />
            <div className="flex flex-col gap-4">
              <button className="text-white font-semibold py-3 border border-white/10 rounded-xl">Login</button>
              <button className="bg-blue-600 text-white font-bold py-3 rounded-xl">Register</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
