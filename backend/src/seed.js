import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './features/users/models/User.js';
import Category from './features/categories/models/Category.js';
import Product from './features/products/models/Product.js';
import Order from './features/orders/models/Order.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

const categoriesData = [
  {
    name: 'Luxury Apparel',
    slug: 'luxury-apparel',
    description: 'Fine spun garments made from organic wool, pima cotton, and pure cashmere.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Modern Furniture',
    slug: 'modern-furniture',
    description: 'Architectural seating, tables, and accents carved from stone, oak, and steel.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Minimal Accessories',
    slug: 'minimal-accessories',
    description: 'Leather cardholders, chronographs, and visual accessories that define simplicity.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Premium Tech',
    slug: 'premium-tech',
    description: 'Acoustic headphones, mechanical keyboards, and precision desk setups.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Lifestyle Essentials',
    slug: 'lifestyle-essentials',
    description: 'Linen sheets, apothecary, and scents that elevate your everyday routine.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80'
  }
];

const productsData = (catMap) => [
  // Luxury Apparel
  {
    name: 'Edo Oversized Wool Overcoat',
    slug: 'edo-oversized-wool-overcoat',
    description: 'An architectural long-line overcoat made from pure virgin Japanese wool. Cut in an oversized, relaxed silhouette featuring dropped shoulders, raw seams, and concealed horn buttons. Unlined to allow a fluid, natural drape that flows elegantly over winter layers.',
    details: 'Material: 85% Virgin Wool, 15% Cashmere. Fit: Relaxed drape, drop shoulder. Tailored in Tokyo. Dry clean only.',
    price: 540.00,
    category: catMap['luxury-apparel'],
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    isFeatured: true,
    collections: ['Winter Capsule', 'Editorial Picks'],
    tags: ['outerwear', 'wool', 'japanese-fabric'],
    specs: [
      { label: 'Shell Material', value: '85% Virgin Wool, 15% Cashmere' },
      { label: 'Weave', value: 'Double-face twill' },
      { label: 'Hardware', value: 'Concealed horn buttons' },
      { label: 'Origin', value: 'Tailored in Tokyo, Japan' }
    ]
  },
  {
    name: 'Atelier Nappa Leather Jacket',
    slug: 'atelier-nappa-leather-jacket',
    description: 'A clean-lined, modern interpretation of the classic leather blouson. Cut from exceptionally soft, full-grain Nappa lambskin leather. It features a flush chrome-finished Swiss zipper, minimalist welt pockets, and a neat classic point collar. Lined entirely in premium cupro for frictionless layering.',
    details: 'Leather: 100% Full-grain Lambskin Nappa. Lining: 100% Cupro. Trim: Swiss-milled metal zippers. Clean by leather specialist only.',
    price: 680.00,
    category: catMap['luxury-apparel'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    isFeatured: true,
    collections: ['Minimal Essentials', 'Editorial Picks'],
    tags: ['leather', 'jacket', 'nappa'],
    specs: [
      { label: 'Material', value: 'Full-Grain Lambskin Nappa' },
      { label: 'Lining', value: '100% Cupro' },
      { label: 'Hardware', value: 'Riri chrome-finished zippers' },
      { label: 'Fit', value: 'Slim straight cut' }
    ]
  },
  {
    name: 'Structure Loopback Hoodie',
    slug: 'structure-loopback-hoodie',
    description: 'An elevated basic engineered from ultra-heavy 500gsm organic Pima cotton loopback French terry. Features a clean double-layered hood without drawstrings, dropped shoulders, and subtle side-seam pockets. Preshrunk to ensure a lifelong structured shape.',
    details: 'Material: 100% Organic Pima Cotton (500gsm). Fit: Structural boxy drape. Machine wash cold, tumble dry low.',
    price: 160.00,
    category: catMap['luxury-apparel'],
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    isFeatured: false,
    collections: ['Minimal Essentials', 'New Arrivals'],
    tags: ['cotton', 'hoodie', 'athleisure'],
    specs: [
      { label: 'Fabric Weight', value: '500 gsm Heavyweight' },
      { label: 'Material Origin', value: 'Peruvian Pima Cotton' },
      { label: 'Hem Detail', value: 'Bound cotton ribbing' }
    ]
  },
  {
    name: 'Linear Creased Wool Trousers',
    slug: 'linear-creased-wool-trousers',
    description: 'Tailored trousers cut with a sharp, permanent pressed crease and a modern flat-front design. Crafted from a refined tropical wool and silk blend that offers light, breathable wear throughout the seasons.',
    details: 'Material: 70% Tropical Wool, 30% Mulberry Silk. Fit: Straight mid-rise with full length drape. Dry clean only.',
    price: 220.00,
    category: catMap['luxury-apparel'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    isFeatured: false,
    collections: ['Minimal Essentials'],
    tags: ['trousers', 'wool', 'tailoring'],
    specs: [
      { label: 'Material Blend', value: '70% Wool, 30% Silk' },
      { label: 'Closure', value: 'Hook-and-bar fly' },
      { label: 'Cuffs', value: 'Unfinished for custom tailoring' }
    ]
  },

  // Modern Furniture
  {
    name: 'Svalbard Bouclé Lounge Chair',
    slug: 'svalbard-boucle-lounge-chair',
    description: 'An organic, sculptural lounge chair designed to offer enveloping comfort. Sweeping curves are upholstered in a high-texture premium Belgian wool-bouclé fabric, anchored by a concealed low-profile solid oak swivel base.',
    details: 'Material: Belgian Wool Bouclé. Frame: FSC-Certified solid pine. Dimensions: 34" W x 32" D x 29" H. Weight: 64 lbs. Full assembled.',
    price: 1450.00,
    category: catMap['modern-furniture'],
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 6,
    isFeatured: true,
    collections: ['Architectural Living', 'Editorial Picks'],
    tags: ['chair', 'boucle', 'swivel'],
    specs: [
      { label: 'Upholstery', value: '80% Wool, 20% Acrylic Bouclé' },
      { label: 'Base', value: 'Concealed 360-degree swivel base' },
      { label: 'Frame', value: 'Reinforced kiln-dried pine' },
      { label: 'Seat Depth', value: '24 inches' }
    ]
  },
  {
    name: 'Kyoto Solid Walnut Coffee Table',
    slug: 'kyoto-solid-walnut-coffee-table',
    description: 'A low-slung, substantial coffee table celebrating the natural warmth and figure of American Black Walnut. Boasts chamfered edges, floating mortise joinery, and a hand-rubbed botanical oil finish that cures into a durable matte sheen.',
    details: 'Material: 100% Solid American Walnut. Dimensions: 48" W x 28" D x 14" H. Assembly: Easy leg attachment.',
    price: 1100.00,
    category: catMap['modern-furniture'],
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    isFeatured: true,
    collections: ['Architectural Living', 'Minimal Essentials'],
    tags: ['table', 'walnut', 'livingroom'],
    specs: [
      { label: 'Timber Source', value: 'Sustainable FSC American Walnut' },
      { label: 'Joinery Type', value: 'Traditional mortise and tenon' },
      { label: 'Weight Limit', value: '150 lbs' }
    ]
  },
  {
    name: 'Dune Modular Corner Sofa',
    slug: 'dune-modular-corner-sofa',
    description: 'A deep, low-profile modular sofa seating unit upholstered in a premium heavy Belgian linen-cotton blend. Features premium feather-down pocket padding to create a luxurious sink-in feel while maintaining architectural, clean outer geometry.',
    details: 'Upholstery: 70% Linen, 30% Cotton. Cushion: High-density foam core with feather-down envelope. Dimensions: 42" W x 42" D x 26" H.',
    price: 1850.00,
    category: catMap['modern-furniture'],
    images: [
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    isFeatured: false,
    collections: ['Architectural Living', 'New Arrivals'],
    tags: ['sofa', 'linen', 'modular'],
    specs: [
      { label: 'Modular Design', value: 'Interlocking invisible underside clips' },
      { label: 'Seat Cushions', value: 'Feather-down blend wrap' },
      { label: 'Removable Covers', value: 'Yes, dry-clean only' }
    ]
  },
  {
    name: 'Orbital Brass Floor Lamp',
    slug: 'orbital-brass-floor-lamp',
    description: 'An architectural floor lamp featuring a slender, hand-brushed brass stem mounted on a heavy solid Travertine stone base. The adjustable sandblasted glass sphere houses a dimmable LED element that casts a warm, soft diffuse glow.',
    details: 'Material: Brushed Brass, Honed Travertine. Bulb: LED G9 (included). Height: 62 inches. Base diameter: 12 inches.',
    price: 640.00,
    category: catMap['modern-furniture'],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 10,
    isFeatured: false,
    collections: ['Architectural Living', 'Workspace Collection'],
    tags: ['lighting', 'brass', 'travertine'],
    specs: [
      { label: 'Fixture Material', value: 'Solid C360 Brushed Brass' },
      { label: 'Base Component', value: '100% Classico Travertine block' },
      { label: 'Toggle Dimmer', value: 'Full-range touch capacitive' }
    ]
  },

  // Minimal Accessories
  {
    name: 'Folio Vachetta Cardholder',
    slug: 'folio-vachetta-cardholder',
    description: 'A precision-folded card case handcrafted from vegetable-tanned Italian Vachetta leather. Designed using a single-piece folding construction and saddle-stitched by hand with waxed linen thread. Ages into a rich, deep amber patina over time.',
    details: 'Leather: Full-grain French Calfskin Vachetta. Thread: Irish waxed linen. Dimensions: 4" x 2.75" x 0.25". Handcrafted in France.',
    price: 120.00,
    category: catMap['minimal-accessories'],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    isFeatured: true,
    collections: ['Minimal Essentials', 'Editorial Picks'],
    tags: ['wallet', 'leather', 'vachetta'],
    specs: [
      { label: 'Stitching', value: 'Hand-sewn saddle stitch' },
      { label: 'Capacity', value: 'Up to 8 cards and cash' },
      { label: 'Edges', value: 'Burnished and beeswax painted' }
    ]
  },
  {
    name: 'Aero Horizon Chronograph',
    slug: 'aero-horizon-chronograph',
    description: 'An elegant timepiece with an ultra-thin 38mm brushed stainless steel case and a raw vegetable-tanned Italian leather band. The watch face is characterized by clean, unadorned index markers, Swiss quartz movement, and double-domed sapphire crystal glass.',
    details: 'Movement: Swiss Ronda. Glass: Double-domed Sapphire. Case: 316L Surgical Steel. Strap: 18mm Quick-release leather.',
    price: 340.00,
    category: catMap['minimal-accessories'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    isFeatured: true,
    collections: ['Minimal Essentials', 'New Arrivals'],
    tags: ['watch', 'chronograph', 'sapphire'],
    specs: [
      { label: 'Case Diameter', value: '38 mm' },
      { label: 'Case Thickness', value: '6.8 mm' },
      { label: 'Water Resistance', value: '5 ATM (50m)' },
      { label: 'Battery Life', value: 'Up to 3 years' }
    ]
  },
  {
    name: 'Verge Solid Brass Fountain Pen',
    slug: 'verge-solid-brass-fountain-pen',
    description: 'A heavy, perfectly balanced fountain pen machined from a single block of raw C360 brass. Fitted with a fine German 14k gold-plated nib. The raw brass surface is left unfinished, allowing it to oxidize and patina uniquely to the owner.',
    details: 'Material: Machined C360 Raw Brass. Nib: German Schmidt Fine 14k Gold-Plated. Cap: Screw-on security cap.',
    price: 180.00,
    category: catMap['minimal-accessories'],
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    isFeatured: false,
    collections: ['Workspace Collection', 'Minimal Essentials'],
    tags: ['pen', 'brass', 'stationery'],
    specs: [
      { label: 'Pen Weight', value: '54 grams' },
      { label: 'Nib Size', value: 'German Fine' },
      { label: 'Filling Mechanism', value: 'Standard international converter/cartridge' }
    ]
  },

  // Premium Tech
  {
    name: 'Monolith Active Audio System',
    slug: 'monolith-active-audio-system',
    description: 'A high-fidelity active speaker enclosed in a seamless, acoustically inert American Walnut cabinet. Features custom dual-concentric drivers, class-D amplification, and clean wireless connectivity for a warm, immersive soundstage.',
    details: 'Power: 200W Class-D. Drivers: 5.25" Kevlar Woofers, 1" Silk Dome Tweeters. Wireless: AirPlay 2, Bluetooth aptX HD, Spotify Connect.',
    price: 950.00,
    category: catMap['premium-tech'],
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    isFeatured: true,
    collections: ['Workspace Collection', 'Editorial Picks'],
    tags: ['speaker', 'audio', 'walnut'],
    specs: [
      { label: 'Amplification', value: 'Bi-amplified 200W RMS' },
      { label: 'Cabinet', value: 'Seamless Solid American Walnut' },
      { label: 'Inputs', value: 'Optical, RCA, USB-C, Wi-Fi' },
      { label: 'DAC Resolution', value: '24-bit / 192kHz' }
    ]
  },
  {
    name: 'Keyston Custom Aluminum Keyboard',
    slug: 'keyston-custom-aluminum-keyboard',
    description: 'A heavy 75% layout mechanical keyboard featuring a solid CNC-milled 6063 anodized aluminum chassis, hot-swappable sockets, and pre-lubricated linear switches. Fitted with internal brass dampeners for a clean typing tone.',
    details: 'Switches: Pre-lubed Linear (Gateron Oil Kings). Layout: 75% ANSI. Case: Anodized 6063 Aluminum. Connectivity: USB-C.',
    price: 280.00,
    category: catMap['premium-tech'],
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    isFeatured: true,
    collections: ['Workspace Collection', 'Minimal Essentials'],
    tags: ['keyboard', 'aluminum', 'mechanical'],
    specs: [
      { label: 'Chassis', value: 'CNC 6063 Anodized Aluminum' },
      { label: 'Inner Weights', value: 'Sandblasted Brass Plate' },
      { label: 'Mounting Style', value: 'Gasket mounted' },
      { label: 'Total Weight', value: '3.8 lbs built' }
    ]
  },
  {
    name: 'Apex Titanium Wireless Over-Ear',
    slug: 'apex-titanium-wireless-over-ear',
    description: 'Wireless studio-grade headphones built from lightweight milled titanium and wrapped in breathable knit fabric. Custom 40mm dynamic drivers deliver a wide frequency response and outstanding transient response.',
    details: 'Driver: 40mm Titanium Dynamic. Battery: Up to 35 Hours (ANC ON). Bluetooth: 5.3 aptX. Active Noise Cancellation: Hybrid 4-mic.',
    price: 420.00,
    category: catMap['premium-tech'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    isFeatured: true,
    collections: ['Workspace Collection', 'New Arrivals'],
    tags: ['headphones', 'audio', 'anc'],
    specs: [
      { label: 'Transducer', value: '40mm Titanium dynamic element' },
      { label: 'Codec Formats', value: 'aptX Adaptive, AAC, SBC' },
      { label: 'Charge Speed', value: 'USB-C (10 mins charge = 5 hours play)' }
    ]
  },
  {
    name: 'Meridian Merino Wool Desk Pad',
    slug: 'meridian-merino-wool-desk-pad',
    description: 'A premium workspace mat crafted from 100% natural German Merino wool felt with a non-slip natural cork backing. Provides a soft, warm surface for hands and devices while defining clean desk layouts.',
    details: 'Material: 100% Merino Wool Felt, Natural Cork base. Dimensions: 36" W x 12" H x 5mm thickness.',
    price: 85.00,
    category: catMap['premium-tech'],
    images: [
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    isFeatured: false,
    collections: ['Workspace Collection'],
    tags: ['deskpad', 'wool', 'cork'],
    specs: [
      { label: 'Felt Source', value: 'Oeko-Tex German Merino Wool' },
      { label: 'Underlayment', value: 'Self-healing Portuguese Cork' },
      { label: 'Care Instructions', value: 'Spot clean only with damp cloth' }
    ]
  },

  // Lifestyle Essentials
  {
    name: 'Hinoki Temple Perfume Oil',
    slug: 'hinoki-temple-perfume-oil',
    description: 'A concentrated roller perfume oil inspired by early mornings in ancient Japanese cedar forests. Notes of dry Hinoki wood, damp pine needles, rich frankincense, and warm amber create a deeply grounding scent.',
    details: 'Volume: 15 ml. Carrier: Organic fractionated coconut oil. Notes: Hinoki Cypress, Frankincense, Vetiver, Amber.',
    price: 95.00,
    category: catMap['lifestyle-essentials'],
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    isFeatured: false,
    collections: ['Minimal Essentials', 'New Arrivals'],
    tags: ['fragrance', 'apothecary', 'hinoki'],
    specs: [
      { label: 'Concentration', value: '30% Pure Botanical Extract' },
      { label: 'Carrier Base', value: 'Cold-pressed Fractionated Coconut Oil' },
      { label: 'Application', value: 'Glass roll-on rollerball' }
    ]
  },
  {
    name: 'Linea Linen Bound Notebooks',
    slug: 'linea-linen-bound-notebooks',
    description: 'A pair of tactile, flat-lay journals bound in heavy Belgian linen cloth. Filled with 120gsm FSC-certified acid-free ivory paper, optimized for fountain pens and artistic sketch work.',
    details: 'Count: 2 Notebooks. Paper: 160 pages each, dotted grid layout. Cover: Belgian Linen fabric.',
    price: 50.00,
    category: catMap['lifestyle-essentials'],
    images: [
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    isFeatured: false,
    collections: ['Workspace Collection', 'Minimal Essentials'],
    tags: ['notebook', 'linen', 'paper'],
    specs: [
      { label: 'Paper Weight', value: '120 gsm Acid-free Ivory' },
      { label: 'Binding', value: 'Smyth-sewn flat-lay binding' },
      { label: 'Sizing', value: 'A5 Standard (5.8" x 8.3")' }
    ]
  },
  {
    name: 'Vantage Duffle Garment Bag',
    slug: 'vantage-duffle-garment-bag',
    description: 'A weekender bag handcrafted from ballistic nylon and full-grain bridle leather. Features a smart convertible configuration that unzips completely flat to house formal tailoring before folding into a clean duffle.',
    details: 'Material: 1680D Ballistic Cordura, Bridle Leather. Capacity: 48 Liters. Carry-on approved. Dimensions: 22" L x 11" W x 12" H.',
    price: 380.00,
    category: catMap['lifestyle-essentials'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    isFeatured: true,
    collections: ['Editorial Picks', 'Winter Capsule'],
    tags: ['bag', 'travel', 'leather'],
    specs: [
      { label: 'Main Shell', value: 'Waterproof 1680D Cordura Nylon' },
      { label: 'Accent Leather', value: 'Vachetta Bridle Leather accents' },
      { label: 'Suit Capacity', value: 'Fits up to 2 suits/dresses' }
    ]
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);
    console.log('Connected to Database.');

    // 1. Clean collections
    console.log('Cleaning existing database content...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 2. Create users
    console.log('Seeding user profiles...');
    const customerUser = await User.create({
      name: 'Somesh Mishra',
      email: 'user@cinematic.com',
      password: 'userpassword',
      role: 'customer',
      addresses: [
        {
          street: '200 Design Ave Apt 4B',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          country: 'USA',
          isDefault: true
        }
      ]
    });

    const adminUser = await User.create({
      name: 'Shopifi Admin',
      email: 'admin@cinematic.com',
      password: 'adminpassword',
      role: 'admin',
      addresses: [
        {
          street: '100 Minimalist Blvd',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          country: 'USA',
          isDefault: true
        }
      ]
    });

    console.log(`Seeded Admin User: ${adminUser.email}`);
    console.log(`Seeded Customer User: ${customerUser.email}`);

    // 3. Create categories
    console.log('Seeding categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${createdCategories.length} categories.`);

    // Map slug to category id
    const catMap = {};
    createdCategories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    // 4. Create products
    console.log('Seeding products...');
    const productsList = productsData(catMap);
    
    // Assign some sample reviews to products
    productsList.forEach((prod, i) => {
      prod.reviews = [
        {
          user: customerUser._id,
          name: customerUser.name,
          rating: 5,
          comment: 'Exquisite craftsmanship. The packaging was immaculate, and the product exceeded my expectations. Perfectly matching the minimalist layout.',
        }
      ];
      prod.numReviews = 1;
      prod.rating = 5.0;
    });

    const createdProducts = await Product.insertMany(productsList);
    console.log(`Seeded ${createdProducts.length} products.`);

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
