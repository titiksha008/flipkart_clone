import db from '../config/db.js';
import '../models/index.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import bcrypt from 'bcryptjs';

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Books', slug: 'books' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Sports', slug: 'sports' },
];

const products = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: '6.8" Dynamic AMOLED 2X, 200MP Camera, S Pen included, Snapdragon 8 Gen 3',
    price: 129999,
    discount: 10,
    stock: 50,
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
    rating: 4.5,
    review_count: 2341,
    categorySlug: 'electronics',
  },
  {
    name: 'Apple iPhone 15 Pro',
    description: 'A17 Pro chip, Titanium design, Pro camera system, USB-C, Action button',
    price: 134900,
    discount: 5,
    stock: 30,
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
    rating: 4.7,
    review_count: 5120,
    categorySlug: 'electronics',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling, 30hr battery, multipoint connection, crystal clear calls',
    price: 26990,
    discount: 20,
    stock: 100,
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'],
    rating: 4.6,
    review_count: 8932,
    categorySlug: 'electronics',
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: '13th Gen Intel Core i7, 16GB RAM, 512GB SSD, 15.6" OLED Touch Display',
    price: 189990,
    discount: 8,
    stock: 20,
    brand: 'Dell',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    rating: 4.4,
    review_count: 1203,
    categorySlug: 'electronics',
  },
  {
    name: 'OnePlus Buds Pro 2',
    description: 'Spatial Audio, 39dB ANC, 36 hrs battery, LHDC codec support',
    price: 9999,
    discount: 15,
    stock: 200,
    brand: 'OnePlus',
    images: ['https://images.unsplash.com/photo-1606741965509-717af4fe1de3?w=500'],
    rating: 4.3,
    review_count: 4231,
    categorySlug: 'electronics',
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description: 'Classic slim fit, stretch denim, versatile everyday wear, multiple washes available',
    price: 3999,
    discount: 30,
    stock: 500,
    brand: "Levi's",
    images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500'],
    rating: 4.2,
    review_count: 12000,
    categorySlug: 'clothing',
  },
  {
    name: 'Nike Dri-FIT T-Shirt',
    description: 'Moisture-wicking fabric, lightweight, standard fit, ideal for workouts and casual wear',
    price: 1499,
    discount: 25,
    stock: 1000,
    brand: 'Nike',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    rating: 4.1,
    review_count: 22100,
    categorySlug: 'clothing',
  },
  {
    name: "Puma Men's Running Shoes",
    description: 'NITRO foam midsole, PUMAGRIP outsole, breathable mesh upper, ideal for long runs',
    price: 7999,
    discount: 20,
    stock: 150,
    brand: 'Puma',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    rating: 4.3,
    review_count: 6700,
    categorySlug: 'clothing',
  },
  {
    name: 'H&M Oversized Hoodie',
    description: 'Soft cotton blend, kangaroo pocket, relaxed fit, ribbed cuffs and hem',
    price: 2499,
    discount: 35,
    stock: 300,
    brand: 'H&M',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500'],
    rating: 4.0,
    review_count: 3400,
    categorySlug: 'clothing',
  },
  {
    name: 'Atomic Habits – James Clear',
    description: 'Tiny Changes, Remarkable Results. A proven framework for building good habits and breaking bad ones.',
    price: 499,
    discount: 40,
    stock: 2000,
    brand: 'Penguin',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'],
    rating: 4.8,
    review_count: 45000,
    categorySlug: 'books',
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel',
    price: 399,
    discount: 35,
    stock: 1500,
    brand: 'Jaico Publishing',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500'],
    rating: 4.7,
    review_count: 31000,
    categorySlug: 'books',
  },
  {
    name: 'Deep Work – Cal Newport',
    description: 'Rules for focused success in a distracted world. Transform your productivity.',
    price: 449,
    discount: 30,
    stock: 800,
    brand: 'Hachette',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    rating: 4.6,
    review_count: 18000,
    categorySlug: 'books',
  },
  {
    name: 'Clean Code – Robert Martin',
    description: 'A handbook of agile software craftsmanship. Essential reading for every developer.',
    price: 699,
    discount: 20,
    stock: 500,
    brand: 'Pearson',
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'],
    rating: 4.5,
    review_count: 9000,
    categorySlug: 'books',
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, food warmer',
    price: 8999,
    discount: 25,
    stock: 200,
    brand: 'Instant Pot',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
    rating: 4.6,
    review_count: 15000,
    categorySlug: 'home-kitchen',
  },
  {
    name: 'Dyson V12 Detect Slim',
    description: 'Laser detects invisible dust, HEPA filtration, 60 min runtime, LCD display',
    price: 54900,
    discount: 10,
    stock: 40,
    brand: 'Dyson',
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'],
    rating: 4.7,
    review_count: 4200,
    categorySlug: 'home-kitchen',
  },
  {
    name: 'Philips Air Fryer HD9200',
    description: '4.1L capacity, Rapid Air technology, 13-in-1 presets, 90% less fat',
    price: 7995,
    discount: 30,
    stock: 300,
    brand: 'Philips',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
    rating: 4.4,
    review_count: 22000,
    categorySlug: 'home-kitchen',
  },
  {
    name: 'Yonex Arcsaber 11 Pro Badminton Racket',
    description: 'High repulsion frame, carbon fiber shaft, ideal for offensive players, 3U/G5',
    price: 12999,
    discount: 15,
    stock: 80,
    brand: 'Yonex',
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500'],
    rating: 4.5,
    review_count: 2300,
    categorySlug: 'sports',
  },
  {
    name: 'Decathlon Yoga Mat 6mm',
    description: 'Non-slip surface, carrying strap included, eco-friendly material, 180x60cm',
    price: 999,
    discount: 20,
    stock: 500,
    brand: 'Decathlon',
    images: ['https://images.unsplash.com/photo-1601925228781-6e1c52d16c97?w=500'],
    rating: 4.3,
    review_count: 8900,
    categorySlug: 'sports',
  },
  {
    name: 'Nivia Storm Football (Size 5)',
    description: 'FIFA quality pro, 32-panel hand-stitched, butyl bladder, all-weather play',
    price: 1499,
    discount: 10,
    stock: 400,
    brand: 'Nivia',
    images: ['https://images.unsplash.com/photo-1614632537423-1e6c2e7b0aae?w=500'],
    rating: 4.2,
    review_count: 5600,
    categorySlug: 'sports',
  },
  {
    name: 'Boldfit Whey Protein 2kg',
    description: '24g protein per scoop, 5.5g BCAA, low sugar, lab tested, chocolate flavor',
    price: 1999,
    discount: 35,
    stock: 700,
    brand: 'Boldfit',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'],
    rating: 4.1,
    review_count: 14000,
    categorySlug: 'sports',
  },
];

async function seed() {
  try {
    await db.authenticate();

    // Temporarily disable FK checks so force sync can drop tables safely
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

    for (const p of products) {
      const { categorySlug, ...productData } = p;

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