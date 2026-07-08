import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PackageCheck, Eye, CheckCircle2, PhoneCall, Camera, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Video, Play
} from 'lucide-react';
import { Product } from '../types';
import { productsData } from '../data';
import { compressAndResizeImage } from '../utils';

interface ProductsProps {
  products?: Product[];
  onOpenEnquireWithProduct: (productName: string) => void;
  searchQuery?: string;
  isAdminActive?: boolean;
}

// Stateful inner component to manage local image carousels independently
function ProductCard({ 
  product, 
  onSpecsClick, 
  onEnquireClick,
  customProductImageMap,
  onImageUpload,
  onResetImage
}: { 
  product: Product; 
  onSpecsClick: () => void; 
  onEnquireClick: () => void;
  customProductImageMap: Record<string, string>;
  onImageUpload: (productId: string, file: File) => void;
  onResetImage: (productId: string) => void;
  key?: string;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Group all available images
  const imagesList: string[] = [];
  
  // 1. If multiple images are explicitly defined in product object, add them
  if (product.images && product.images.length > 0) {
    imagesList.push(...product.images);
  } else {
    // 2. Otherwise fallback to custom uploaded single image or primary default image
    imagesList.push(customProductImageMap[product.id] || product.image);
  }

  const hasMultipleImages = imagesList.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col justify-between overflow-hidden rounded-xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition duration-300"
    >
      {/* Product Image Box & Carousel */}
      <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
        <img
          src={imagesList[activeImageIndex] || 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800'}
          alt={`${product.title} view ${activeImageIndex + 1}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Category Badge */}
        <div className="absolute top-2 left-2 rounded-md bg-neutral-900/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400 z-10">
          {product.category}
        </div>

        {/* Video available indicator badge */}
        {product.video && (
          <div className="absolute bottom-2 left-2 rounded-md bg-amber-600/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white flex items-center gap-1 z-10 shadow-sm transition">
            <Play className="h-2.5 w-2.5 fill-white" />
            <span>Watch Video</span>
          </div>
        )}

        {/* Image index numbering widget (e.g. 1/3) */}
        {hasMultipleImages && (
          <div className="absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-mono font-bold text-neutral-305 text-white z-10">
            {activeImageIndex + 1} / {imagesList.length}
          </div>
        )}

        {/* Carousel overlay Left / Right chevrons */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white transition z-10 cursor-pointer border border-white/5 active:scale-90"
              title="Previous material photo"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white transition z-10 cursor-pointer border border-white/5 active:scale-90"
              title="Next material photo"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        {/* Small floating carousel dot indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {imagesList.map((_, i) => (
              <span 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'w-3.5 bg-amber-400' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        )}


      </div>

      {/* Product Text Details */}
      <div className="flex-1 p-5">
        <h3 className="font-serif text-base font-bold text-neutral-900 group-hover:text-amber-800 transition line-clamp-1 pb-1">
          {product.title}
        </h3>
        <p className="mt-1 text-xs text-neutral-600 line-clamp-3">
          {product.description}
        </p>

        {/* Bullet Highlights */}
        <div className="mt-4 space-y-1.5">
          {product.features.slice(0, 3).map((f, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-neutral-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="border-t border-neutral-100 p-4 bg-neutral-50/50 flex gap-2">
        <button
          onClick={onSpecsClick}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-700 py-2.5 transition cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-neutral-500" />
          <span>Specs &amp; Photos</span>
        </button>
        
        <button
          onClick={onEnquireClick}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold py-2.5 transition cursor-pointer"
        >
          <PhoneCall className="h-3.5 w-3.5 text-amber-300" />
          <span>Enquire</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function Products({ 
  products = [], 
  onOpenEnquireWithProduct, 
  searchQuery = '' 
}: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [modalActiveImageIndex, setModalActiveImageIndex] = useState(0);
  const [modalMediaTab, setModalMediaTab] = useState<'photos' | 'video'>('photos');

  // use props.products if available, else load fallback
  const activeProducts = products && products.length > 0 ? products : productsData;

  // custom upload map for default single image swaps
  const [customProductImageMap, setCustomProductImageMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('badri_custom_product_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleImageUpload = async (productId: string, file: File) => {
    try {
      const base64String = await compressAndResizeImage(file, 500, 500, 0.82);
      const updatedMap = { ...customProductImageMap, [productId]: base64String };
      setCustomProductImageMap(updatedMap);
      localStorage.setItem('badri_custom_product_images', JSON.stringify(updatedMap));
    } catch (err) {
      console.error('Failed to process and compress uploaded product image:', err);
    }
  };

  const handleResetImage = (productId: string) => {
    const updatedMap = { ...customProductImageMap };
    delete updatedMap[productId];
    setCustomProductImageMap(updatedMap);
    localStorage.setItem('badri_custom_product_images', JSON.stringify(updatedMap));
  };

  // Dynamically compute existing categories
  const categories: string[] = ['All'];
  activeProducts.forEach(p => {
    if (p.category && !categories.includes(p.category)) {
      categories.push(p.category);
    }
  });

  const filteredProducts = activeProducts
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    });

  // Collect modal galleries
  const modalImagesList: string[] = [];
  if (selectedProductDetails) {
    if (selectedProductDetails.images && selectedProductDetails.images.length > 0) {
      modalImagesList.push(...selectedProductDetails.images);
    } else {
      modalImagesList.push(customProductImageMap[selectedProductDetails.id] || selectedProductDetails.image);
    }
  }

  return (
    <section id="products" className="py-20 bg-neutral-50 scroll-mt-12 border-t border-neutral-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <PackageCheck className="h-3.5 w-3.5" />
            Verified Wholesale Product Catalog
          </div>
          <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Premium Plywood &amp; Boards
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600">
            We supply high-density seasoned Commercial/MR Plywoods, Marine BWP, Water Resistant, PineWood Boards, Solid Flush Doors, Laminates,WPC and other Materials. Explore our dynamic inventory.
          </p>
        </div>

        {/* Category filtering tab strip */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-800 text-white shadow-md shadow-amber-800/10'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat === 'All' ? '🔥 All Materials' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div 
          layout
          className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSpecsClick={() => {
                  setModalActiveImageIndex(0);
                  setModalMediaTab('photos');
                  setSelectedProductDetails(p);
                }}
                onEnquireClick={() => onOpenEnquireWithProduct(p.title)}
                customProductImageMap={customProductImageMap}
                onImageUpload={handleImageUpload}
                onResetImage={handleResetImage}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Specifications & Multiple Images Slideshow Dialog Modal */}
        <AnimatePresence>
          {selectedProductDetails && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProductDetails(null)}
                className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
              >
                <div className="h-2 bg-amber-800" />
                
                <div className="p-6 sm:p-8">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedProductDetails(null)}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 font-bold text-lg p-1.5 focus:outline-none"
                    title="Close Specs"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col gap-5 sm:flex-row">
                    {/* Sliding Primary Interactive Frame */}
                    <div className="w-full sm:w-1/2 flex flex-col gap-2">
                      
                      {/* Media switcher tabs */}
                      <div className="flex gap-2 border-b border-neutral-100 pb-2 mb-1">
                        <button
                          type="button"
                          onClick={() => setModalMediaTab('photos')}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer text-center ${
                            modalMediaTab === 'photos'
                              ? 'bg-amber-800 text-white shadow-xs'
                              : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          📸 Photos ({modalImagesList.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalMediaTab('video')}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer text-center flex items-center justify-center gap-1 ${
                            modalMediaTab === 'video'
                              ? 'bg-amber-800 text-white shadow-xs'
                              : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          🎥 Video Demo
                          {selectedProductDetails.video && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </button>
                      </div>

                      {modalMediaTab === 'photos' ? (
                        <>
                          <div className="aspect-video sm:aspect-square overflow-hidden rounded-xl bg-neutral-900 border border-neutral-100 relative flex items-center justify-center">
                            <img
                              src={modalImagesList[modalActiveImageIndex] || 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800'}
                              alt={`${selectedProductDetails.title} premium detail`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Left / Right switches on dialog image */}
                            {modalImagesList.length > 1 && (
                              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalActiveImageIndex(modalActiveImageIndex === 0 ? modalImagesList.length - 1 : modalActiveImageIndex - 1);
                                  }}
                                  className="pointer-events-auto h-7 w-7 rounded-full bg-neutral-950/80 hover:bg-neutral-950 text-white flex items-center justify-center shadow transition"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalActiveImageIndex(modalActiveImageIndex === modalImagesList.length - 1 ? 0 : modalActiveImageIndex + 1);
                                  }}
                                  className="pointer-events-auto h-7 w-7 rounded-full bg-neutral-950/80 hover:bg-neutral-950 text-white flex items-center justify-center shadow transition"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Multiphoto Thumbnail Slider option list */}
                          {modalImagesList.length > 1 && (
                            <div>
                              <p className="text-[10px] text-neutral-400 font-bold mb-1 ml-0.5 uppercase tracking-wider">Product Catalog Photos ({modalImagesList.length})</p>
                              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                                {modalImagesList.map((imgUrl, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setModalActiveImageIndex(idx)}
                                    className={`h-11 w-11 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0 transition border-2 ${
                                      idx === modalActiveImageIndex ? 'border-amber-600 scale-95 shadow-sm' : 'border-transparent hover:border-neutral-300'
                                    }`}
                                  >
                                    <img
                                      src={imgUrl}
                                      alt="thumbnail"
                                      className="h-full w-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="aspect-video sm:aspect-square overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800 relative flex flex-col items-center justify-center p-4">
                          {selectedProductDetails.video ? (
                            <video
                              src={selectedProductDetails.video}
                              controls
                              playsInline
                              autoPlay
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center p-6 flex flex-col items-center justify-center gap-3">
                              <span className="text-3xl">📹</span>
                              <p className="font-bold text-xs text-neutral-300">No Video Demonstration</p>
                              <p className="text-[10px] text-neutral-500 max-w-[200px] leading-relaxed">
                                Upload a video or enter a video URL for this product block in the Admin Panel.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                        {selectedProductDetails.category} Section
                      </span>
                      <h3 className="mt-2.5 font-serif text-lg font-bold text-neutral-900 leading-tight">
                        {selectedProductDetails.title}
                      </h3>
                      <p className="mt-2 text-xs text-neutral-600 leading-relaxed text-left">
                        {selectedProductDetails.longDescription}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-5 border-t border-neutral-100 pt-4">
                    <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider mb-2">
                      Premium Quality Assurances:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProductDetails.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-700">
                          <span className="text-amber-800 font-bold shrink-0">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical specs table */}
                  {selectedProductDetails.specs && Object.keys(selectedProductDetails.specs).length > 0 && (
                    <div className="mt-5 border-t border-neutral-100 pt-4">
                      <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider mb-2">
                        Official Specifications &amp; Sizing:
                      </h4>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2 text-xs">
                        {Object.entries(selectedProductDetails.specs).map(([key, val]) => (
                          <div key={key} className="flex justify-between border-b border-neutral-50 py-1">
                             <dt className="font-semibold text-neutral-500">{key}</dt>
                             <dd className="text-neutral-800 text-right font-medium">{val}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* Modal bottom actions */}
                  <div className="mt-6 border-t border-neutral-100 pt-4 flex justify-end gap-3.5">
                    <button
                      onClick={() => setSelectedProductDetails(null)}
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 py-2 px-4 rounded-lg"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const productTitle = selectedProductDetails.title;
                        setSelectedProductDetails(null);
                        onOpenEnquireWithProduct(productTitle);
                      }}
                      className="rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-black text-xs py-2 px-5 transition cursor-pointer shadow"
                    >
                      Enquire for Pricing
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
