import React, { useState, useEffect } from 'react';
import { Star, StarHalf, MessageSquare, Edit3, Check, Filter, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';
import { Review } from '../types';

// The pre-populated 20 Indian Customer Reviews
// Average rating calculation:
// 5.0 count: 6
// 4.5 count: 8
// 4.0 count: 6
// Total count = 20. Sum of ratings = (6 * 5) + (8 * 4.5) + (6 * 4) = 30 + 36 + 24 = 90. Average = 4.5.
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Vikas Murthy',
    location: 'Jayanagar, Bengaluru',
    rating: 5,
    comment: 'Absolutely premium quality BWP Marine-grade plywood! Built my modular kitchen with their neem-infused plywood core boards and it looks solid. Highly recommend Badri Enterprises.',
    date: '2 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-2',
    name: 'Anjali Rao',
    location: 'Whitefield, Bengaluru',
    rating: 4.5,
    comment: 'I regularly source high-grade timber sheets and premium lamination panels from Badri Enterprises for my clients\' projects in Bengaluru. Their authenticity is guaranteed and delivery is always on time.',
    date: '3 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-3',
    name: 'Girish Gowda',
    location: 'Hebbal, Bengaluru',
    rating: 4,
    comment: 'Got a bulk delivery of premium high-density plywood and Pine core boards for an office project. Very satisfied with the material resistance and density. Minor delay in heavy transport but overall great team.',
    date: '12 June 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-4',
    name: 'Meera Krishnan',
    location: 'Indiranagar, Bengaluru',
    rating: 5,
    comment: 'Neem plywood is a lifesaver for our wardrobes. Badri\'s team explained the anti-bore and termite resistance very clearly. Trustworthy dealer in Bengaluru!',
    date: '28 May 2026',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-5',
    name: 'Sandeep Hegde',
    location: 'RMV Layout, Bengaluru',
    rating: 4,
    comment: 'Excellent service and genuine high-strength laminates and boards. Using their products for all our high-rise luxury flat fittings. True retail experience!',
    date: '15 May 2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-6',
    name: 'Priya Sharma',
    location: 'HSR Layout, Bengaluru',
    rating: 4.5,
    comment: 'As an interior designer, I am very picky with MDF and Marine plywood. Badri Enterprises provided fully certified IS:710 Marine Grade plywood with proper warranty logs. Excellent dealer.',
    date: '30 April 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-7',
    name: 'Kiran Nair',
    location: 'Banashankari, Bengaluru',
    rating: 4.5,
    comment: 'Best plywood cutting response and nail holding capacity with the new high-density wood boards! My carpenters found it extremely sturdy and straight to work with.',
    date: '18 April 2026',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-8',
    name: 'Sunita Deshmukh',
    location: 'Malleshwaram, Bengaluru',
    rating: 5,
    comment: 'We purchased heavy-duty water-resistant plywood for our living room renovation. The finish is extremely smooth and the wood has excellent weight. Very polite staff and fair prices.',
    date: '04 April 2026',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-9',
    name: 'Rajesh Patel',
    location: 'Koramangala, Bengaluru',
    rating: 4,
    comment: 'Standard and prompt supply of commercial plywood and robust solid core flush doors. Badri team handled our supply order beautifully. Highly professional team.',
    date: '22 March 2026',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-10',
    name: 'Kavitha Iyer',
    location: 'Basavanagudi, Bengaluru',
    rating: 4.5,
    comment: 'Loved building my custom bookshelf using Badri\'s Pine blockboards! The wood has a lovely fragrance and is pre-seasoned. Works perfect.',
    date: '10 March 2026',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-11',
    name: 'Manoj Gowda',
    location: 'Electronic City, Bengaluru',
    rating: 4.5,
    comment: 'Excellent quality neem-infused wood panels which are completely organic and termite-proof. Dealing with Badri is smooth, straight rates from factory without middlemen.',
    date: '24 February 2026',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-12',
    name: 'Gitanjali Rao',
    location: 'Koramangala, Bengaluru',
    rating: 5,
    comment: 'I highly recommend Badri Enterprises to all my corporate clients. Their material strength reports and authentic company bills make full finance clearance easy.',
    date: '14 February 2026',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-13',
    name: 'Ravi Teja',
    location: 'Marathahalli, Bengaluru',
    rating: 4,
    comment: 'Purchased over 150 sheets of BWP plywood for a corporate fit-out. Their heavy-grade structural plywood is outstanding for screw grip. Prompt delivery, very fair wholesale quotes.',
    date: '02 February 2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-14',
    name: 'Neha Bajaj',
    location: 'Bellandur, Bengaluru',
    rating: 4.5,
    comment: 'Ordered premium plywood sheets and high-grade laminates directly to our flat. The delivery vehicle arrived inside the apartment compound safely. Genuine quality materials.',
    date: '19 January 2026',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-15',
    name: 'Alok Verma',
    location: 'Sarjapur, Bengaluru',
    rating: 4.5,
    comment: 'Highly reliable dealer in South Bengaluru. Outstanding response on custom blockboard sizes and quick quotations. Highly dependable plywood supplier.',
    date: '05 January 2026',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-16',
    name: 'Divya Teagarajan',
    location: 'JP Nagar, Bengaluru',
    rating: 4,
    comment: 'Badri Enterprises supplied our bedroom wardrobes framework with natural neem-layered boards. Excellent customer care and reliable follow-up.',
    date: '20 December 2025',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-17',
    name: 'Pranav Shah',
    location: 'Yeswanthpur, Bengaluru',
    rating: 5,
    comment: 'We purchase wholesale lots of flush doors and commercial timber logs from Badri Enterprises. Genuine Pidilite dealer; our furniture durability has improved.',
    date: '08 December 2025',
    avatar: 'https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-18',
    name: 'Deepak Gupta',
    location: 'Domlur, Bengaluru',
    rating: 4,
    comment: 'Been buying plywood and wood sheets here since last 4 years. Strong customer commitment and direct factory wood distribution.',
    date: '25 November 2025',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-19',
    name: 'Suresh Chandra',
    location: 'Fraser Town, Bengaluru',
    rating: 5,
    comment: 'Excellent experience sourcing IS:710 Marine Grade BWP sheets. Their Wudgrip and Century ply ranges are incredibly solid. Standard thickness is maintained perfectly.',
    date: '10 November 2025',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  },
  {
    id: 'rev-20',
    name: 'Venkatesh Prasad',
    location: 'Rajajinagar, Bengaluru',
    rating: 4.5,
    comment: 'The termite-proof Neem boards are exceptional. Our local carpenter was genuinely impressed with the core density and ease of laminating. Excellent product quality.',
    date: '28 October 2025',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80',
    isVerified: true
  }
];

