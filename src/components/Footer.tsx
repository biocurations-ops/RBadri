import React from 'react';
import { Landmark, ArrowUp, MessageSquare, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { Inquiry, WebsiteSettings } from '../types';

interface FooterProps {
  onOpenEnquire: () => void;
  onScrollToTop: () => void;
  settings?: WebsiteSettings;
  isAdminActive: boolean;
  onToggleAdmin: () => void;
  leadCount: number;
}

export default function Footer({ onOpenEnquire, onScrollToTop, settings, isAdminActive, onToggleAdmin, leadCount }: FooterProps) {
  
  const benefits = [
    'Premium Branded Plywood',
    'Genuine Products with Warranty & Guarantee',
    'Trusted Dealer for Quality Plywood & Boards',
    'Comprehensive Plywood Stock',
    'Competitive Wholesaler Prices',
    'Professional Direct Support',
    'More Than 3000+ Happy Customers'
  ];

  const cleanPhone = (settings?.phone || "9845431348").replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20Badri%20Enterprises`;

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top summary benefits grid */}
        <div className="border-b border-neutral-800/60 pb-12">
          <h3 className="font-serif text-lg font-bold text-center text-amber-400 mb-8 uppercase tracking-widest text-[11px]">
            Why Bengaluru Chooses {settings?.storeName || "Badri Enterprises"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.slice(0, 4).map((b, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
                <span className="text-emerald-500 font-bold text-lg">✔️</span>
                <span className="text-xs font-semibold text-neutral-200">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-12 border-b border-neutral-800/60">
          
          {/* Brand Introduction */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 font-sans text-xs font-black text-white border border-amber-400/30">
                <span className="tracking-tight">
                  {settings?.storeName 
                    ? settings.storeName.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
                    : "BE"
                  }
                </span>
              </div>
              <div>
                <span className="block font-serif text-base font-bold tracking-tight">{settings?.storeName || "BADRI ENTERPRISES"}</span>
                <span className="block text-[9px] tracking-widest text-amber-500 uppercase font-medium">{settings?.storeSubName || "Bengaluru Plywood Core"}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {settings?.aboutPara1 || "At Badri Enterprises, we supply Plywood, Pine board, Flush doors, MDF, HMR, HDHMR, WPC, Laminates, Fevicol, etc. We offer premium structural panel materials with direct wholesale supply and straightforward pricing."}
            </p>

            <div className="flex gap-2.5 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="p-2 rounded bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30 text-emerald-500 transition"
                title="WhatsApp Direct Hotline"
              >
                <MessageSquare className="h-4.5 w-4.5" />
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="p-2 rounded bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 text-amber-400 transition"
                title="Call Directly"
              >
                <Phone className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Useful Anchor Links */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300">Quick Portal Indices</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#about" className="hover:text-amber-400 transition">Why Choose Badri</a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-amber-400 transition">Plywood FAQs Guide</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition font-bold text-amber-500/90 hover:underline">Get wholesale quote</a>
              </li>
            </ul>
          </div>

          {/* Genuine Links Shared by User */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300 font-serif">Official Shop Resources</h4>
            <div className="space-y-3.5 text-xs">
              
              {/* Maps Location */}
              <div className="bg-neutral-900 p-3.5 rounded-lg border border-neutral-800">
                <span className="text-[9px] uppercase font-bold text-neutral-500 block">Verified Google Maps Location</span>
                <a
                  href="https://share.google/YqYMcgeusFWRM9rvv"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:underline font-semibold mt-1"
                >
                  <span>Visit Our Location 📍</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>



            </div>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="space-y-1.5">
            <p>© 2026 Badri Enterprises. All rights reserved.</p>
            <p className="text-[10px] text-neutral-400">Premium Plywood, Blockboards &amp; Flush Doors wholesale and retail dealer, Bengaluru, India.</p>
            <p className="text-[10px] text-neutral-500 tracking-wide">crafted by <span className="hover:text-amber-400 transition font-medium">Badri Technologies.</span></p>
          </div>

          {/* Scroll to top & Admin Portal button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold border transition cursor-pointer ${
                isAdminActive
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
              title="Admin Lead Log"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Admin Log Portal</span>
              {leadCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white font-bold">
                  {leadCount}
                </span>
              )}
            </button>

            <button
              onClick={onScrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition p-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer"
            >
              <span>Scroll to Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
