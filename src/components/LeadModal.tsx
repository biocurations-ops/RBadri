import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Mail, FileText, CheckCircle, Award, Sparkles } from 'lucide-react';
import { Inquiry, Product } from '../types';
import { productsData } from '../data';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (lead: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
  defaultProduct?: string;
  products?: Product[];
}

export default function LeadModal({ isOpen, onClose, onSubmitLead, defaultProduct, products = [] }: LeadModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const activeProducts = products && products.length > 0 ? products : productsData;
  const [product, setProduct] = useState(activeProducts[0]?.title || 'BWP Premium Marine Plywood (IS:710)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Auto-dismiss or reset submitted state after closure/completion
  useEffect(() => {
    if (!isOpen) {
      // Slight delay so the transition finishes before resetting
      const timer = setTimeout(() => {
        setSubmitted(false);
        setError('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Sync chosen defaults when modal is opened or product selected shifts
  useEffect(() => {
    if (isOpen) {
      if (defaultProduct) {
        setProduct(defaultProduct);
      } else if (activeProducts && activeProducts.length > 0) {
        setProduct(activeProducts[0].title);
      }
    }
  }, [isOpen, defaultProduct, activeProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your phone number.');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 8) {
      setError('Please provide a valid phone number (minimum 8 digits).');
      return;
    }
    if (!email.trim() || !email.includes('@') || email.length < 5) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    
    onSubmitLead({
      name,
      email,
      phone,
      productInterest: product,
      message: message || `Expressed interest in premium raw ${product}`,
      internalNotes: `Direct Lead Submission`
    });

    setSubmitted(true);

    // Auto-close after a beautiful confirmation delay
    const timer = setTimeout(() => {
      onClose();
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Top design highlight bar reflecting plywood warmth */}
            <div className="h-2 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-500" />

            <div className="p-6 sm:p-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-400 transition-colors hover:text-neutral-700"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>

              {!submitted ? (
                <>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      Personalized Material Quote &amp; Pricing
                    </div>
                    <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                      Welcome to Badri Enterprises
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                      Please provide your name, phone number, and email address to receive immediate dealer rates, board pricing.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {error && (
                      <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                        ⚠️ {error}
                      </div>
                    )}

                    {/* Name input */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Your Full Name <span className="text-amber-600">*</span></label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                          <User className="h-4.5 w-4.5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ram Kumar / Rajesh Traders"
                          className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-neutral-805 placeholder-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Phone and Email Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="relative">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Phone Number <span className="text-amber-600">*</span></label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                            <Phone className="h-4.5 w-4.5" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 98454 31348"
                            className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-neutral-805 placeholder-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Email Address <span className="text-amber-600">*</span></label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                            <Mail className="h-4.5 w-4.5" />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-neutral-805 placeholder-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit and skip buttons */}
                    <div className="pt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition py-2 underline cursor-pointer"
                      >
                        Skip &amp; browse products first
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all duration-150 transform active:scale-98 shadow-md shadow-amber-900/10 hover:shadow-lg cursor-pointer"
                      >
                        Submit Quote Request
                      </button>
                    </div>
                  </form>

                  {/* Reassurance badges */}
                  <div className="mt-6 border-t border-neutral-100 pt-4 flex gap-6 justify-center text-center">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <Award className="h-4 w-4 text-amber-600" />
                      <span className="text-xs text-neutral-600">Certified Quality &amp; Warranty</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs text-neutral-600">3000+ Happy Customers</span>
                    </div>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-bold text-neutral-900">
                    Thank You, {name}!
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 max-w-sm mx-auto">
                    Your request for quotes on <strong className="text-amber-800 font-medium">{product}</strong> has been received. Our Bengaluru office will contact you shortly!
                  </p>
                  <div className="mt-6 border-t border-neutral-100 pt-4 max-w-xs mx-auto">
                    <p className="text-xs text-neutral-400 italic">
                      Closing in a second...
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
