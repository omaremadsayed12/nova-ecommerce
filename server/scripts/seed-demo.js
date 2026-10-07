import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Review from "../src/models/Reviews.js";
import Order from "../src/models/Order.js";
import Payment from "../src/models/Payment.js";
import RefreshToken from "../src/models/RefreshToken.js";
import StoreSettings from "../src/models/StoreSettings.js";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const args = process.argv.slice(2);
const expectedDatabaseIndex = args.indexOf("--expected-db");
const expectedDatabase = expectedDatabaseIndex >= 0 ? args[expectedDatabaseIndex + 1] : "";
const confirmed = args.includes("--confirm-staging-reset");
const managedCollections = new Set([
  User.collection.name,
  Product.collection.name,
  Review.collection.name,
  Order.collection.name,
  Payment.collection.name,
  RefreshToken.collection.name,
  StoreSettings.collection.name,
]);

const categories = {
  electronics: { en: "Electronics", ar: "إلكترونيات" },
  home: { en: "Home and Living", ar: "المنزل والمعيشة" },
  sports: { en: "Sports and Outdoors", ar: "الرياضة والأنشطة الخارجية" },
  beauty: { en: "Beauty and Care", ar: "الجمال والعناية" },
  travel: { en: "Bags and Travel", ar: "الحقائب والسفر" },
  clothing: { en: "Clothing", ar: "الملابس" },
  office: { en: "Office and Study", ar: "المكتب والدراسة" },
  kitchen: { en: "Kitchen", ar: "المطبخ" },
};

const categoryDescriptions = {
  electronics: {
    en: "Made for everyday use with dependable performance, simple controls, and a considered compact design.",
    ar: "مصمم للاستخدام اليومي بأداء موثوق وتحكم بسيط وتصميم عملي ومدروس.",
  },
  home: {
    en: "A practical home accent made with durable materials and a calm, versatile finish.",
    ar: "قطعة عملية للمنزل بخامات متينة ولمسة أنيقة تناسب مختلف المساحات.",
  },
  sports: {
    en: "A comfortable, durable essential for regular training, outdoor plans, and active days.",
    ar: "قطعة مريحة ومتينة للتدريب المنتظم والأنشطة الخارجية والأيام النشطة.",
  },
  beauty: {
    en: "A thoughtfully designed personal-care essential for a simple, reliable daily routine.",
    ar: "منتج عناية يومي بتصميم مدروس لروتين بسيط وموثوق.",
  },
  travel: {
    en: "Organized storage, dependable construction, and useful details for commuting and travel.",
    ar: "مساحة منظمة وخامات موثوقة وتفاصيل مفيدة للتنقل والسفر.",
  },
  clothing: {
    en: "An easy-to-wear wardrobe staple with a comfortable fit and a versatile everyday style.",
    ar: "قطعة أساسية مريحة بتصميم عملي يناسب الاستخدام اليومي.",
  },
  office: {
    en: "A useful desk and study essential designed to keep daily work organized and comfortable.",
    ar: "قطعة عملية للمكتب والدراسة تساعد على تنظيم العمل اليومي براحة.",
  },
  kitchen: {
    en: "A dependable kitchen tool with straightforward handling and easy everyday care.",
    ar: "أداة مطبخ موثوقة سهلة الاستخدام والعناية اليومية.",
  },
};

const imageByCategory = {
  electronics: "photo-1498049794561-7780e7231661",
  home: "photo-1600210492486-724fe5c67fb0",
  sports: "photo-1461896836934-ffe607ba8211",
  beauty: "photo-1596462502278-27bfdc403348",
  travel: "photo-1553062407-98eeb64c6a62",
  clothing: "photo-1523275335684-37898b6baf30",
  office: "photo-1498050108023-c5249f4df085",
  kitchen: "photo-1556911220-e15b29be8c8f",
};

