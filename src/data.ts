import { Product, FAQ, Brand, Material, WebsiteSettings } from './types';

export const productsData: Product[] = [
  {
    id: 'ply-bwp-gold',
    title: 'BWP Premium Marine Plywood (IS:710)',
    description: '100% Boiling Water Proof marine grade, lifetime warranty against borers & termites, optimal for long-lasting damp-prone areas.',
    category: 'Plywood',
    longDescription: 'Our hallmark premium grade BWP plywood is crafted from selected hardwood core plywood. Bonded under extreme heat and pressure using un-extended Phenol Formaldehyde resin, it conforms to IS:710 standards. Unmatched strength and water resistance.',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800',
    features: [
      '100% boiling water proof (BWP) verified',
      'Termite and borer protection guarantee',
      'Uniform thickness with zero internal core gaps',
      'Sourced from certified genuine manufacturers'
    ],
    specs: {
      'Regulatory Grade': 'IS:710 Certified Marine Grade',
      'Available Thicknesses': '6mm, 9mm, 12mm, 16mm, 19mm, 25mm',
      'Timber Sourcing': 'Selected Solid Hardwood Core',
      'Bonding Adhesive': 'Premium Phenolic Waterproof Adhesive'
    },
    video: 'https://assets.mixkit.co/videos/preview/mixkit-carpenter-measuring-and-marking-wood-40432-large.mp4',
    videoName: 'bwp-strength-test.mp4'
  },
  {
    id: 'ply-mr-silver',
    title: 'Moisture Resistant Commercial MR Plywood (IS:303)',
    description: 'High-density MR grade calibrated plywood sheets, ideal for room partition woodworks, shelving, and wall panelling.',
    category: 'Plywood',
    longDescription: 'Badri Enterprises supplies high-strength Commercial MR Grade (IS:303) moisture-resistant plywood. Fully vacuum-seasoned to protect against typical weather shifts, these sheets are bonded using synthetic Melamine Urea Formaldehyde resin, offering unmatched nail holding capacity.',
    image: 'https://images.unsplash.com/photo-1520110120185-43ea7d0346f8?auto=format&fit=crop&q=80&w=800',
    features: [
      'Superior strength, dry-area paneling',
      'Calibrated for perfectly flat overlay sheets',
      'Outstanding wood screw and nail grab-tightness'
    ],
    specs: {
      'Regulatory Grade': 'IS:303 Moisture Resistant Commercial Grade',
      'Available Thicknesses': '6mm, 9mm, 12mm, 16mm, 19mm',
      'Timber Species': 'Eucalyptus & local hardwood core combination'
    },
    video: 'https://assets.mixkit.co/videos/preview/mixkit-carpenter-working-with-wood-in-his-workshop-40431-large.mp4',
    videoName: 'moisture-resistance-demo.mp4'
  },
  {
    id: 'ply-fire-retardant',
    title: 'Fire Retardant Premium Plywood (IS:5509)',
    description: 'High-protection fire-resistant plywood vacuum pressure treated with special fire-proofing chemical polymers.',
    category: 'Plywood',
    longDescription: 'Our premium Fire Retardant Plywood conforms strictly to IS:5509. Infused under high pressure with advanced fire-retardant chemicals, this plywood delays flame ignition, exhibits slow rate of burning, and ensures minimal smoke release, making it extremely safe for commercial complexes and modern kitchens.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    features: [
      'Conforms to IS:5509 Fire Retardant standards',
      'Significantly delayed ignition and low flammability',
      'Vacuum-pressure impregnated with active flame retardants',
      'Lifelong termite and wood-borer immunity'
    ],
    specs: {
      'Regulatory Grade': 'IS:5509 Fire Retardant Standard',
      'Available Thicknesses': '9mm, 12mm, 16mm, 19mm',
      'Chemical Infusion': 'Halogen-Free Active Borated Compounds'
    },
    video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-carpenter-cutting-a-wooden-plank-with-a-saw-41584-large.mp4',
    videoName: 'fire-retardancy-test.mp4'
  },
  {
    id: 'pine-board-premium',
    title: 'Pine Core Premium Blockboard (IS:1659)',
    description: 'Triple-layer premium pine core blockboard, seasoned under high temperatures to resist warping and support heavy loads.',
    category: 'Pine board',
    longDescription: 'Our Pine board blockboards feature a strong core of vertically stacked kiln-dried seasoned pine wood strips. Sandwiched between solid hardwood veneer wrappers, it provides high dimensional stability for heavy shelf spans, countertops, and panel partitions.',
    image: 'https://images.unsplash.com/photo-1596701062351-dfc799a4e8c0?auto=format&fit=crop&q=80&w=800',
    features: [
      'Highly resistant to sagging, bending, or flexing',
      'Premium kiln-dried seasoned internal pine fillers',
      'Outstanding screw gripping strength'
    ],
    specs: {
      'Regulatory Grade': 'IS:1659 Structural Blockboard',
      'Core Fillers': '100% Seasoned Pine Wood blocks',
      'Available Thicknesses': '19mm, 25mm'
    }
  },
  {
    id: 'door-flush-solid',
    title: 'Solid Core Heavy-Duty Flush Doors (IS:2202)',
    description: 'High structural integrity kiln-seasoned pine wood core flush doors, built for stability against seasonal swelling.',
    category: 'Flush doors',
    longDescription: 'Our heavyweight Flush Doors are engineered by stacking seasoned solid pine blocks inside hydraulic presses. Faced with cross-laminated timber veneers, they prevent lateral bending and withstand extreme seasonal moisture transitions.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    features: [
      'Solid wood core structure with dual lateral hinge blocks',
      'Resistant to bending, warping, slamming, or splitting',
      'Vacuum-infused chemical preservative defense'
    ],
    specs: {
      'Regulatory Grade': 'IS:2202 Standard Flush Door',
      'Standard Thickness': '30mm, 32mm, 35mm, 38mm, 40mm',
      'Adhesive Bond': 'Waterproof BWP Phenol Formaldehyde resin'
    }
  },
  {
    id: 'mdf-premium-density',
    title: 'Premium Medium Density Fiberboard (MDF)',
    description: 'Ultra-homogeneous MDF panels with flawlessly smooth sanded surfaces, perfect for accurate routing and modern painting.',
    category: 'MDF',
    longDescription: 'Our engineered Premium MDF is fabricated using refined wood fibers blended under state-of-the-art steam presses. With high internal bond strength and uniform density from face to core, it allows clean profiles, sharp edge routing, and clean lamination.',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800',
    features: [
      'Perfect homogeneous density with zero bark residues or cracks',
      'Extremely smooth double-sanded face ready for paint finishes',
      'Eco-friendly manufacturing with low emission standards'
    ],
    specs: {
      'Available Thicknesses': '5.5mm, 8mm, 11mm, 12mm, 16mm, 17mm, 18mm, 25mm',
      'Recommended Use': 'Modern partition layouts, routing, clean CNC styling'
    }
  },
  {
    id: 'hmr-moisture-block',
    title: 'High Moisture Resistant (HMR) Boards',
    description: 'Superior grade HMR fiber boards manufactured specifically for wet areas, kitchens, and modular partitions.',
    category: 'HMR',
    longDescription: 'Designed for humid environments, our High Moisture Resistance (HMR) sheets retain high dimensional stability under high ambient steam and intermittent moist contact. They prevent typical wood swelling and thickness bloating.',
    image: 'https://images.unsplash.com/photo-1531685222403-f928502d2b30?auto=format&fit=crop&q=80&w=800',
    features: [
      'High resistance to relative humidity and direct steam exposure',
      'Engineered with specialized hydro-treated bonding resins',
      'Fungus and moisture-spot resistant coating'
    ],
    specs: {
      'Adhesive Agent': 'Specifically modified Melamine-Urea-Formaldehyde moisture shield',
      'Sizing': '8ft x 4ft sheets'
    }
  },
  {
    id: 'hdhmr-supreme-grade',
    title: 'High Density High Moisture Resistant (HDHMR)',
    description: 'Heavyweight, supreme durability water-repelling wood sheets representing the absolute pinnacle of board technology.',
    category: 'HDHMR',
    longDescription: 'Our premium HDHMR boards leverage raw hardwood timber compressed under extremely high density factors exceeding 850 kg/m³. Fortified with moisture-fighting polymers, they do not swell, separate, or rot even under extreme damp test conditions.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    features: [
      'Ultra density exceeding 850+ kg/m³ for extreme screw-holding index',
      'Maximum water shield protection - does not expand/bloat under water-soak trials',
      '100% borer and termite immune structures'
    ],
    specs: {
      'Density Standard': '850+ kg/m³ Industrial Grade',
      'Available Sizes': '8mm, 12mm, 16.75mm, 18mm, 25mm'
    }
  },
  {
    id: 'veneer-teak-gold',
    title: 'Natural Teak Decorative Veneer Sheets',
    description: 'A grade authentic Burmese teak face veneer, seasoned and designed for luxurious door, cabinet, and furniture surfacing.',
    category: 'Plywood',
    longDescription: 'Our Natural Teak face veneer sheets feature authentic hand-picked hardwood grain veneers sliced to perfection. Each sheet is bonded on premium quality plywood backing, giving gorgeous residential wood textures across all layout applications.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
    features: [
      'Grown naturally, selected high-grade Burmese Teak wood surfaces',
      'Perfect slice thick veneer prevents surface cracking or peeling',
      'Naturally oil-rich timber stands up to surface scratching'
    ],
    specs: {
      'Sizing Dimension': '8ft x 4ft sheets',
      'Veneer Thickness': '0.55mm premium wood slice',
      'Timber Sourcing': 'Burmese Teak A-Grade'
    }
  }
];

