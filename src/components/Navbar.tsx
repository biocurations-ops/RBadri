import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Landmark, MessageSquare, ShieldCheck, Mail, Pin, Search } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface NavbarProps {
  onOpenEnquire: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings?: WebsiteSettings;
}

export default function Navbar({ onOpenEnquire, searchQuery, onSearchChange, settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    // Let the route settle, then scroll
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const cleanPhone = (settings?.phone || "9845431348").replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20Badri%20Enterprises`;

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md border-b border-amber-100 py-3' : 'bg-neutral-900 border-b border-neutral-800 text-white py-4'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="flex h-10 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 font-sans text-sm font-black text-white shadow-md shadow-amber-950/20 transition group-hover:from-amber-600 group-hover:to-amber-800 border border-amber-400/30">
              <span className="tracking-tight">
                {settings?.storeName 
                  ? settings.storeName.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
                  : "BE"
                }
              </span>
            </div>
            <div>
              <span className={`block font-serif text-lg font-bold tracking-tight transition ${scrolled ? 'text-neutral-900' : 'text-white'}`}>
                {settings?.storeName || "BADRI ENTERPRISES"}
              </span>
              <span className={`block text-[10px] tracking-wider uppercase font-medium ${scrolled ? 'text-amber-700' : 'text-amber-400'}`}>
                {settings?.storeSubName || "Plywood & Boards Wholesale Dealers"}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 xl:gap-6">
            <button 
              onClick={() => handleNavClick('about')}
              className={`text-xs xl:text-sm font-semibold transition hover:text-amber-500 cursor-pointer ${scrolled ? 'text-neutral-600' : 'text-neutral-300'}`}
            >
              Why Choose Us
            </button>
            <button 
              onClick={() => handleNavClick('brands-section')}
              className={`text-xs xl:text-sm font-semibold transition hover:text-amber-500 cursor-pointer ${scrolled ? 'text-neutral-600' : 'text-neutral-300'}`}
            >
              Brand Gallery
            </button>
            <button 
              onClick={() => handleNavClick('reviews')}
              className={`text-xs xl:text-sm font-semibold transition hover:text-amber-500 cursor-pointer ${scrolled ? 'text-neutral-600' : 'text-neutral-300'}`}
            >
              Reviews
            </button>
            <button 
              onClick={() => handleNavClick('faqs')}
              className={`text-xs xl:text-sm font-semibold transition hover:text-amber-400 cursor-pointer ${scrolled ? 'text-neutral-600' : 'text-neutral-300'}`}
            >
              Plywood Guide
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`text-xs xl:text-sm font-semibold transition hover:text-amber-500 cursor-pointer ${scrolled ? 'text-neutral-600' : 'text-neutral-300'}`}
            >
              Contact
            </button>
          </nav>

          {/* Integrated Search Bar with Functional Search Button */}
          <div className="hidden md:flex items-center gap-1 relative max-w-[190px] xl:max-w-[260px] w-full">
            <div className="relative w-full">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <Search className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                id="navbar-search-input"
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  const productsEl = document.getElementById('products');
                  if (productsEl) {
                    productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`w-full py-1.5 pl-7 xl:pl-8.5 pr-2 text-[11px] xl:text-xs rounded-lg border focus:outline-none transition-all ${
                  scrolled
                    ? 'bg-neutral-55 border-neutral-200 text-neutral-800 placeholder-neutral-400 focus:border-amber-500 focus:bg-white'
                    : 'bg-neutral-800/80 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-500 focus:bg-neutral-800'
                }`}
              />
            </div>
            <button
              onClick={() => {
                const productsEl = document.getElementById('products');
                if (productsEl) {
                  productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                const inputEl = document.getElementById('navbar-search-input');
                if (inputEl) {
                  inputEl.focus();
                }
              }}
              className="px-2.5 py-1.5 rounded-lg text-[10px] xl:text-[11px] font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer shadow-3xs"
              title="Search Catalog"
            >
              Search
            </button>
          </div>

          {/* Action Buttons Shortcut */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Whatsapp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold transition shadow-sm-emerald"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Enquire Now Button */}
            <button
              onClick={onOpenEnquire}
              className="flex items-center gap-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 text-xs font-bold transition shadow-md shadow-amber-600/10"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Enquire</span>
            </button>
          </div>

          {/* Quick Action bar for medium screen sizes (Tablet context) */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
              title="WhatsApp"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
            <button
              onClick={onOpenEnquire}
              className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 text-xs font-bold transition"
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile Hamburguer & Quick Trigger combo */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-600 text-white"
              title="WhatsApp Chat"
            >
              <MessageSquare className="h-4 w-4" />
            </a>

            <button
              onClick={onOpenEnquire}
              className="rounded-lg bg-amber-600 text-white px-3 py-1.5 text-xs font-bold"
            >
              Enquire
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-neutral-800 hover:bg-neutral-100' : 'text-neutral-200 hover:bg-neutral-800'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav className="md:hidden mt-2 bg-white border-t border-amber-50 p-4 space-y-3.5 shadow-lg">
          {/* Quick Search on Mobile */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-100">
            <div className="relative w-full">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  const productsEl = document.getElementById('products');
                  if (productsEl) {
                    productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="w-full py-1.5 pl-8 pr-2 bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs rounded-lg placeholder-neutral-400 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                const productsEl = document.getElementById('products');
                if (productsEl) {
                  productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition"
            >
              Go
            </button>
          </div>

          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left py-1 text-sm font-semibold text-neutral-700 hover:text-amber-600"
          >
            Why Choose Us
          </button>
          <button
            onClick={() => handleNavClick('brands-section')}
            className="block w-full text-left py-1 text-sm font-semibold text-neutral-700 hover:text-amber-600"
          >
            Brand Gallery
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="block w-full text-left py-1 text-sm font-semibold text-neutral-700 hover:text-amber-600"
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavClick('faqs')}
            className="block w-full text-left py-1 text-sm font-semibold text-neutral-700 hover:text-amber-600"
          >
            Plywood Guide
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left py-1 text-sm font-semibold text-neutral-700 hover:text-amber-600"
          >
            Contact
          </button>


        </nav>
      )}
    </header>
  );
}