const catalog = [
  ["Studio Wireless Headphones", "سماعات ستوديو لاسلكية", "electronics", 89, 34],
  ["Compact Bluetooth Speaker", "مكبر صوت بلوتوث صغير", "electronics", 42, 19],
  ["USB-C Fast Charging Hub", "موزع شحن سريع USB-C", "electronics", 36, 51],
  ["Adjustable Laptop Stand", "حامل حاسوب محمول قابل للتعديل", "electronics", 48, 22],
  ["Smart Desk Lamp", "مصباح مكتب ذكي", "electronics", 55, 17],
  ["Noise-Reducing Earbuds", "سماعات أذن عازلة للضوضاء", "electronics", 64, 28],
  ["Linen Cushion Cover Set", "طقم أغطية وسائد كتان", "home", 28, 41],
  ["Ceramic Table Vase", "مزهرية طاولة خزفية", "home", 32, 16],
  ["Woven Storage Basket", "سلة تخزين منسوجة", "home", 24, 37],
  ["Soft Cotton Throw", "غطاء قطني ناعم", "home", 46, 13],
  ["Minimal Wall Clock", "ساعة حائط بتصميم بسيط", "home", 39, 25],
  ["Walnut Serving Tray", "صينية تقديم من خشب الجوز", "home", 34, 18],
  ["Everyday Training Mat", "بساط تدريب يومي", "sports", 31, 27],
  ["Insulated Steel Bottle", "قارورة فولاذية عازلة", "sports", 22, 44],
  ["Adjustable Yoga Blocks", "قوالب يوغا قابلة للتعديل", "sports", 18, 30],
  ["Lightweight Running Belt", "حزام جري خفيف", "sports", 19, 12],
  ["Resistance Band Set", "طقم أربطة مقاومة", "sports", 26, 35],
  ["Trail Daypack 18L", "حقيبة رحلات يومية 18 لتر", "sports", 58, 9],
  ["Daily Hydration Serum", "سيروم ترطيب يومي", "beauty", 27, 33],
  ["Gentle Cleansing Balm", "بلسم تنظيف لطيف", "beauty", 21, 24],
  ["Ceramic Hair Brush", "فرشاة شعر خزفية", "beauty", 29, 11],
  ["Reusable Makeup Pouch", "حافظة مكياج قابلة لإعادة الاستخدام", "beauty", 16, 42],
  ["Travel Skincare Bottles", "عبوات عناية للسفر", "beauty", 14, 26],
  ["Soft Cotton Face Towels", "مناشف وجه قطنية ناعمة", "beauty", 20, 38],
  ["Commuter Laptop Backpack", "حقيبة ظهر للعمل والتنقل", "travel", 74, 15],
  ["Cabin Packing Cube Set", "طقم مكعبات تنظيم حقائب السفر", "travel", 33, 21],
  ["Canvas Weekend Bag", "حقيبة نهاية أسبوع قماشية", "travel", 62, 8],
  ["Compact Passport Wallet", "محفظة جواز سفر صغيرة", "travel", 25, 31],
  ["Water-Resistant Crossbody", "حقيبة كتف مقاومة للماء", "travel", 49, 14],
  ["Foldable Travel Tote", "حقيبة سفر قابلة للطي", "travel", 23, 29],
  ["Relaxed Cotton T-Shirt", "قميص قطني مريح", "clothing", 24, 45],
  ["Everyday Knit Sweater", "كنزة محبوكة للاستخدام اليومي", "clothing", 58, 7],
  ["Lightweight Zip Hoodie", "سترة خفيفة بسحاب", "clothing", 52, 18],
  ["Classic Canvas Cap", "قبعة قماشية كلاسيكية", "clothing", 19, 32],
  ["Soft Lounge Trousers", "بنطال منزلي ناعم", "clothing", 39, 20],
  ["Everyday Cotton Socks", "جوارب قطنية يومية", "clothing", 15, 48],
  ["Hardcover Project Notebook", "دفتر مشاريع بغلاف صلب", "office", 17, 40],
  ["Refillable Gel Pen Set", "طقم أقلام جل قابلة لإعادة التعبئة", "office", 13, 55],
  ["Ergonomic Desk Wrist Rest", "مسند معصم مريح للمكتب", "office", 21, 23],
  ["Weekly Desk Planner", "مخطط أسبوعي للمكتب", "office", 18, 36],
  ["Portable Document Folder", "حافظة مستندات محمولة", "office", 16, 27],
  ["Magnetic Note Board", "لوحة ملاحظات مغناطيسية", "office", 35, 10],
  ["Stackable Glass Food Jars", "برطمانات طعام زجاجية قابلة للتكديس", "kitchen", 29, 25],
  ["Acacia Wood Chopping Board", "لوح تقطيع من خشب الأكاسيا", "kitchen", 26, 17],
  ["Digital Kitchen Scale", "ميزان مطبخ رقمي", "kitchen", 23, 12],
  ["Stainless Steel Travel Mug", "كوب سفر من الفولاذ المقاوم للصدأ", "kitchen", 25, 39],
  ["Silicone Baking Mat Set", "طقم حصائر خبز سيليكون", "kitchen", 19, 31],
  ["Pour-Over Coffee Starter Kit", "طقم تحضير قهوة بالتقطير", "kitchen", 44, 6],
];