export const faqsData: FAQ[] = [
  {
    question: 'Do you supply certified high-grade BWP Marine plywood in Bengaluru?',
    answer: 'Yes! Badri Enterprises is a direct supplier of premium BWP Marine plywood. We stock and ship 100% genuine, original sheets—including water-proof Marine grade (conforming to IS:710 standards)—directly from manufacturer factory lines with fresh warranty batches.'
  },
  {
    question: 'What materials and products do you supply?',
    answer: 'We supply high-grade structural and decorative panels. We are pleased to provide a curated selection of Plywood, Pine board, Flush doors, MDF, HMR, and HDHMR to builders, retailers, and architects in Bengaluru.'
  },
  {
    question: 'What is HDHMR and how is it different from normal MDF?',
    answer: 'MDF (Medium Density Fiberboard) is an excellent board with smooth finishes suitable for dry carpentry routing. HDHMR (High Density High Moisture Resistant) is manufactured under much greater pressure (density exceeding 850 kg/m³) using specialized water-repelling polymers. This makes HDHMR highly immune to swelling, bloating, and water absorption, making it superior for kitchens, bathroom partitions, and regions exposed to steam.'
  },
  {
    question: 'How do I purchase in gross or bulk volumes for a building project in Bengaluru?',
    answer: 'You can call us directly on 98454 31348 or fill out our quote request form. We offer custom wholesaler package pricing for architects, Regional Developers, carpentry agencies, and home builders with transparent delivery support across all Bengaluru urban layout sectors.'
  }
];

