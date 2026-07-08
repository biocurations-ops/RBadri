import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Navigation2 } from 'lucide-react';
import { Inquiry, Material } from '../types';
import { initialMaterials } from '../data';

interface ContactFormProps {
  onSubmitContactForm: (lead: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
  materials?: Material[];
}

export default function ContactForm({ onSubmitContactForm, materials = [] }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const activeMaterials = materials && materials.length > 0 ? materials : initialMaterials;
  const [product, setProduct] = useState(activeMaterials[0]?.name || 'PWP');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Sync state if materials list updates or finishes loading
  useEffect(() => {
    if (activeMaterials && activeMaterials.length > 0) {
      setProduct((prev) => {
        // If previous choice is still valid, keep it; otherwise default to the first active material
        const isValid = activeMaterials.some(m => m.name === prev);
        return isValid ? prev : activeMaterials[0].name;
      });
    }
  }, [activeMaterials]);

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
    
    onSubmitContactForm({
      name,
      email,
      phone,
      productInterest: `${product} (via Contact Form)`,
      message: message || 'Plywood material pricing request',
      internalNotes: `Direct Form Submission`
    });

    setSubmitted(true);

    // Reset Form Fields after a quick delay
    const timer = setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 4500);
    return () => clearTimeout(timer);
  };

  return (
    <section id="contact" className="py-20 bg-neutral-50 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-800">
            <MapPin className="h-4.5 w-4.5" />
            <span>Bengaluru Showroom</span>
          </div>
          <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Request Plywood Quotation
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600">
            Visit our physical location or submit an electronic inquiry sheet below. Get a direct warranty card and custom package pricing for bulk plywood &amp; board purchases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left panel: Store Details and Maps Location */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-neutral-900">
                Badri Enterprises Showroom
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We distribute our premium plywood materials across all Bengaluru urban territories. Come visit us to touch, feel and inspect our raw plywood sheets, blockboards, and flush plywood doors.
              </p>

              {/* Action Info entries */}
              <div className="space-y-4 pt-2">
                
                {/* Physical Address */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-880 border border-amber-500/15">
                    <MapPin className="h-5 w-5 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-405 uppercase tracking-widest">Main Store Front</h4>
                    <p className="text-sm font-semibold text-neutral-900 mt-0.5">Badri Enterprises</p>
                    <p className="text-xs text-neutral-600">Bengaluru, Karnataka, India</p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-880 border border-amber-500/15">
                    <Phone className="h-5 w-5 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-405 uppercase tracking-widest">Hotline Phone</h4>
                    <p className="text-sm font-semibold mt-0.5">
                      <a href="tel:9845431348" className="text-amber-800 hover:underline">
                        98454 31348
                      </a>
                    </p>
                    <p className="text-xs text-neutral-600">Give us a call to request bulk plywood quotes</p>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-880 border border-amber-500/15">
                    <Clock className="h-5 w-5 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-405 uppercase tracking-widest">Trading Hours</h4>
                    <p className="text-xs font-semibold text-neutral-900 mt-0.5">Monday – Saturday: 9:00 AM to 7:30 PM</p>
                    <p className="text-xs text-neutral-600">Sundays: Pre-planned bulk dealer orders only</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Google Map location CTA Card */}
            <div className="bg-amber-850 bg-amber-900 rounded-2xl p-6 text-white border border-amber-950 shadow-md">
              <span className="text-[10px] bg-neutral-950/20 text-amber-300 rounded px-2 py-0.5 font-bold uppercase tracking-wider">
                Store Location Link
              </span>
              <h4 className="font-serif text-lg font-bold mt-2.5">Visit Our Showroom Map</h4>
              <p className="text-xs text-amber-100 mt-1.5 leading-relaxed">
                Ensure you receive the absolute 100% genuine warranty plywood materials. Locate our exact showroom address easily.
              </p>
              
              <div className="mt-4 pt-3 border-t border-amber-700/50 flex flex-wrap gap-3 items-center justify-between">
                <span className="text-xs text-amber-250">Call: 98454 31348</span>
                <a
                  href="https://share.google/YqYMcgeusFWRM9rvv"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 px-4 py-2 text-xs font-black transition shadow-sm cursor-pointer"
                >
                  <Navigation2 className="h-3.5 w-3.5 text-amber-800 fill-amber-800" />
                  <span>Visit Our Location 📍</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right panel: Digital Quotation / Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="border-b border-neutral-150 pb-4 mb-6">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Dealer Pricing Inquiry</span>
                <h3 className="font-serif text-xl font-bold text-neutral-900 mt-1">Get wholesale rates for Plywood, blockboards, and doors</h3>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Your Full Name <span className="text-amber-600">*</span></label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-xs text-neutral-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>

                  {/* Phone & Email Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Primary Mobile <span className="text-amber-600">*</span></label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98454 31348"
                        className="w-full rounded-lg border border-neutral-200 p-2.5 text-xs text-neutral-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Email Address <span className="text-amber-600">*</span></label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramesh@gmail.com"
                        className="w-full rounded-lg border border-neutral-200 p-2.5 text-xs text-neutral-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                  </div>

                  {/* Material Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Primary Material Choice</label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-xs text-neutral-800 outline-none bg-white focus:border-amber-500 font-semibold"
                    >
                      {activeMaterials.map((mat) => (
                        <option key={mat.id} value={mat.name}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Estimate details (sheets count, thickness, delivery site address)</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. I require about 35 sheets of 19mm BWP Plywood and 10 solid core flush doors delivered to Whitefield, Bengaluru..."
                      className="w-full rounded-lg border border-neutral-200 p-3 text-xs text-neutral-800 resize-none outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold py-3 px-6 rounded-lg text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Send className="h-4 w-4 text-amber-400" />
                      <span>Request Material Rates</span>
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center text-neutral-800"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-neutral-900">Inquiry Received</h4>
                  <p className="text-xs text-neutral-600 mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for connecting with Badri Enterprises. We have registered your details. Our plywood desk executive on <strong>98454 31348</strong> will call you back with verified material prices.
                  </p>
                  <p className="text-[10px] text-neutral-400 italic mt-6">
                    Form resetting...
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom trust footer */}
            <div className="mt-8 border-t border-neutral-100 pt-4 flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              <span>Trusted Plywood Wholesale Dealer</span>
              <span className="text-amber-800">Direct From Bengaluru Hub</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
