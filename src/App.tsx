import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Brands from './components/Brands';
import Products from './components/Products';
import Reviews from './components/Reviews';
import Faqs from './components/Faqs';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import { Inquiry, InquiryStatus, Brand, Product, AdminLoginLog, Material, WebsiteSettings, FAQ, Review } from './types';
import { brandsData, productsData, initialMaterials, faqsData, defaultWebsiteSettings } from './data';
import { INITIAL_REVIEWS } from './components/Reviews';
import { Sparkles, MessageSquare, PhoneCall } from 'lucide-react';
import { getAccessToken } from './utils/firebase';
import { appendLeadsToSpreadsheet } from './utils/googleSheets';

export default function App() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loginLogs, setLoginLogs] = useState<AdminLoginLog[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(defaultWebsiteSettings);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAdminPanelActive, setIsAdminPanelActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track default selected product in lead modal
  const [preselectedProduct, setPreselectedProduct] = useState<string>('');

  // Load inquiries and brand boxes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('badri_inquiries_logs');
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing stored inquiries:', e);
      }
    } else {
      // Seed some starter inquiries if empty so it doesn't look barren on first load
      const starterLeads: Inquiry[] = [
        {
          id: 'lead-1',
          name: 'Vikas Swamy (Whitefield Developer)',
          email: 'vikas.swamy@gmail.com',
          phone: '98851 40590',
          productInterest: 'Plywood',
          message: 'Need urgent estimates for 40 sheets BWP 19mm plywood for carpentry work.',
          date: '10/06/2026, 02:40 PM',
          status: 'New',
          internalNotes: 'Awaiting phone callback'
        },
        {
          id: 'lead-2',
          name: 'Anjali Sharma (Architect)',
          email: 'anjali.decor@yahoo.com',
          phone: '95420 31102',
          productInterest: 'Blockboards',
          message: 'Please share Pine wood core blockboard pricing lists and thicknesses.',
          date: '09/06/2026, 11:15 AM',
          status: 'Contacted',
          internalNotes: 'Shared rates catalog on WhatsApp'
        }
      ];
      setInquiries(starterLeads);
      localStorage.setItem('badri_inquiries_logs', JSON.stringify(starterLeads));
    }

    // Load brand box configurations
    const savedBrands = localStorage.getItem('badri_brands_data_v3');
    if (savedBrands) {
      try {
        let parsed = JSON.parse(savedBrands);
        if (!Array.isArray(parsed) || parsed.length < 7) {
          setBrands(brandsData);
          localStorage.setItem('badri_brands_data_v3', JSON.stringify(brandsData));
        } else {
          let migrated = false;
          parsed = parsed.map((b: Brand) => {
            if (b.image && b.image.includes('photo-1541123437800-1bb1317badc2')) {
              migrated = true;
              return { ...b, image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600' };
            }
            // Migrate logo to new asset path if it's still the old online image link
            if (b.id === 'brand-1' && !b.logo.includes('greenply_logo')) {
              migrated = true;
              return { ...b, logo: '/src/assets/images/greenply_logo_1783424028897.jpg' };
            }
            if (b.id === 'brand-2' && !b.logo.includes('centuryply_logo')) {
              migrated = true;
              return { ...b, logo: '/src/assets/images/centuryply_logo_1783423169711.jpg' };
            }
            if (b.id === 'brand-3' && !b.logo.includes('drive.google.com')) {
              migrated = true;
              return { 
                ...b, 
                logo: 'https://drive.google.com/thumbnail?sz=w1000&id=1VHBDamwh2kKuhVuhzYdQFZ5V48s4LvjO',
                image: 'https://drive.google.com/thumbnail?sz=w1000&id=1VHBDamwh2kKuhVuhzYdQFZ5V48s4LvjO'
              };
            }
            if (b.id === 'brand-4' && !b.logo.includes('imfa_ply_logo')) {
              migrated = true;
              return { ...b, logo: '/src/assets/images/imfa_ply_logo_1783424054304.jpg' };
            }
            if (b.id === 'brand-5' && !b.logo.includes('wudgrip_logo')) {
              migrated = true;
              return { ...b, logo: '/src/assets/images/wudgrip_logo_1783424079335.jpg' };
            }
            if (b.id === 'brand-6' && !b.logo.includes('neem_ply_logo')) {
              migrated = true;
              return { ...b, logo: '/src/assets/images/neem_ply_logo_1783424066587.jpg' };
            }
            if (b.id === 'brand-7' && !b.logo.includes('fevicol_logo')) {
              migrated = true;
              return { ...b, logo: '/src/assets/images/fevicol_logo_1783423155041.jpg' };
            }
            return b;
          });
          if (migrated) {
            localStorage.setItem('badri_brands_data_v3', JSON.stringify(parsed));
          }
          setBrands(parsed);
        }
      } catch (e) {
        console.error('Error parsing stored brands:', e);
        setBrands(brandsData);
        localStorage.setItem('badri_brands_data_v3', JSON.stringify(brandsData));
      }
    } else {
      setBrands(brandsData);
      localStorage.setItem('badri_brands_data_v3', JSON.stringify(brandsData));
    }

    // Load custom dynamic product catalog listing (keeps exactly 8 by default)
    const savedProducts = localStorage.getItem('badri_products_data_v3');
    if (savedProducts) {
      try {
        let parsed = JSON.parse(savedProducts);
        let migrated = false;
        parsed = parsed.map((p: Product) => {
          if (p.image && p.image.includes('photo-1541123437800-1bb1317badc2')) {
            migrated = true;
            if (p.id === 'hdhmr-supreme-grade') {
              return { ...p, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800' };
            } else {
              return { ...p, image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800' };
            }
          }
          return p;
        });

        // Migration logic for Fire Retardant and Plywood videos
        const hasFireRetardant = parsed.some((p: Product) => p.id === 'ply-fire-retardant');
        const hasVideos = parsed.some((p: Product) => !!p.video);
        if (!hasFireRetardant || !hasVideos) {
          migrated = true;
          // Add missing products like Fire Retardant
          const missing = productsData.filter(d => !parsed.some((p: Product) => p.id === d.id));
          parsed = [...parsed, ...missing];
          // Attach default video attributes to existing items where applicable
          parsed = parsed.map((p: Product) => {
            const fresh = productsData.find(d => d.id === p.id);
            if (fresh && fresh.video && !p.video) {
              return { ...p, video: fresh.video, videoName: fresh.videoName };
            }
            return p;
          });
        }

        if (migrated) {
          localStorage.setItem('badri_products_data_v3', JSON.stringify(parsed));
        }
        setProducts(parsed);
      } catch (e) {
        console.error('Error parsing stored products:', e);
        setProducts(productsData);
        localStorage.setItem('badri_products_data_v3', JSON.stringify(productsData));
      }
    } else {
      setProducts(productsData);
      localStorage.setItem('badri_products_data_v3', JSON.stringify(productsData));
    }

    // Load admin login logs
    const savedLogs = localStorage.getItem('badri_admin_login_logs');
    if (savedLogs) {
      try {
        setLoginLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Error parsing stored login logs:', e);
      }
    }

    // Load materials list
    const savedMaterials = localStorage.getItem('badri_materials_list');
    if (savedMaterials) {
      try {
        setMaterials(JSON.parse(savedMaterials));
      } catch (e) {
        console.error('Error parsing stored materials:', e);
        setMaterials(initialMaterials);
        localStorage.setItem('badri_materials_list', JSON.stringify(initialMaterials));
      }
    } else {
      setMaterials(initialMaterials);
      localStorage.setItem('badri_materials_list', JSON.stringify(initialMaterials));
    }

    // Load customizable website settings locally first to avoid flicker
    const savedSettings = localStorage.getItem('badri_website_settings');
    if (savedSettings) {
      try {
        setWebsiteSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing website settings:', e);
      }
    } else {
      setWebsiteSettings(defaultWebsiteSettings);
    }

    // Then, fetch fresh values from server to keep everything updated with what's saved on disk
    fetch('/api/website-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          setWebsiteSettings(data.settings);
          localStorage.setItem('badri_website_settings', JSON.stringify(data.settings));
        }
      })
      .catch((err) => {
        console.error('Error fetching server website settings:', err);
      });

    // Load FAQs
    const savedFaqs = localStorage.getItem('badri_faqs_list');
    if (savedFaqs) {
      try {
        setFaqs(JSON.parse(savedFaqs));
      } catch (e) {
        console.error('Error parsing FAQs:', e);
      }
    } else {
      setFaqs(faqsData);
      localStorage.setItem('badri_faqs_list', JSON.stringify(faqsData));
    }

    // Load customer reviews
    const savedReviews = localStorage.getItem('badri_customer_reviews_v1');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error('Error parsing reviews:', e);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('badri_customer_reviews_v1', JSON.stringify(INITIAL_REVIEWS));
    }

    // Welcomeness popup trigger
    const hasBeenWelcomed = localStorage.getItem('badri_welcomed_v2');
    if (!hasBeenWelcomed) {
      const enterTimer = setTimeout(() => {
        setIsLeadModalOpen(true);
        localStorage.setItem('badri_welcomed_v2', 'true');
      }, 1500); // 1.5 second delay after loading
      return () => clearTimeout(enterTimer);
    }
  }, []);

  // Update a brand column card
  const handleUpdateBrand = (updatedBrand: Brand) => {
    const updated = brands.map(b => b.id === updatedBrand.id ? updatedBrand : b);
    setBrands(updated);
    localStorage.setItem('badri_brands_data_v3', JSON.stringify(updated));
  };

  // Reset to original brand listings
  const handleResetBrands = () => {
    setBrands(brandsData);
    localStorage.setItem('badri_brands_data_v3', JSON.stringify(brandsData));
  };

  // Custom products handlers
  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    localStorage.setItem('badri_products_data_v3', JSON.stringify(updated));
  };

  const handleAddProduct = (newProduct: Product) => {
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('badri_products_data_v3', JSON.stringify(updated));
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('badri_products_data_v3', JSON.stringify(updated));
  };

  const handleResetProducts = () => {
    setProducts(productsData);
    localStorage.setItem('badri_products_data_v3', JSON.stringify(productsData));
  };

  // Dynamic Content Handlers
  const handleUpdateWebsiteSettings = (updated: WebsiteSettings) => {
    setWebsiteSettings(updated);
    localStorage.setItem('badri_website_settings', JSON.stringify(updated));

    // Persist to backend server so it is permanent and shared across sessions
    fetch('/api/website-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error('Failed to save settings on server:', data.error);
        }
      })
      .catch((err) => {
        console.error('Network error saving settings on server:', err);
      });
  };

  const handleUpdateFaqs = (updated: FAQ[]) => {
    setFaqs(updated);
    localStorage.setItem('badri_faqs_list', JSON.stringify(updated));
  };

  const handleUpdateReviews = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem('badri_customer_reviews_v1', JSON.stringify(updated));
  };

  // Materials handlers
  const handleUpdateMaterials = (updatedMaterials: Material[]) => {
    setMaterials(updatedMaterials);
    localStorage.setItem('badri_materials_list', JSON.stringify(updatedMaterials));
  };

  // Login log handlers
  const handleAddLoginLog = (newLog: Omit<AdminLoginLog, 'id'>) => {
    const freshLog: AdminLoginLog = {
      ...newLog,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    setLoginLogs(prev => {
      const updated = [freshLog, ...prev];
      localStorage.setItem('badri_admin_login_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearLoginLogs = () => {
    setLoginLogs([]);
    localStorage.removeItem('badri_admin_login_logs');
  };

  // Sync to localStorage on change
  const saveInquiries = (updatedList: Inquiry[]) => {
    setInquiries(updatedList);
    localStorage.setItem('badri_inquiries_logs', JSON.stringify(updatedList));
  };

  // Capture Lead Submission
  const handleAddInquiry = (newLead: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    const freshEntry: Inquiry = {
      ...newLead,
      id: `lead_${Date.now()}`,
      date: new Date().toLocaleString('en-IN', { timeZone: 'IST' }),
      status: 'New',
      internalNotes: ''
    };
    const updated = [freshEntry, ...inquiries];
    saveInquiries(updated);

    // Trigger Email Alerts to notify the shop owner of new customer coordinates
    fetch('/api/notify-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: freshEntry.name,
        email: freshEntry.email,
        phone: freshEntry.phone,
        productInterest: freshEntry.productInterest,
        message: freshEntry.message || 'Custom structural materials pricing lookup'
      })
    })
    .then(r => r.json())
    .then(data => {
      console.log('[EMAIL ALERTS] Background notification processed:', data);
    })
    .catch(err => {
      console.error('[EMAIL ALERTS] Error dispatching alerts to server:', err);
    });

    // Check if Google Workspace token is available for real-time automatic sheet logging
    getAccessToken()
      .then((token) => {
        if (token) {
          const savedSheet = localStorage.getItem('badri_google_spreadsheet_info');
          if (savedSheet) {
            try {
              const info = JSON.parse(savedSheet);
              appendLeadsToSpreadsheet(token, info.id, [freshEntry])
                .then(() => {
                  console.log('[SHEETS] Automatically synced new lead to Google Sheet!');
                })
                .catch((err) => {
                  console.error('[SHEETS] Error auto-syncing new lead to Google Sheet:', err);
                });
            } catch (e) {
              console.error('[SHEETS] Failed to parse google spreadsheet info for auto-sync:', e);
            }
          }
        }
      })
      .catch((err) => {
        console.error('[SHEETS] Error getting Google access token:', err);
      });
  };

  // Update workflow status
  const handleUpdateStatus = (id: string, status: InquiryStatus) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, status } : i);
    saveInquiries(updated);
  };

  // Update internal memo notes
  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, internalNotes: notes } : i);
    saveInquiries(updated);
  };

  // Delete lead record
  const handleDeleteLead = (id: string) => {
    const updated = inquiries.filter(i => i.id !== id);
    saveInquiries(updated);
  };

  // Seed sample leads for testing ease
  const handleSeedSamples = () => {
    const samples: Inquiry[] = [
      {
        id: `mock-1_${Date.now()}`,
        name: 'Rajesh Hegde (RMV Layout)',
        email: 'rajeshhegde@hotmail.com',
        phone: '98450 12345',
        productInterest: 'Doors',
        message: 'Looking for 12 solid pine flush doors with teak natural veneer overlay for my residential construction.',
        date: new Date().toLocaleString('en-IN'),
        status: 'New',
        internalNotes: 'Needs customization'
      },
      {
        id: `mock-2_${Date.now()}`,
        name: 'Pritha Sen (Sobha Apartments)',
        email: 'pritha.creative@gmail.com',
        phone: '91234 56789',
        productInterest: 'Veneers',
        message: 'Interested in teak premium face veneers sheet. Please share Bengaluru pricing.',
        date: new Date().toLocaleString('en-IN'),
        status: 'Contacted',
        internalNotes: 'Contacted over carrier. Emailed pdf list.'
      },
      {
        id: `mock-3_${Date.now()}`,
        name: 'Nitin Kumar (Woodcrafts Bengaluru)',
        email: 'nitin.kumar@woodwork.in',
        phone: '98454 31348',
        productInterest: 'Plywood',
        message: 'Bulk plywood wholesale inquiries for an office layout in Electronic City.',
        date: new Date().toLocaleString('en-IN'),
        status: 'Closed',
        internalNotes: 'Deal finalized. Order dispatched.'
      }
    ];
    const combined = [...samples, ...inquiries];
    saveInquiries(combined);
  };

  // Clear All leads
  const handleClearAllLeads = () => {
    saveInquiries([]);
  };

  const handleOpenEnquireModal = (productInterestName?: string) => {
    if (productInterestName) {
      setPreselectedProduct(productInterestName);
    } else {
      setPreselectedProduct('');
    }
    setIsLeadModalOpen(true);
  };

  const scrollBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = websiteSettings.phone.replace(/[^\d]/g, '');
  const mobileWhatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20Badri%20Enterprises`;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-600 selection:text-white bg-neutral-50">
      
      {/* Top Welcome Alert bar for important shop notifications */}
      <div className="bg-amber-805 bg-amber-900 text-amber-50 text-[11px] sm:text-xs py-2 px-4 text-center font-bold relative z-50 flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-305 text-amber-400" />
        <span>{websiteSettings.announcement}</span>
      </div>

      {/* Sticky Header Navbar */}
      <Navbar 
        onOpenEnquire={() => handleOpenEnquireModal()} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        settings={websiteSettings}
      />

      {/* Primary Layout stream */}
      <main className="flex-1">
        
        {/* Hero Presentational Spotlight with timber-grain layout background */}
        <Hero onOpenEnquire={() => handleOpenEnquireModal('Plywood')} settings={websiteSettings} />

        {/* About Company profile */}
        <About settings={websiteSettings} />

        {/* Six Columns Brand Boxes Section */}
        <Brands 
          brands={brands}
        />

        {/* Dynamic Products Grid with Custom image carousels & detail Specs */}
        <Products 
          products={products}
          onOpenEnquireWithProduct={handleOpenEnquireModal}
          searchQuery={searchQuery}
        />

        {/* Customer Reviews & Feedback with write review interaction */}
        <Reviews reviews={reviews} onUpdateReviews={handleUpdateReviews} />

        {/* Frequently answered questions */}
        <Faqs faqs={faqs} />

        {/* Secondary customer registration card form */}
        <ContactForm onSubmitContactForm={handleAddInquiry} materials={materials} />

        {/* Dynamic Admin dashboard panel: shifted to the last page to fill the scroll */}
        {isAdminPanelActive && (
          <div className="border-t border-amber-100 ring-4 ring-amber-500/20 bg-white" id="admin-panel">
            <AdminPanel 
              inquiries={inquiries}
              onUpdateStatus={handleUpdateStatus}
              onUpdateNotes={handleUpdateNotes}
              onDeleteLead={handleDeleteLead}
              onSeedSampleData={handleSeedSamples}
              onClearAllLeads={handleClearAllLeads}
              brands={brands}
              onUpdateBrand={handleUpdateBrand}
              onResetBrands={handleResetBrands}
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onResetProducts={handleResetProducts}
              loginLogs={loginLogs}
              onAddLoginLog={handleAddLoginLog}
              onClearLoginLogs={handleClearLoginLogs}
              materials={materials}
              onUpdateMaterials={handleUpdateMaterials}
              websiteSettings={websiteSettings}
              onUpdateWebsiteSettings={handleUpdateWebsiteSettings}
              faqs={faqs}
              onUpdateFaqs={handleUpdateFaqs}
              reviews={reviews}
              onUpdateReviews={handleUpdateReviews}
            />
          </div>
        )}

      </main>

      {/* Elegant footer with direct resources */}
      <Footer 
        onOpenEnquire={() => handleOpenEnquireModal()} 
        onScrollToTop={scrollBackToTop}
        settings={websiteSettings}
        isAdminActive={isAdminPanelActive}
        onToggleAdmin={() => {
          const nextState = !isAdminPanelActive;
          setIsAdminPanelActive(nextState);
          if (nextState) {
            // Auto-scroll to view the panel after toggle
            setTimeout(() => {
              const panelRef = document.getElementById('admin-panel');
              if (panelRef) {
                panelRef.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }
        }}
        leadCount={inquiries.filter(i => i.status === 'New').length}
      />

      {/* On Entry dynamic lead collection prompt */}
      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onSubmitLead={handleAddInquiry}
        defaultProduct={preselectedProduct}
        products={products}
      />

      {/* Quick Mobile Sticky bar shortcuts for on-the-go calls */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 md:hidden">
        
        {/* Tap to Call */}
        <a 
          href={`tel:${cleanPhone}`}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-800 text-white shadow-xl hover:bg-amber-900 border border-amber-700 transition"
          title="Direct Telephone"
        >
          <PhoneCall className="h-5 w-5" />
        </a>

        {/* WhatsApp Shortcut */}
        <a
          href={mobileWhatsappUrl}
          target="_blank"
          referrerPolicy="no-referrer"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 border border-emerald-500 transition"
          title="WhatsApp Shop Help"
        >
          <MessageSquare className="h-5 w-5" />
        </a>
      </div>

    </div>
  );
}