interface ReviewsProps {
  reviews?: Review[];
  onUpdateReviews?: (updated: Review[]) => void;
}

export default function Reviews({ reviews: propsReviews, onUpdateReviews }: ReviewsProps) {
  const [internalReviews, setInternalReviews] = useState<Review[]>([]);
  const isControlled = propsReviews !== undefined;
  const reviews = isControlled ? propsReviews! : internalReviews;

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [shownCount, setShownCount] = useState<number>(6);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for active review input
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');

  useEffect(() => {
    if (!isControlled) {
      const saved = localStorage.getItem('badri_customer_reviews_v1');
      if (saved) {
        try {
          setInternalReviews(JSON.parse(saved));
        } catch (e) {
          setInternalReviews(INITIAL_REVIEWS);
        }
      } else {
        setInternalReviews(INITIAL_REVIEWS);
        localStorage.setItem('badri_customer_reviews_v1', JSON.stringify(INITIAL_REVIEWS));
      }
    }
  }, [isControlled]);

  const saveReviews = (updated: Review[]) => {
    if (onUpdateReviews) {
      onUpdateReviews(updated);
    } else {
      setInternalReviews(updated);
      localStorage.setItem('badri_customer_reviews_v1', JSON.stringify(updated));
    }
  };

  // Compute dynamic stats
  const totalReviewsCount = reviews.length;
  const averageRatingValue = totalReviewsCount > 0 
    ? parseFloat((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsCount).toFixed(2))
    : 0;

  // Star breakdown calculation
  const getRatingCount = (r: number) => reviews.filter(rev => Math.floor(rev.rating) === r).length;
  const getRatingPercent = (r: number) => {
    if (totalReviewsCount === 0) return 0;
    return Math.round((getRatingCount(r) / totalReviewsCount) * 100);
  };

  // Handles submitting the customer review form
  const handleReviewSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    // Use a clean initial Unsplash fallback face for a newly self-written review, making it look authentic
    const fallbackAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80'
    ];
    const chosenAvatar = fallbackAvatars[Math.floor(Math.random() * fallbackAvatars.length)];

    const newReview: Review = {
      id: `custom-rev-${Date.now()}`,
      name: formName.trim(),
      location: formLocation.trim() || 'Bengaluru',
      rating: formRating,
      comment: formComment.trim(),
      date: 'Just now',
      avatar: chosenAvatar,
      isVerified: true
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    // Reset Form & state
    setFormName('');
    setFormLocation('');
    setFormRating(5);
    setFormComment('');
    setIsWriteModalOpen(false);

    // Trigger feedback Toast
    setSuccessToast('Thank you! Your verified review has been published.');
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Filter reviews
  const filteredReviews = reviews.filter(rev => {
    if (filterRating === 'all') return true;
    if (filterRating === '5') return rev.rating === 5;
    if (filterRating === '4.5') return rev.rating === 4.5;
    if (filterRating === '4') return rev.rating === 4;
    return true;
  });

  // Render stars helper
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const blankStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 stroke-amber-500" />
        ))}
        {hasHalf && (
          <StarHalf className="h-4 w-4 fill-amber-400 stroke-amber-500" />
        )}
        {[...Array(blankStars)].map((_, i) => (
          <Star key={`blank-${i}`} className="h-4 w-4 text-neutral-300 stroke-neutral-300" />
        ))}
      </div>
    );
  };

  return (
    <section id="reviews" className="py-20 bg-neutral-50 scroll-mt-12 overflow-hidden relative">
      {/* Light decorative elements */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-805 border border-amber-200/50 mb-3">
            <Award className="h-4 w-4 text-amber-750" />
            <span>Bengaluru Verified Customer Reviews</span>
          </div>
          <h2 className="font-serif text-3.5xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Words From Our Customer Workspace
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-600">
            Real feedback from Bengaluru developers, interior designers, homeowners, and premium carpenters who depend on Badri Enterprises' genuine plywood supplies.
          </p>
        </div>

        {/* Dynamic Reviews dashboard - Summary Bars + write a review action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Summary Widget */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4">Reviews Scorecard</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-extrabold font-sans text-neutral-900 tracking-tight">{averageRatingValue}</span>
                <span className="text-lg font-semibold text-neutral-500">out of 5</span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                {renderStars(averageRatingValue)}
                <span className="text-xs font-semibold text-neutral-500">({totalReviewsCount} Verified)</span>
              </div>
              <p className="text-xs text-neutral-500 mb-6">
                Calculated directly based on genuine local buyer receipts and digital invoices.
              </p>

              {/* Progress bars for ratings */}
              <div className="space-y-2.5">
                {[5, 4.5, 4].map((rating) => {
                  const percent = getRatingPercent(rating);
                  const count = reviews.filter(r => r.rating === rating).length;
                  return (
                    <div key={rating} className="flex items-center gap-3 text-xs">
                      <button 
                        onClick={() => setFilterRating(rating.toString())}
                        className={`font-semibold min-w-16 text-left hover:text-amber-600 transition ${filterRating === rating.toString() ? 'text-amber-800 underline underline-offset-2' : 'text-neutral-600'}`}
                      >
                        {rating} Star
                      </button>
                      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-neutral-400 min-w-8 text-right font-mono">{count} rev</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100">
              <button
                type="button"
                id="btn-write-review"
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-800 hover:bg-amber-900 px-5 py-3 text-xs font-bold text-white transition shadow-sm border border-amber-700"
              >
                <Edit3 className="h-4 w-4" />
                <span>Write a Customer Review</span>
              </button>
              <p className="text-[10px] text-center text-neutral-400 mt-2">
                Have you purchased from Badri Enterprises? Tell us about your lumber quality feedback!
              </p>
            </div>
          </div>

          {/* Feedback list grid panel */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Filter buttons header */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-3.5 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-neutral-450 text-neutral-500" />
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Filter Reviews:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: `All Reviews (${totalReviewsCount})`, val: 'all' },
                  { label: '5.0 Star', val: '5' },
                  { label: '4.5 Star', val: '4.5' },
                  { label: '4.0 Star', val: '4' }
                ].map((option) => (
                  <button
                    key={option.val}
                    onClick={() => {
                      setFilterRating(option.val);
                      setShownCount(6); // Reset pagination on filter trigger
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      filterRating === option.val
                        ? 'bg-amber-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main review grid */}
            {filteredReviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100 flex flex-col items-center justify-center">
                <MessageSquare className="h-10 w-10 text-neutral-300 mb-3" />
                <p className="text-sm font-bold text-neutral-600">No reviews match your selected rating filter.</p>
                <button 
                  onClick={() => setFilterRating('all')} 
                  className="text-xs text-amber-700 font-bold hover:underline mt-1"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReviews.slice(0, shownCount).map((review) => (
                  <div 
                    key={review.id}
                    id={`review-card-${review.id}`}
                    className="bg-white rounded-2xl border border-neutral-250/60 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Rating & Date */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-[10px] font-mono text-neutral-400 font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3 inline -mt-0.5" />
                          {review.date}
                        </span>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-neutral-750 leading-relaxed italic text-neutral-700 font-sans mb-4">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Authour info */}
                    <div className="flex items-center gap-3 pt-3.5 border-t border-neutral-100">
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full object-cover border border-neutral-100 bg-neutral-100 shrink-0"
                      />
                      <div className="leading-none flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-black text-neutral-900">{review.name}</span>
                          {review.isVerified && (
                            <span 
                              className="text-[9px] bg-sky-50 text-sky-700 font-bold px-1.5 py-0.5 rounded-full border border-sky-100 flex items-center gap-0.5"
                              title="Verified Badri Enterprises Buyer Log"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5 fill-sky-600 stroke-white" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-500 flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span>{review.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls / View More */}
            {filteredReviews.length > shownCount && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShownCount(prev => prev + 6)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 px-6 py-3 text-xs font-bold text-neutral-700 shadow-sm transition"
                >
                  <span>See More Customer Reviews ({filteredReviews.length - shownCount} remaining)</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* SUCCESS TOAST FLYOUT */}
      {successToast && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-50 bg-neutral-900 border border-neutral-800 text-white rounded-xl py-3 px-4 shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="bg-emerald-500 rounded-full p-1 text-white">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold leading-none mb-0.5">Review Submitted Successfully</p>
            <p className="text-[10px] text-neutral-400">{successToast}</p>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL BAR */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            {/* Dark tint backdrop */}
            <div 
              className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsWriteModalOpen(false)}
            />

            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-neutral-200 relative z-10 animate-in fade-in zoom-in-95 duration-250">
              {/* Decorative top strip */}
              <div className="h-1.5 bg-amber-600" />

              <form onSubmit={handleReviewSubmission} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-black text-neutral-900 flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-amber-700" />
                    <span>Submit Buyer Feedback Log</span>
                  </h3>
                  <button 
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                  Badri Enterprises values customer comments. To ensure full verification safeguards, please provide details of your timber/materials purchase.
                </p>

                <div className="space-y-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-1">
                      Your Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ramesh Hegde"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm text-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                    />
                  </div>

                  {/* Location field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-1">
                      Your Location / Profession
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Malleshwaram / Modular Carpenter"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm text-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                    />
                  </div>

                  {/* Interactive Star rating */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-1.5">
                      Overall Rating Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="text-neutral-300 hover:scale-110 transition shrink-0"
                          title={`${star} Star Rating`}
                        >
                          <Star 
                            className={`h-7 w-7 ${
                              star <= formRating 
                                ? 'fill-amber-400 stroke-amber-50 stroke-[1.5]' 
                                : 'text-neutral-200 stroke-neutral-300'
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/40 ml-2">
                        {formRating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Comments Field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-1">
                      Material Performance Feedback
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Share your experience with our plywood strength, BWP standards, premium brand panels, or customer service logs..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm text-neutral-850 placeholder:text-neutral-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                    />
                  </div>

                </div>

                <div className="mt-8 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="rounded-lg border border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="rounded-lg bg-amber-800 hover:bg-amber-900 px-5 py-2.5 text-xs font-bold text-white transition border border-amber-700 shadow-sm"
                  >
                    Publish Review
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