export const brandsData: Brand[] = [
  {
    id: 'brand-1',
    name: 'Greenply',
    tagline: 'Premium grade plywood selected for superior structural strength',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600',
    logo: '/src/assets/images/greenply_logo_1783424028897.jpg'
  },
  {
    id: 'brand-2',
    name: 'CENTURYPLY',
    tagline: 'Standard-setting excellence with long-lasting structural defense',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600',
    logo: '/src/assets/images/centuryply_logo_1783423169711.jpg'
  },
  {
    id: 'brand-3',
    name: 'AK Apple Ply',
    tagline: 'Highly trusted plywood sheets for modern durable carpentry',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=600',
    logo: '/src/assets/images/ak_apple_ply_logo_1783424040408.jpg'
  },
  {
    id: 'brand-4',
    name: 'IMFA PLY',
    tagline: 'High-protection sheets fortified against moisture and termites',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    logo: '/src/assets/images/imfa_ply_logo_1783424054304.jpg'
  },
  {
    id: 'brand-5',
    name: 'WUDGRIP Ply & Boards',
    tagline: 'High density, superior grip and ultimate nail-holding capacity',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a5fbcd?auto=format&fit=crop&q=80&w=600',
    logo: '/src/assets/images/wudgrip_logo_1783424079335.jpg'
  },
  {
    id: 'brand-6',
    name: 'NEEM PLY & BOARDS',
    tagline: 'Infused with organic Neem wood core extracts for natural lifelong resilience against boring insects',
    image: 'https://images.unsplash.com/photo-1610527003928-47bd53ef059b?auto=format&fit=crop&q=80&w=600',
    logo: '/src/assets/images/neem_ply_logo_1783424066587.jpg'
  },
  {
    id: 'brand-7',
    name: 'Fevicol SH Adhesive',
    tagline: 'The ultimate resin bonding strength for laminate overlays and custom woodworking joints',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
    logo: '/src/assets/images/fevicol_logo_1783423155041.jpg'
  }
];

