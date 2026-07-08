import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { faqsData } from '../data';
import { FAQ } from '../types';

interface FaqsProps {
  faqs?: FAQ[];
}

export default function Faqs({ faqs }: FaqsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = faqs || faqsData;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 bg-neutral-900 text-white scroll-mt-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,119,6,0.06),transparent_60%)] pointer-events-none" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/15">
            <HelpCircle className="h-4 w-4" />
            <span>Plywood &amp; Interior FAQ Guide</span>
          </div>
          <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-white">
            Frequently Asked Timber Questions
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Review critical structural indicators. Let our technical guidelines help you decide the best options for kitchen cabinets, luxury doors, or furniture base sheets.
          </p>
        </div>

        {/* Faqs List */}
        <div className="space-y-4">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-850 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-sm sm:text-base text-white hover:text-amber-400 focus:outline-none transition group"
                >
                  <span>{faq.question}</span>
                  <div className="ml-4 shrink-0 rounded-full bg-neutral-800 p-1.5 text-neutral-400 group-hover:text-amber-400 transition">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-neutral-800/60 text-xs sm:text-sm text-neutral-300 leading-relaxed explanation-body">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more help support block */}
        <div className="mt-12 text-center">
          <p className="text-xs text-neutral-500">
            Have a project-specific plywood dimension dilemma? We have consultants available for phone estimation.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <a
              href="tel:9845431348"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-850 px-4 py-2 text-xs font-bold text-neutral-200 transition"
            >
              📞 Call Showroom (98454 31348)
            </a>
            <a
              href="https://wa.me/919845431348?text=Hello%20Badri%20Enterprises,%20I%20have%20a%20technical%20question%2520about%2520your%2520plywood%2520materials."
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition"
            >
              💬 WhatsApp Query
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