const customerNames = [
  ["Maya Hassan", "مايا حسن"], ["Omar Nabil", "عمر نبيل"],
  ["Lina Farouk", "لينا فاروق"], ["Youssef Adel", "يوسف عادل"],
  ["Salma Amin", "سلمى أمين"], ["Karim Mostafa", "كريم مصطفى"],
  ["Nour El-Sayed", "نور السيد"], ["Hana Samir", "هناء سمير"],
  ["Adam Khaled", "آدم خالد"], ["Layla Mahmoud", "ليلى محمود"],
  ["Ziad Tarek", "زياد طارق"], ["Mariam Fathy", "مريم فتحي"],
  ["Rania Hossam", "رانيا حسام"], ["Amir Galal", "أمير جلال"],
  ["Farah Medhat", "فرح مدحت"], ["Tamer Saeed", "تامر سعيد"],
  ["Dina Wael", "دينا وائل"], ["Khaled Younis", "خالد يونس"],
  ["Nadine Ashraf", "نادين أشرف"], ["Basma Emad", "بسمة عماد"],
  ["Hassan Magdy", "حسن مجدي"], ["Aya Sherif", "آية شريف"],
  ["Fady Ehab", "فادي إيهاب"], ["Reem Sameh", "ريم سامح"],
  ["Mona Hany", "منى هاني"], ["Baker Nasser", "باسم ناصر"],
  ["Nada Anwar", "ندى أنور"], ["Tarek Waleed", "طارق وليد"],
  ["Sara Essam", "سارة عصام"], ["Hany Reda", "هاني رضا"],
];

const reviewComments = [
  ["Exactly what I needed for daily use. The finish and packaging were both excellent.", "مناسب تمامًا للاستخدام اليومي، والتشطيب والتغليف ممتازان."],
  ["Good quality for the price and the details match the product description.", "جودة جيدة مقابل السعر والتفاصيل مطابقة لوصف المنتج."],
  ["Arrived in good condition and has been reliable so far.", "وصل بحالة جيدة وكان أداؤه موثوقًا حتى الآن."],
  ["A thoughtful design that is easy to use and fits well into my routine.", "تصميم عملي وسهل الاستخدام ويناسب روتيني اليومي."],
  ["The materials feel durable. I would happily recommend it.", "الخامات متينة وأوصي به بكل سرور."],
];

