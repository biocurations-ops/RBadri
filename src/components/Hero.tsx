import React from 'react';
import { motion } from 'motion/react';
import { Award, Zap, Shield, ArrowUpRight } from 'lucide-react';

import { WebsiteSettings } from '../types';

interface HeroProps {
  onOpenEnquire: () => void;
  settings?: WebsiteSettings;
}

export default function Hero({ onOpenEnquire, settings }: HeroProps) {
  return (
    <div 
      className="relative overflow-hidden bg-neutral-950 text-white bg-cover bg-center"
      style={{ 
        backgroundImage: "linear-gradient(to bottom, rgba(10, 10, 10, 0.88), rgba(23, 23, 23, 0.95)), url('https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=1600')" 
      }}
    >
      {/* Decorative radial warm amber overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(217,119,6,0.12),transparent_60%)] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/20"
            >
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Bengaluru's Trusted Plywood Supplier</span>
            </motion.div>
 
            {/* Core Display Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight"
              >
                {settings?.heroHeading || "Premium Heavy-Duty Plywood & Boards"}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-xs sm:text-base text-neutral-300 leading-relaxed"
              >
                {settings?.heroSubheading || "At Badri Enterprises, we supply Plywood, Pine board, Flush doors, MDF, HMR, HDHMR, WPC, Laminates, Fevicol, etc. Driven by reliability, we are proud distributors of high-quality premium Plywood & Boards in Bengaluru."}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-xs text-amber-500/90 font-medium flex items-center gap-2"
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>{settings?.heroBadge || "Wholesale and retail supplier of premium-grade plywood and blockboards in Bengaluru."}</span>
              </motion.div>
            </div>

            {/* CTA action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onOpenEnquire}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-7 py-3.5 text-sm transition shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-0.5 transform duration-150 cursor-pointer"
              >
                <span>{settings?.heroCtaText || "Get Wholesaler Pricing"}</span>
                <ArrowUpRight className="h-4.5 w-4.5" />
              </button>

              <a
                href="#products"
                className="flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/30 hover:bg-neutral-800 text-white font-semibold px-7 py-3.5 text-sm transition hover:border-neutral-500 cursor-pointer"
              >
                View Plywood Grades
              </a>
            </motion.div>

            {/* Showcase Stat Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 border-t border-neutral-800/80 pt-8"
            >
              <div>
                <span className="block font-serif text-2xl font-black text-amber-500 sm:text-3.5xl">3,000+</span>
                <span className="mt-1 block text-xs text-neutral-400 font-medium uppercase tracking-wider">Happy Homes Supplied</span>
              </div>
              <div className="border-x border-neutral-800/80 px-4">
                <span className="block font-serif text-2xl font-black text-amber-500 sm:text-3.5xl">100%</span>
                <span className="mt-1 block text-xs text-neutral-400 font-medium uppercase tracking-wider">Genuine Product</span>
              </div>
              <div className="pl-2">
                <span className="block font-serif text-2xl font-black text-amber-500 sm:text-3.5xl">Bengaluru</span>
                <span className="mt-1 block text-xs text-neutral-400 font-medium uppercase tracking-wider">Trusted Dealer</span>
              </div>
            </motion.div>

          </div>

          {/* Visual Presentation Column */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              className="relative overflow-hidden rounded-2xl bg-neutral-900/60 p-6 border border-neutral-800/80 backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 p-3 text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 rounded-bl-xl border-l border-b border-amber-500/10">
                PLYWOOD Product Closeup
              </div>

              {/* Showcase Image overlay */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-950 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800"
                  alt="High Quality Veneer Plywood Finished Sheet"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Premium Finished Plywood</span>
                  <p className="text-xs text-neutral-200 mt-0.5">Calibrated Smooth Surface Ready for Veneers &amp; Polish</p>
                </div>
              </div>

              {/* Bullet Features Grid */}
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-widest">Strength. Durability &amp; Warranty</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                      <Shield className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Premium Plywood Grades</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">Direct stockist of BWP Marine plywood and premium grade sheets with original brand warranty.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                      <Zap className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Approved Material Range</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">We supply Plywood, Pine board, Flush doors, MDF, HMR, HDHMR, WPC, Laminates, and Fevicol.</p>
                    </div>
                  </div>
                </div>

                {/* Friendly trust footnote */}
                <div className="mt-4 border-t border-neutral-800/80 pt-4 flex justify-between items-center text-xs text-neutral-400">
                  <span>Contact: <strong className="text-neutral-200 font-semibold">98454 31348</strong></span>
                  <span className="text-amber-500">★ ★ ★ ★ ★</span>
                </div>
              </div>

            </motion.div>

            {/* Glowing blur ball */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-600/15 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </div>
  );
}
