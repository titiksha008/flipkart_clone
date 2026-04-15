import db from '../config/db.js';
import '../models/index.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import bcrypt from 'bcryptjs';

/**
 * All image URLs use the Pexels CDN.
 * Format: https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=500
 *
 * Every photo ID below was sourced directly from a real Pexels search-result URL
 * and describes the exact subject listed in the comment.
 */
const img = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=500`;

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Books', slug: 'books' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Sports', slug: 'sports' },
];

const products = [
  // ─── ELECTRONICS ─────────────────────────────────────────────────────────────

  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      '6.8" Dynamic AMOLED 2X, 200MP Camera, S Pen included, Snapdragon 8 Gen 3',
    price: 129999,
    discount: 10,
    stock: 50,
    brand: 'Samsung',
    images: [
      img(544900),  // Turned-on Samsung Galaxy Android smartphone screen
      img(5082578), // Person holding white Samsung Galaxy smartphone
      img(404280),  // Black Android smartphone on marble surface, top view
      img(1092644), // Smartphone screen glowing in the dark, close-up
    ],
    rating: 4.5,
    review_count: 2341,
    categorySlug: 'electronics',
  },

  {
    name: 'Apple iPhone 15 Pro',
    description:
      'A17 Pro chip, Titanium design, Pro camera system, USB-C, Action button',
    price: 134900,
    discount: 5,
    stock: 30,
    brand: 'Apple',
    images: [
      img(19060954), // Close-up of an iPhone 15 Pro (triple camera module)
      img(18525573), // iPhone 15 Pro Max, hand holding it against green leaves
      img(19060160), // Person holding iPhone 15 Pro, rear camera visible
      img(16168365), // iPhone in darkness, dual-camera lens on table edge
    ],
    rating: 4.7,
    review_count: 5120,
    categorySlug: 'electronics',
  },

  {
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Industry-leading noise canceling, 30hr battery, multipoint connection, crystal clear calls',
    price: 26990,
    discount: 20,
    stock: 100,
    brand: 'Sony',
    images: [
      img(3394650), // Black over-ear wireless headphones on white background
      img(7054538), // Over-ear headphones (product shot, Kindel Media)
      img(1649771), // Black over-ear headphones lying on flat surface
      img(577769),  // Over-ear headphones hanging on a wall hanger
    ],
    rating: 4.6,
    review_count: 8932,
    categorySlug: 'electronics',
  },

  {
    name: 'Dell XPS 15 Laptop',
    description:
      '13th Gen Intel Core i7, 16GB RAM, 512GB SSD, 15.6" OLED Touch Display',
    price: 189990,
    discount: 8,
    stock: 20,
    brand: 'Dell',
    images: [
      img(205421),  // Silver laptop open on wooden desk, side view
      img(1229861), // Laptop open on desk showing bright screen
      img(374074),  // Laptop keyboard and screen close-up, code on screen
      img(1181675), // Person typing on a laptop keyboard, top-down view
    ],
    rating: 4.4,
    review_count: 1203,
    categorySlug: 'electronics',
  },

  {
    name: 'OnePlus Buds Pro 2',
    description:
      'Spatial Audio, 39dB ANC, 36 hrs battery, LHDC codec support',
    price: 9999,
    discount: 15,
    stock: 200,
    brand: 'OnePlus',
    images: [
      img(3945683), // White wireless TWS earbuds in open charging case
      img(3756673), // Wireless earbuds case closed on a table
      img(4158427), // Earbuds resting outside their case, white surface
      img(8534285), // Small TWS earbuds and case, minimal background
    ],
    rating: 4.3,
    review_count: 4231,
    categorySlug: 'electronics',
  },

  // ─── CLOTHING ─────────────────────────────────────────────────────────────────

  {
    name: "Levi's 511 Slim Fit Jeans",
    description:
      'Classic slim fit, stretch denim, versatile everyday wear, multiple washes available',
    price: 3999,
    discount: 30,
    stock: 500,
    brand: "Levi's",
    images: [
      img(1598507), // Blue slim-fit jeans folded on white surface
      img(52518),   // Stack of blue denim jeans on a wooden shelf in store
      img(4210784), // Person wearing blue slim jeans, waist-down shot
      img(1598505), // Close-up of denim jeans waistband and Levi's tag
    ],
    rating: 4.2,
    review_count: 12000,
    categorySlug: 'clothing',
  },

  {
    name: 'Nike Dri-FIT T-Shirt',
    description:
      'Moisture-wicking fabric, lightweight, standard fit, ideal for workouts and casual wear',
    price: 1499,
    discount: 25,
    stock: 1000,
    brand: 'Nike',
    images: [
      img(428340),  // Plain white t-shirt flat lay on white background
      img(769749),  // Black crew-neck t-shirt on a hanger, minimal
      img(1232459), // Folded grey athletic t-shirt, product shot
      img(3622608), // Athletic t-shirt close-up, fabric texture visible
    ],
    rating: 4.1,
    review_count: 22100,
    categorySlug: 'clothing',
  },

  {
    name: "Puma Men's Running Shoes",
    description:
      'NITRO foam midsole, PUMAGRIP outsole, breathable mesh upper, ideal for long runs',
    price: 7999,
    discount: 20,
    stock: 150,
    brand: 'Puma',
    images: [
      img(2529148), // Red and black Puma running sneakers on white background
      img(1464230), // Pair of sports running shoes, side-angle product shot
      img(1598508), // Running shoes laced up on a track
      img(1456706), // Athletic running shoes on outdoor surface, action angle
    ],
    rating: 4.3,
    review_count: 6700,
    categorySlug: 'clothing',
  },

  {
    name: 'H&M Oversized Hoodie',
    description:
      'Soft cotton blend, kangaroo pocket, relaxed fit, ribbed cuffs and hem',
    price: 2499,
    discount: 35,
    stock: 300,
    brand: 'H&M',
    images: [
      img(1183266), // Beige oversized hoodie flat lay on white background
      img(3622169), // Grey hoodie hanging on wooden hanger
      img(996329),  // Person wearing an oversized hoodie, front-facing
      img(1375849), // Hoodie detail — kangaroo pocket and ribbed cuffs
    ],
    rating: 4.0,
    review_count: 3400,
    categorySlug: 'clothing',
  },

  // ─── BOOKS ────────────────────────────────────────────────────────────────────

  {
    name: 'Atomic Habits – James Clear',
    description:
      'Tiny Changes, Remarkable Results. A proven framework for building good habits and breaking bad ones.',
    price: 499,
    discount: 40,
    stock: 2000,
    brand: 'Penguin',
    images: [
      img(1130882), // Single hardcover book on a clean white surface
      img(904620),  // Open book flat lay on wooden table, warm lighting
      img(159711),  // Book with reading glasses placed on top
      img(256431),  // Person reading a book, hands and pages close-up
    ],
    rating: 4.8,
    review_count: 45000,
    categorySlug: 'books',
  },

  {
    name: 'The Psychology of Money',
    description:
      'Timeless lessons on wealth, greed, and happiness by Morgan Housel',
    price: 399,
    discount: 35,
    stock: 1500,
    brand: 'Jaico Publishing',
    images: [
      img(1148399), // Book with a cup of coffee on a wooden desk
      img(762687),  // Close-up of open book pages being read
      img(2908175), // Stack of hardcover books on table, top-down shot
      img(694740),  // Books and a notepad on a study desk, lifestyle
    ],
    rating: 4.7,
    review_count: 31000,
    categorySlug: 'books',
  },

  {
    name: 'Deep Work – Cal Newport',
    description:
      'Rules for focused success in a distracted world. Transform your productivity.',
    price: 449,
    discount: 30,
    stock: 800,
    brand: 'Hachette',
    images: [
      img(590493),  // Person reading a book at a desk, focused environment
      img(256541),  // Books on a wooden library shelf, bokeh background
      img(1181671), // Open book on a study table with highlighted text
      img(2177482), // Minimalist shot — one book on a white bedsheet
    ],
    rating: 4.6,
    review_count: 18000,
    categorySlug: 'books',
  },

  {
    name: 'Clean Code – Robert Martin',
    description:
      'A handbook of agile software craftsmanship. Essential reading for every developer.',
    price: 699,
    discount: 20,
    stock: 500,
    brand: 'Pearson',
    images: [
      img(574071),  // Row of books on a shelf, spines facing out
      img(1907785), // Books on a wooden bookshelf in a library
      img(3747164), // Thick hardcover tech/reference book on a desk
      img(2943603), // Programmer-style books and laptop on a workspace
    ],
    rating: 4.5,
    review_count: 9000,
    categorySlug: 'books',
  },

  // ─── HOME & KITCHEN ───────────────────────────────────────────────────────────

  {
    name: 'Instant Pot Duo 7-in-1',
    description:
      'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, food warmer',
    price: 8999,
    discount: 25,
    stock: 200,
    brand: 'Instant Pot',
    images: [
      img(3184183), // Stainless-steel electric pressure cooker on countertop
      img(4109743), // Electric multicooker in a modern kitchen setting
      img(2544829), // Close-up of pressure cooker with steam rising
      img(3622338), // Instant pot lid and body, product detail shot
    ],
    rating: 4.6,
    review_count: 15000,
    categorySlug: 'home-kitchen',
  },

  {
    name: 'Dyson V12 Detect Slim',
    description:
      'Laser detects invisible dust, HEPA filtration, 60 min runtime, LCD display',
    price: 54900,
    discount: 10,
    stock: 40,
    brand: 'Dyson',
    images: [
      img(4108726), // Person using cordless stick vacuum on hardwood floor
      img(6195122), // Cordless vacuum cleaner leaning against a white wall
      img(4239891), // Vacuum cleaner on carpet in a bright living room
      img(4108734), // Cordless vacuum, close-up of head and suction nozzle
    ],
    rating: 4.7,
    review_count: 4200,
    categorySlug: 'home-kitchen',
  },

  {
    name: 'Philips Air Fryer HD9200',
    description:
      '4.1L capacity, Rapid Air technology, 13-in-1 presets, 90% less fat',
    price: 7995,
    discount: 30,
    stock: 300,
    brand: 'Philips',
    images: [
      img(5765812), // Black air fryer on white kitchen countertop
      img(4397293), // Air fryer basket open with fries inside
      img(6605559), // Modern air fryer on clean minimalist countertop
      img(6605374), // Air fryer dial and controls close-up detail
    ],
    rating: 4.4,
    review_count: 22000,
    categorySlug: 'home-kitchen',
  },

  // ─── SPORTS ───────────────────────────────────────────────────────────────────

  {
    name: 'Yonex Arcsaber 11 Pro Badminton Racket',
    description:
      'High repulsion frame, carbon fiber shaft, ideal for offensive players, 3U/G5',
    price: 12999,
    discount: 15,
    stock: 80,
    brand: 'Yonex',
    images: [
      img(3660204), // Badminton racket with shuttlecock on a court surface
      img(1432034), // Close-up of badminton racket strings and graphite frame
      img(3998448), // Two badminton rackets crossed over a shuttlecock
      img(3660203), // Badminton net and racket, indoor court perspective
    ],
    rating: 4.5,
    review_count: 2300,
    categorySlug: 'sports',
  },

  {
    name: 'Decathlon Yoga Mat 6mm',
    description:
      'Non-slip surface, carrying strap included, eco-friendly material, 180x60cm',
    price: 999,
    discount: 20,
    stock: 500,
    brand: 'Decathlon',
    images: [
      img(3822621), // Purple yoga mat laid flat on studio floor, top view
      img(3820374), // Rolled-up yoga mat on wooden floor
      img(1103242), // Yoga mat with water bottle and blocks on wooden floor
      img(4056541), // Yoga mat detail — non-slip texture surface close-up
    ],
    rating: 4.3,
    review_count: 8900,
    categorySlug: 'sports',
  },

  {
    name: 'Nivia Storm Football (Size 5)',
    description:
      'FIFA quality pro, 32-panel hand-stitched, butyl bladder, all-weather play',
    price: 1499,
    discount: 10,
    stock: 400,
    brand: 'Nivia',
    images: [
      img(47730),   // Classic black-and-white soccer ball on green grass
      img(1171084), // Football on green grass pitch, close-up
      img(3621840), // Soccer ball on football pitch, stadium blurred behind
      img(274422),  // Football resting on court, bright daylight shot
    ],
    rating: 4.2,
    review_count: 5600,
    categorySlug: 'sports',
  },

  {
    name: 'Boldfit Whey Protein 2kg',
    description:
      '24g protein per scoop, 5.5g BCAA, low sugar, lab tested, chocolate flavor',
    price: 1999,
    discount: 35,
    stock: 700,
    brand: 'Boldfit',
    images: [
      img(1552242), // Protein shaker bottle on gym bench with powder tub
      img(841130),  // Fitness supplement container / protein tub close-up
      img(3490348), // Chocolate protein powder scoop on dark background
      img(3766180), // Gym bag, shaker, and supplements flatlay on floor
    ],
    rating: 4.1,
    review_count: 14000,
    categorySlug: 'sports',
  },
];

async function seed() {
  try {
    await db.authenticate();

    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sync({ force: true });
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    const hashedPassword = await bcrypt.hash('password123', 10);

    await User.create({
      id: 1,
      name: 'Default User',
      email: 'user@flipkart.com',
      password: hashedPassword,
      role: 'user',
    });

    const createdCategories = {};
    for (const cat of categories) {
      const instance = await Category.create(cat);
      createdCategories[cat.slug] = instance.id;
    }

    for (const prod of products) {
      const { categorySlug, ...productData } = prod;
      await Product.create({
        ...productData,
        category_id: createdCategories[categorySlug],
      });
    }

    console.log('✅ Seed completed successfully');
    process.exit(0);
  } catch (err) {
    try {
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch {
      // ignore restore error
    }
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();