const collectionModels = [User, Product, Review, Order, Payment, RefreshToken, StoreSettings];
const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required; database reset was not started.");
  if (!confirmed || !expectedDatabase) {
    throw new Error("Refusing to reset. Pass --expected-db <verified-demo-db> --confirm-staging-reset.");
  }

  const parsedUri = new URL(uri);
  const uriDatabase = decodeURIComponent(parsedUri.pathname.replace(/^\/+/, ""));
  if (
    !uriDatabase ||
    uriDatabase !== expectedDatabase ||
    /(^|[-_])prod(uction)?($|[-_])/i.test(uriDatabase)
  ) {
    throw new Error("Configured database did not match the explicitly confirmed staging/demo database; no data was changed.");
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const actualDatabase = mongoose.connection.name;
  const actualHost = mongoose.connection.host;
  if (actualDatabase !== expectedDatabase || /(^|[-_])prod(uction)?($|[-_])/i.test(actualDatabase)) {
    throw new Error("Connected database identity failed staging/demo safety checks; no data was changed.");
  }

  const existingCollections = await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray();
  const unexpectedCollections = existingCollections
    .map(({ name }) => name)
    .filter((name) => !managedCollections.has(name) && !name.startsWith("system."));
  if (unexpectedCollections.length) {
    throw new Error(`Refusing reset because the database contains unmanaged collections: ${unexpectedCollections.join(", ")}`);
  }

  const before = {};
  for (const Model of collectionModels) before[Model.collection.name] = await Model.countDocuments();
  console.log(`Verified staging/demo MongoDB target: database=${actualDatabase}, host=${actualHost}`);
  console.log(`Existing app-managed documents to replace: ${JSON.stringify(before)}`);

  const session = await mongoose.startSession();
  let seededCounts;
  try {
    await session.withTransaction(async () => {
      for (const Model of collectionModels) await Model.deleteMany({}, { session });

      const adminId = new mongoose.Types.ObjectId();
      const admin = new User({
        _id: adminId,
        name: { en: "Nova Demo Administrator", ar: "مدير نوفا التجريبي" },
        role: "ADMIN",
        email: "demo.admin@nova.dev",
        password: "NovaAdmin123!",
        createdBy: adminId,
        updatedBy: adminId,
      });
      await admin.save({ session });

      const customerId = new mongoose.Types.ObjectId();
      const demoCustomer = new User({
        _id: customerId,
        name: { en: "Nova Demo Customer", ar: "عميل نوفا التجريبي" },
        role: "CUSTOMER",
        email: "demo.customer@nova.dev",
        password: "NovaDemo123!",
        createdBy: adminId,
        updatedBy: adminId,
      });
      await demoCustomer.save({ session });

      const customers = [demoCustomer];
      for (let index = 0; index < customerNames.length; index += 1) {
        const [englishName, arabicName] = customerNames[index];
        const customer = new User({
          name: { en: englishName, ar: arabicName },
          role: "CUSTOMER",
          email: `customer.${String(index + 1).padStart(2, "0")}@demo.nova.dev`,
          password: `NovaCustomer${String(index + 1).padStart(2, "0")}!`,
          createdBy: adminId,
          updatedBy: adminId,
        });
        await customer.save({ session });
        customers.push(customer);
      }

      const productsToSeed = catalog.map(([englishName, arabicName, categoryKey, price, stock], index) => {
        const category = categories[categoryKey];
        const image = imageByCategory[categoryKey];
        return new Product({
          name: { en: englishName, ar: arabicName },
          description: categoryDescriptions[categoryKey],
          category,
          price,
          currency: "USD",
          stock,
          isActive: true,
          imageUrl: `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1200&q=85`,
          createdBy: adminId,
          updatedBy: adminId,
          createdAt: new Date(Date.now() - (catalog.length - index) * 60 * 60 * 1000),
          updatedAt: new Date(),
        });
      });
      const products = await Product.insertMany(productsToSeed, { session });

      for (let index = 0; index < customers.length; index += 1) {
        const user = customers[index];
        user.wishlist = [
          products[(index * 3) % products.length]._id,
          products[(index * 3 + 7) % products.length]._id,
          products[(index * 3 + 19) % products.length]._id,
        ];
        user.updatedBy = adminId;
        await user.save({ session });
      }

      const reviewsToSeed = [];
      for (let productIndex = 0; productIndex < products.length; productIndex += 1) {
        for (let reviewerIndex = 0; reviewerIndex < 7; reviewerIndex += 1) {
          const customer = customers[(productIndex * 3 + reviewerIndex) % customers.length];
          const [englishComment, arabicComment] = reviewComments[(productIndex + reviewerIndex) % reviewComments.length];
          reviewsToSeed.push({
            user: customer._id,
            product: products[productIndex]._id,
            rating: 3 + ((productIndex + reviewerIndex) % 3),
            comment: (productIndex + reviewerIndex) % 4 === 0 ? arabicComment : englishComment,
            createdAt: new Date(Date.now() - ((productIndex + reviewerIndex) % 180) * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          });
        }
      }
      await Review.insertMany(reviewsToSeed, { session });

      const ordersToSeed = [];
      for (let index = 0; index < 120; index += 1) {
        const customer = customers[index % customers.length];
        const itemCount = 1 + (index % 3);
        const items = [];
        for (let offset = 0; offset < itemCount; offset += 1) {
          const product = products[(index * 5 + offset * 11) % products.length];
          const quantity = 1 + ((index + offset) % 2);
          items.push({
            product: product._id,
            quantity,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            subtotal: product.price * quantity,
          });
        }
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const shippingFee = 5;
        const tax = Math.round(subtotal * 0.14 * 100) / 100;
        const completed = index % 5 !== 0 && index % 5 !== 1;
        const cancelled = !completed && index % 5 === 1;
        ordersToSeed.push({
          user: customer._id,
          items,
          subtotal,
          tax,
          shippingFee,
          total: subtotal + tax + shippingFee,
          status: completed ? "COMPLETED" : cancelled ? "CANCELLED" : "PENDING",
          paymentStatus: completed ? "PAID" : "UNPAID",
          paymentMethod: completed ? "CASH_ON_DELIVERY" : "CREDIT_CARD",
          currency: "USD",
          shippingAddress: `${100 + (index % 800)} Demo Street, Cairo, Egypt`,
          createdAt: new Date(Date.now() - (index % 180) * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        });
      }
      await Order.insertMany(ordersToSeed, { session });
      await new StoreSettings({
        shippingFee: 5,
        currency: "USD",
        taxRate: 0.14,
        updatedBy: adminId,
        updatedAt: new Date(),
      }).save({ session });

      seededCounts = {
        users: customers.length + 1,
        admins: 1,
        customers: customers.length,
        products: products.length,
        categories: new Set(catalog.map(([, , categoryKey]) => categoryKey)).size,
        reviews: reviewsToSeed.length,
        orders: ordersToSeed.length,
        payments: 0,
        refreshTokens: 0,
        storeSettings: 1,
        persistedCarts: 0,
        wishlistOwners: customers.length,
      };
    }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
  } finally {
    await session.endSession();
  }

  const [users, products, reviews, orders, settings] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Review.countDocuments(),
    Order.countDocuments(),
    StoreSettings.countDocuments(),
  ]);
  const actualCounts = { users, products, reviews, orders, storeSettings: settings };
  if (
    users !== seededCounts.users ||
    products !== seededCounts.products ||
    reviews !== seededCounts.reviews ||
    orders !== seededCounts.orders ||
    settings !== 1
  ) {
    throw new Error(`Post-seed count verification failed: ${JSON.stringify(actualCounts)}`);
  }

  const [orphanReviewCount, orphanOrderUserCount, orphanOrderItemCount, orphanWishlistCount] = await Promise.all([
    Review.aggregate([
      { $lookup: { from: User.collection.name, localField: "user", foreignField: "_id", as: "validUser" } },
      { $lookup: { from: Product.collection.name, localField: "product", foreignField: "_id", as: "validProduct" } },
      { $match: { $or: [{ validUser: { $size: 0 } }, { validProduct: { $size: 0 } }] } },
      { $count: "count" },
    ]),
    Order.aggregate([
      { $lookup: { from: User.collection.name, localField: "user", foreignField: "_id", as: "validUser" } },
      { $match: { validUser: { $size: 0 } } },
      { $count: "count" },
    ]),
    Order.aggregate([
      { $unwind: "$items" },
      { $lookup: { from: Product.collection.name, localField: "items.product", foreignField: "_id", as: "validProduct" } },
      { $match: { validProduct: { $size: 0 } } },
      { $count: "count" },
    ]),
    User.aggregate([
      { $unwind: "$wishlist" },
      { $lookup: { from: Product.collection.name, localField: "wishlist", foreignField: "_id", as: "validProduct" } },
      { $match: { validProduct: { $size: 0 } } },
      { $count: "count" },
    ]),
  ]);
  const integrity = {
    orphanReviews: orphanReviewCount[0]?.count || 0,
    orphanOrderUsers: orphanOrderUserCount[0]?.count || 0,
    orphanOrderItems: orphanOrderItemCount[0]?.count || 0,
    orphanWishlistProducts: orphanWishlistCount[0]?.count || 0,
  };
  if (Object.values(integrity).some((count) => count !== 0)) {
    throw new Error(`Seeded reference integrity check failed: ${JSON.stringify(integrity)}`);
  }

  const demoAccounts = await User.find({
    email: { $in: ["demo.customer@nova.dev", "demo.admin@nova.dev"] },
  }).select("+password email role");
  const demoCustomerAccount = demoAccounts.find((user) => user.email === "demo.customer@nova.dev");
  const demoAdminAccount = demoAccounts.find((user) => user.email === "demo.admin@nova.dev");
  if (
    demoAccounts.length !== 2 ||
    demoCustomerAccount?.role !== "CUSTOMER" ||
    demoAdminAccount?.role !== "ADMIN" ||
    !await demoCustomerAccount?.comparePassword("NovaDemo123!") ||
    !await demoAdminAccount?.comparePassword("NovaAdmin123!")
  ) {
    throw new Error("Demo-account role or password-hash verification failed.");
  }

  console.log(`Seed complete: ${JSON.stringify(seededCounts)}`);
  console.log(`Reference integrity: ${JSON.stringify(integrity)}`);
  console.log("Demo account login password checks passed against stored hashes; plaintext values were not printed.");
};

run()
  .catch((error) => {
    const message = String(error.message || "Demo seeding failed.")
      .replace(/mongodb(?:\+srv)?:\/\/\S+/gi, "[MongoDB connection string redacted]");
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
