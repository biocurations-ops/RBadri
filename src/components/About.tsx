import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Medal, Compass, Users2, BadgePercent, Gem } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface AboutProps {
  settings?: WebsiteSettings;
}

export default function About({ settings }: AboutProps) {
  
  const reasons = [
    {
      title: 'Warranty & Guarantee',
      description: 'Receive authentic physical registration cards protectable for up to lifetime termite-proofing directly from brands.',
      icon: Medal
    },
    {
      title: 'Plywood & Board Stock',
      description: 'Check our exclusive premium range: Plywood, Pine board, Flush doors, MDF, HMR, HDHMR, WPC, Laminates, and Fevicol.',
      icon: Compass
    },
    {
      title: 'Competitive Prices',
      description: 'Get transparent wholesale dealer pricing whether you need a single flush door block or bulk apartment volumes.',
      icon: BadgePercent
    },
    {
      title: 'Professional Support',
      description: 'Consult with raw plywood experts directly on phone support to determine your optimal plywood thicknesses.',
      icon: Gem
    },
    {
      title: '3000+ Happy Customers',
      description: 'A stellar record of supplying local carpenters, architects, house builders, and plywood contractors in Bengaluru.',
      icon: Users2
    }
  ];

  return (
    <section id="about" className="py-20 bg-white scroll-mt-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Company profile split block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Profile Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
              <Award className="h-4 w-4" />
              <span>{settings?.aboutTagline || "Strength. Durability. Guaranteed."}</span>
            </div>

            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              {settings?.aboutTitle || "About Badri Enterprises"}
            </h2>
            
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {settings?.aboutPara1 || "At Badri Enterprises, we supply Plywood, Pine board, Flush doors, MDF, HMR, HDHMR, WPC, Laminates, Fevicol, etc. Driven by reliability, we are proud distributors of high-quality premium plywood & boards in Bengaluru."}
            </p>
            
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              {settings?.aboutPara2 || "We supply top-tier architects, developers, interior carpenters, and house builders across Bengaluru with certified structural materials that stand the test of time."}
            </p>

            <div className="border-l-4 border-amber-600 pl-4 italic text-sm text-neutral-750 bg-amber-50/30 py-3 rounded-r-lg">
              “Driven by reliability, we on-board premium boards and customer-trusted materials.”
            </div>
          </div>

          {/* Visual Presentation Column */}
          <div className="lg:col-span-12 xl:col-span-5 relative">
            <div className="aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800"
                alt="Badri Enterprises plywood storage and warehouse delivery stacks"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -right-6 bg-neutral-900 text-white rounded-xl p-5 shadow-lg max-w-xs hidden sm:block">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">Premium Plywood Selection</h4>
              <p className="text-[11px] text-neutral-300 mt-1">Direct stockist of premium grade IS:710 Marine Plywood, Pine board, Flush doors, MDF, HMR, HDHMR, and Laminates.</p>
            </div>
          </div>

        </div>

        {/* 'Why Choose Us' Grid of Core Strengths */}
        <div className="mt-24 border-t border-neutral-100 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="font-serif text-2xl font-bold text-neutral-900">Why Bengaluru Chooses Badri Enterprises</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Our dealer values are framed around lumber longevity, strict quality grading, and complete certification clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((r, idx) => {
              const IconComp = r.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="p-6 rounded-xl border border-neutral-100 bg-white hover:border-amber-500/20 hover:shadow-sm transition duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-850 border border-amber-500/10">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 font-serif text-base font-bold text-neutral-900">
                    {r.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {r.description}
                  </p>
                </motion.div>
                );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
