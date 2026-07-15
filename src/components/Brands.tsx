import React from 'react';
import { motion } from 'motion/react'; // Clean animations as requested
import { Award } from 'lucide-react';
import { Brand } from '../types';

interface BrandsProps {
  brands: Brand[];
}

// Brand colors helper based on brand names
const getBrandColorInfo = (name: string) => {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('greenply')) {
    return {
      border: 'hover:border-emerald-500/80 group-hover:border-emerald-500/50 hover:shadow-emerald-950/20',
      text: 'group-hover:text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
  }
  if (normalizedName.includes('century')) {
    return {
      border: 'hover:border-red-500/80 group-hover:border-red-500/50 hover:shadow-red-950/20',
      text: 'group-hover:text-red-400',
      badge: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
  }
  if (normalizedName.includes('apple')) {
    return {
      border: 'hover:border-rose-500/80 group-hover:border-rose-500/50 hover:shadow-rose-950/20',
      text: 'group-hover:text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };
  }
  if (normalizedName.includes('imfa')) {
    return {
      border: 'hover:border-amber-500/80 group-hover:border-amber-500/50 hover:shadow-amber-950/20',
      text: 'group-hover:text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    };
  }
  if (normalizedName.includes('wudgrip')) {
    return {
      border: 'hover:border-teal-500/80 group-hover:border-teal-500/50 hover:shadow-teal-950/20',
      text: 'group-hover:text-teal-400',
      badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    };
  }
  if (normalizedName.includes('neem')) {
    return {
      border: 'hover:border-lime-500/80 group-hover:border-lime-500/50 hover:shadow-lime-950/20',
      text: 'group-hover:text-lime-400',
      badge: 'bg-lime-500/10 text-lime-450 border-lime-500/20'
    };
  }
  if (normalizedName.includes('fevicol')) {
    return {
      border: 'hover:border-blue-500/80 group-hover:border-blue-500/50 hover:shadow-blue-950/20',
      text: 'group-hover:text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
  }
  return {
    border: 'hover:border-amber-500/80 group-hover:border-amber-500/50 hover:shadow-amber-950/20',
    text: 'group-hover:text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };
};

export default function Brands({ brands }: BrandsProps) {
  return (
    <section id="brands-section" className="py-16 bg-neutral-900 text-white border-b border-neutral-800 relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-4">
            <Award className="h-3.5 w-3.5" />
            <span>Premium Authorized Distribution</span>
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Premium Plywood and Boards Brands
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            We are official direct stockists and wholesale partners for regional elite wooden panel manufacturers. 
            Select authentic standard-certified items with absolute durability assurance.
          </p>
        </div>

        {/* Seven Columns Grid Container for Brand Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-5 font-sans">
          {brands.map((brand, idx) => {
            const colors = getBrandColorInfo(brand.name);

            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`group relative flex flex-col justify-between bg-neutral-850 border border-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 h-full min-h-[300px] ${colors.border}`}
                id={`brand-box-${brand.id}`}
              >
                <div>
                  {/* Image/Logo Box wrapper: Crisp Black Background */}
                  <div className="relative aspect-square w-full bg-black border-b border-neutral-800 overflow-hidden flex items-center justify-center">
                    
                    {/* Centered Brand Logo styled in a crisp square box */}
                    {brand.logo ? (
                      <div className="relative z-10 w-28 h-28 bg-white rounded-xl shadow-lg flex items-center justify-center p-3 border border-neutral-200/20 transition duration-300 transform group-hover:scale-105">
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative z-10 w-28 h-28 bg-neutral-900 border border-neutral-800 rounded-xl shadow-md flex flex-col items-center justify-center p-3 text-center">
                        <span className="text-[10px] font-black text-amber-500 font-mono tracking-wider uppercase">
                          {brand.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand content box - names and descriptions */}
                  <div className="p-4 text-center">
                    <h3 className={`font-sans text-sm font-black text-white transition tracking-wide uppercase line-clamp-1 ${colors.text}`}>
                      {brand.name || 'Set Brand Name'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-3">
                      {brand.tagline || 'Specify the brand characteristics or certification details here.'}
                    </p>
                  </div>
                </div>

                {/* Subdued number ribbon at bottom */}
                <div className="px-4 pb-3 pt-1 border-t border-neutral-800/50 flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-550">
                  <span>SEGMENT 0{idx + 1}</span>
                  <span className={`px-2 py-0.5 rounded border text-[8px] font-black tracking-normal leading-none uppercase ${colors.badge}`}>APPROVED</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
