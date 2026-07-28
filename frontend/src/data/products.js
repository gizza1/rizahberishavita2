// Real VITA products only — sourced from qumeshtorjavita.com.
// All images are the real product photography stored locally in /products/*.webp

export const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "milk", label: "Milk" },
  { id: "yogurt", label: "Yogurt" },
  { id: "cream", label: "Cream" },
  { id: "drinks", label: "Drinks" },
];

// glow / tint theme per category
export const CATEGORY_THEME = {
  milk: { tint: "#E6F2FF", glow: "0, 123, 255", accent: "#007BFF" },
  yogurt: { tint: "#FDE7F1", glow: "236, 72, 153", accent: "#EC4899" },
  cream: { tint: "#F1FBF6", glow: "16, 185, 129", accent: "#10B981" },
  drinks: { tint: "#E0F7FA", glow: "6, 182, 212", accent: "#06B6D4" },
};

export const PRODUCTS = [
  {
    id: "milk-32",
    name: "Vita Qumësht 3.2%",
    category: "milk",
    tags: ["family", "featured", "popular"],
    image: "/products/milk_32.webp",
    real: true,
    badge: "Bestseller",
    short: "Full-fat fresh milk, silky and naturally rich.",
    description:
      "Our signature fresh whole milk with 3.2% fat. Gently processed to lock in the pure, creamy taste of the Kosovo highlands — perfect for the whole family, morning to night.",
    ingredients: ["Fresh cow's milk", "Vitamin D", "Vitamin B12"],
    nutrition: { Energy: "64 kcal", Fat: "3.2 g", Protein: "3.3 g", Carbs: "4.8 g", Calcium: "120 mg" },
    sizes: ["1 L"],
    storage: "Store cool & dry. Refrigerate after opening and consume within 3 days.",
  },
  {
    id: "jogurt-15",
    name: "Vita Jogurt 1.5%",
    category: "yogurt",
    tags: ["healthy", "family", "featured", "popular"],
    image: "/products/yogurt_15.webp",
    real: true,
    badge: "Light",
    short: "Smooth, tangy drinking yogurt, 1.5% fat.",
    description:
      "Silky low-fat yogurt cultured slowly for a clean, refreshing tang. A daily source of live cultures and calcium for a happy gut.",
    ingredients: ["Fresh milk", "Live yogurt cultures"],
    nutrition: { Energy: "50 kcal", Fat: "1.5 g", Protein: "3.5 g", Carbs: "5.0 g", Calcium: "130 mg" },
    sizes: ["1 L"],
    storage: "Keep refrigerated at 2–6°C.",
  },
  {
    id: "jogurt-32",
    name: "Vita Jogurt 3.2%",
    category: "yogurt",
    tags: ["family", "popular"],
    image: "/products/yogurt_32.webp",
    real: true,
    badge: "Classic",
    short: "Rich traditional yogurt, full 3.2% fat.",
    description:
      "The full-bodied yogurt our founders started with — thick, creamy and honest. Wonderful on its own or as the base of every recipe.",
    ingredients: ["Fresh milk", "Live yogurt cultures"],
    nutrition: { Energy: "63 kcal", Fat: "3.2 g", Protein: "3.4 g", Carbs: "4.7 g", Calcium: "125 mg" },
    sizes: ["1 L"],
    storage: "Keep refrigerated at 2–6°C.",
  },
  {
    id: "kos-400",
    name: "Vita Kos 3.2%",
    category: "cream",
    tags: ["family", "featured"],
    image: "/products/kos_400.webp",
    real: true,
    badge: "Traditional",
    short: "Traditional soured milk 'kos', 400g.",
    description:
      "Our beloved traditional soured milk — dense, tangy and versatile. A staple of Balkan kitchens for generations.",
    ingredients: ["Fresh milk", "Live cultures"],
    nutrition: { Energy: "116 kcal", Fat: "3.2 g", Protein: "3.0 g", Carbs: "4.5 g", Calcium: "120 mg" },
    sizes: ["400 g"],
    storage: "Keep refrigerated at 2–6°C.",
  },
  {
    id: "cooking-cream-1l",
    name: "Vita Cooking Cream 1L",
    category: "cream",
    tags: ["family", "featured", "popular"],
    image: "/products/cooking_cream_1l.webp",
    real: true,
    badge: "New",
    short: "Chef's cooking cream that never splits.",
    description:
      "A heat-stable cooking cream engineered for silky sauces, soups and risottos. Whisk it in confidently — it holds beautifully.",
    ingredients: ["Cream", "Milk", "Stabiliser"],
    nutrition: { Energy: "195 kcal", Fat: "20 g", Protein: "2.5 g", Carbs: "3.5 g", Calcium: "80 mg" },
    sizes: ["1 L"],
    storage: "Store cool & dry. Refrigerate after opening.",
  },
  {
    id: "cooking-cream-05l",
    name: "Vita Cooking Cream 0.5L",
    category: "cream",
    tags: ["family"],
    image: "/products/cooking_cream_05l.webp",
    real: true,
    badge: "New",
    short: "The kitchen essential, in a handy 0.5L.",
    description:
      "Same velvety, heat-stable cooking cream in a convenient half-litre — perfect for everyday dinners for two.",
    ingredients: ["Cream", "Milk", "Stabiliser"],
    nutrition: { Energy: "195 kcal", Fat: "20 g", Protein: "2.5 g", Carbs: "3.5 g", Calcium: "80 mg" },
    sizes: ["0.5 L"],
    storage: "Store cool & dry. Refrigerate after opening.",
  },
  {
    id: "whipping-cream",
    name: "Vita Whipping Cream 1L",
    category: "cream",
    tags: ["family", "featured"],
    image: "/products/whipping_cream.webp",
    real: true,
    badge: "New",
    short: "Whips into stable, glossy peaks.",
    description:
      "A rich whipping cream that transforms into airy, stable peaks in seconds — the secret behind every VITALICIOUS dessert.",
    ingredients: ["Cream", "Milk"],
    nutrition: { Energy: "290 kcal", Fat: "30 g", Protein: "2.2 g", Carbs: "3.0 g", Calcium: "70 mg" },
    sizes: ["1 L"],
    storage: "Store cool & dry. Refrigerate after opening.",
  },
  {
    id: "ayran",
    name: "Vita Ayran 1.2%",
    category: "drinks",
    tags: ["family", "featured", "popular"],
    image: "/products/ayran.webp",
    real: true,
    badge: "Refreshing",
    short: "Classic salted yogurt drink.",
    description:
      "The perfect thirst-quencher — cool, lightly salted whisked yogurt that pairs with every meal under the summer sun.",
    ingredients: ["Yogurt", "Water", "Salt"],
    nutrition: { Energy: "38 kcal", Fat: "1.2 g", Protein: "2.6 g", Carbs: "3.8 g", Calcium: "95 mg" },
    sizes: ["1 L"],
    storage: "Keep refrigerated at 2–6°C.",
  },
];

// filter chips shown in the catalog
export const FILTERS = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "popular", label: "Most Popular" },
  { id: "family", label: "Family" },
  { id: "healthy", label: "Healthy" },
];

export const FEATURED_IDS = ["milk-32", "jogurt-15", "cooking-cream-1l", "kos-400", "whipping-cream", "ayran"];
