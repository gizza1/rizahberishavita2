export const IMAGES = {
  heroFarm: "https://images.unsplash.com/photo-1633285238113-068b48e13d6f?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  sunsetFarm: "https://images.unsplash.com/photo-1613419380964-ad761bb26611?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  milkSplash: "https://images.unsplash.com/photo-1637382752225-d7f97e1ddd03?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  cowsHerd: "https://images.unsplash.com/photo-1729605687638-16933963b966?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  cowField: "https://images.unsplash.com/photo-1731113775405-d5734eb7361d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  cowCalf: "https://images.unsplash.com/photo-1731113776184-0905bc7ce843?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  lab: "https://images.unsplash.com/photo-1486825586573-7131f7991bdd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  factory: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  family: "https://images.unsplash.com/photo-1758874960857-3e4759eb0502?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  leafWater: "https://images.unsplash.com/photo-1555063200-219c0652df49?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  dew: "https://images.pexels.com/photos/18982220/pexels-photo-18982220.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

export const RECIPES = [
  {
    id: "banana-smoothie", title: "Banana Yogurt Smoothie", category: "Breakfast",
    time: "10 min", difficulty: "Easy", servings: 2,
    desc: "A creamy smoothie of ripe banana, VITA yogurt and a drizzle of honey.",
    image: "https://images.unsplash.com/photo-1501959915551-4e8d30928317?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  {
    id: "granola-bowl", title: "Greek Yogurt Granola Bowl", category: "Breakfast",
    time: "8 min", difficulty: "Easy", servings: 1,
    desc: "Thick Greek yogurt layered with crunchy granola and fresh berries.",
    image: "https://images.unsplash.com/photo-1542691457-cbe4df041eb2?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  {
    id: "berry-parfait", title: "Berry Yogurt Parfait", category: "Desserts",
    time: "15 min", difficulty: "Easy", servings: 4,
    desc: "Layers of fruit yogurt, whipped cream and summer berries.",
    image: "https://images.unsplash.com/photo-1610441009633-b6ca9c6d4be2?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  {
    id: "caramel-flan", title: "Caramel Flan", category: "Desserts",
    time: "45 min", difficulty: "Medium", servings: 6,
    desc: "Silky caramel custard set with fresh VITA milk and a golden top.",
    image: "https://images.unsplash.com/photo-1710106519622-8c49d0bcff2f?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  {
    id: "veggie-omelette", title: "Cheesy Veggie Omelette", category: "Lunch",
    time: "12 min", difficulty: "Easy", servings: 2,
    desc: "Fluffy omelette folded with fresh vegetables and VITA yellow cheese.",
    image: "https://images.unsplash.com/photo-1497888329096-51c27beff665?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  {
    id: "creamy-risotto", title: "Creamy Mushroom Risotto", category: "Dinner",
    time: "35 min", difficulty: "Medium", servings: 4,
    desc: "Slow-stirred risotto finished with VITA cooking cream and parmesan.",
    image: "https://images.unsplash.com/photo-1633893215271-f7e1fca081ad?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
];

export const RECIPE_FILTERS = ["All", "Breakfast", "Desserts", "Lunch", "Dinner"];

export const TIMELINE = [
  { year: "2003", title: "The First Churn", text: "In 2003, Qumështorja Vita began producing and processing milk in Kosovo as part of Devolli Group. Using modern UHT technology and Tetra Pak packaging, Vita became the first dairy in Kosovo to offer long-lasting, high-quality milk. This marked the beginning of one of the country's most recognized dairy brands." },
  { year: "2010", title: "Growth", text: "By 2010, Qumështorja Vita had become one of Kosovo's leading dairy producers. The company expanded its range of milk and dairy products, strengthened its distribution network across the country, and continued investing in modern production technology to provide high-quality products to consumers." },
  { year: "2018", title: "Innovation", text: "In 2018, Qumështorja Vita celebrated its 15th anniversary. During this period, the company expanded and promoted its dairy product range, including Bene Vita Calcium and Vitamin milk, chocolate milk, yogurt, ayran, schmand, clabber, and UHT milk. Vita continued to strengthen its position as one of Kosovo's leading dairy producers." },
  { year: "2026", title: "Kosovo's Leading Dairy", text: "In 2026, Qumështorja Vita remained one of Kosovo's leading dairy companies, continuing to produce a wide range of fresh milk, yogurt, cheese, butter, sour cream, ayran, and flavored dairy products. During the year, independent laboratory analyses confirmed that Vita's milk products contained no milk powder or palm oil, reinforcing the company's commitment to quality and consumer trust." },
];

export const STATS = [
  { value: 20, suffix: "+", label: "Years of Craft" },
  { value: 280, suffix: "+", label: "Employees" },
  { value: 3000, suffix: "+", label: "Partner Farmers" },
  { value: 6, suffix: "", label: "Product Families" },
];

export const JOURNEY = [
  { icon: "Sprout", title: "Happy Cows", text: "Grass-fed herds roam the Kosovo highlands." },
  { icon: "Home", title: "Family Farms", text: "Thousands of local farmers we know by name." },
  { icon: "Truck", title: "Cold Collection", text: "Chilled within hours to protect freshness." },
  { icon: "Factory", title: "Modern Dairy", text: "State-of-the-art, spotless production lines." },
  { icon: "FlaskConical", title: "Quality Testing", text: "Every batch lab-tested, ISO certified." },
  { icon: "Package", title: "Careful Packaging", text: "Sustainable packs that lock in freshness." },
  { icon: "Store", title: "On the Shelf", text: "Delivered fresh to stores near you." },
  { icon: "Heart", title: "Your Family", text: "From our farms, straight to your table." },
];

export const TESTIMONIALS = [
  { name: "Arta Krasniqi", role: "Prishtinë", text: "VITA yogurt is the taste of my childhood — nothing else comes close. It's the first thing on my shopping list every week.", avatar: "https://i.pravatar.cc/120?img=47" },
  { name: "Blerim Gashi", role: "Home Chef, Pejë", text: "The cooking cream never splits, even in my hottest sauces. It has genuinely changed how I cook at home.", avatar: "https://i.pravatar.cc/120?img=12" },
  { name: "Elira Berisha", role: "Nutritionist", text: "I recommend VITA protein milk to my clients. Clean ingredients, real nutrition, and a taste people actually enjoy.", avatar: "https://i.pravatar.cc/120?img=32" },
  { name: "Driton Morina", role: "Café Owner, Gjakovë", text: "We switched our whole café to VITA. Customers noticed the difference in a single day. Consistent, fresh, dependable.", avatar: "https://i.pravatar.cc/120?img=15" },
];

export const GALLERY = [
  { src: "https://images.unsplash.com/photo-1743193144224-d2db90ea7784?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "tall", alt: "Cheese board with honey" },
  { src: "https://images.unsplash.com/photo-1731113775405-d5734eb7361d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "short", alt: "Cow in green field" },
  { src: "https://images.unsplash.com/photo-1707079288822-be30b3d1de72?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "short", alt: "Artisan cheese platter" },
  { src: "https://images.unsplash.com/photo-1501959915551-4e8d30928317?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "tall", alt: "Yogurt breakfast bowl" },
  { src: "https://images.unsplash.com/photo-1633285238113-068b48e13d6f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "short", alt: "Rolling green hills" },
  { src: "https://images.unsplash.com/photo-1480951759438-f39a376462f2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "tall", alt: "Cheese slices" },
  { src: "https://images.unsplash.com/photo-1758874960857-3e4759eb0502?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "short", alt: "Family breakfast" },
  { src: "https://images.unsplash.com/photo-1610441009633-b6ca9c6d4be2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", h: "tall", alt: "Berry bowl" },
];

export const CERTS = ["ISO 22000", "ISO 9001", "HACCP", "Halal", "EU Standard"];