export const initialMaterials: Material[] = [
  { id: 'mat-1', name: 'PWP', order: 1 },
  { id: 'mat-2', name: 'Moisture Resistant', order: 2 },
  { id: 'mat-3', name: 'Commercial', order: 3 },
  { id: 'mat-4', name: 'Pine Core', order: 4 },
  { id: 'mat-5', name: 'Block Board', order: 5 },
  { id: 'mat-6', name: 'Premium Boards', order: 6 }
];

export const defaultWebsiteSettings: WebsiteSettings = {
  announcement: "Premium Plywood, Blockboards & Flush Doors Wholesale & Retail Dealer - Bengaluru",
  storeName: "BADRI ENTERPRISES",
  storeSubName: "Premium Plywood, Blockboards & Flush Doors Dealer",
  phone: "+91 98454 31348",
  altPhone: "+91 98851 40590",
  email: "aushariffinternational@gmail.com",
  address: "Bengaluru, Karnataka, India",
  hours: "9:00 AM to 8:00 PM (Monday - Saturday)",
  heroHeading: "Premium Plywood, Blockboards & Flush Doors",
  heroSubheading: "Wholesale and retail dealers of premium-grade plywood, blockboards, flush doors, and high-density fiber boards in Bengaluru, Karnataka, India. Driven by trust, quality, and lifetime reliability.",
  heroCtaText: "Get Wholesale & Retail Quote",
  heroBadge: "Premium Plywood, Blockboards & Flush Doors wholesale and retail dealer, Bengaluru, Karnataka, India.",
  aboutTagline: "Trust. Strength. Quality. Lifetime Durability.",
  aboutTitle: "About Badri Enterprises",
  aboutPara1: "Badri Enterprises is a premium Plywood, Blockboards & Flush Doors wholesale and retail dealer based in Bengaluru, Karnataka, India. We specialize in supplying high-performance structural materials, including Pine boards, MDF, HMR, HDHMR, WPC, Laminates, and high-strength industrial adhesives like Fevicol.",
  aboutPara2: "We serve top-tier builders, architects, structural developers, carpentry agencies, and premium home builders across Karnataka with certified materials built for lifetime stability and superior performance."
};

