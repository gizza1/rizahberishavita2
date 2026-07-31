// Vita Milk Rush — Game Constants
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const WORLD_WIDTH = 6400;

export const COLORS = {
  sky: 0x87CEEB,
  skyBottom: 0xE0F0FF,
  ground: 0x5D8A3C,
  groundDark: 0x4A7030,
  platform: 0x8B6914,
  platformTop: 0xA0D468,
  vitaBlue: 0x007BFF,
  vitaGreen: 0x10B981,
  vitaInk: 0x0A1F44,
  milk: 0xFEFEFE,
  milkCap: 0x007BFF,
  factory: 0x8B7355,
  factoryRoof: 0xCC4444,
  spike: 0xE74C3C,
  gold: 0xFFD700,
  white: 0xFFFFFF,
  hudBg: 0x000000,
};

export const PHYSICS = {
  gravity: 1200,
  playerSpeed: 280,
  playerJump: -520,
  playerBounce: 0.15,
};

export const DEPTH = {
  bg: 0,
  platforms: 10,
  pickups: 15,
  obstacles: 15,
  player: 20,
  factory: 18,
  hud: 100,
  hudFly: 110,
};

// Milk pickup tiers
export const MILK = {
  small:  { value: 5,   label: "Small Milk",   color: 0xCCDDFF, size: 0.9  },
  medium: { value: 10,  label: "Medium Milk",  color: 0x99BBFF, size: 1.1  },
  large:  { value: 25,  label: "Large Milk Can", color: 0xFFCC44, size: 1.4 },
  golden: { value: 50,  label: "Golden Milk",  color: 0xFFD700, size: 1.3  },
};

// Milk required to complete level (% of total)
export const MILK_REQUIRED_PCT = 0.6;

// Coins
export const COIN_VALUE = 1;
export const BONUS_PER_COIN = 2; // extra milk bonus per coin at end

// Level themes (sky gradients)
export const THEMES = {
  farm:    { skyTop: 0x87CEEB, skyBot: 0xE0F0FF, hills1: 0x7BA05B, hills2: 0x6B8E4E, name: "Green Pastures" },
  village: { skyTop: 0x87CEEB, skyBot: 0xF5E6D0, hills1: 0x8B9E6B, hills2: 0x7B8E5B, name: "Milk Village" },
  forest:  { skyTop: 0x5B8C5A, skyBot: 0xA8D5A2, hills1: 0x3D6B3D, hills2: 0x4A7A4A, name: "Deep Forest" },
  mountain:{ skyTop: 0x6B7B8D, skyBot: 0xB0C4DE, hills1: 0x7B8B9D, hills2: 0x8B9BAD, name: "Mountain Pass" },
  river:   { skyTop: 0x5B8CAA, skyBot: 0xB0D8F0, hills1: 0x5B8C7A, hills2: 0x6B9C8A, name: "River Crossing" },
  factoryExt: { skyTop: 0x8B8B8B, skyBot: 0xC0C0C0, hills1: 0x7B7B7B, hills2: 0x9B9B9B, name: "Factory Gates" },
  factoryInt: { skyTop: 0x4A4A4A, skyBot: 0x7A7A7A, hills1: 0x5A5A5A, hills2: 0x6A6A6A, name: "Factory Floor" },
  final:   { skyTop: 0x2A1A4A, skyBot: 0x6A4AAA, hills1: 0x3A2A5A, hills2: 0x4A3A6A, name: "Final Delivery" },
};
