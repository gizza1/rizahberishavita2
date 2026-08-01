// Vita Milk Rush — Level Data (8 handcrafted levels)
// Each level: { theme, worldWidth, groundSegments, platforms,
//   pickups (typed), obstacles, coins, checkpoints, movingPlatforms }
// New: coins[], checkpoints[], movingPlatforms[]

const BASE_LEVELS = [
  // ═══════════════════════════════════════════
  // LEVEL 1 — FARM (tutorial)
  // ═══════════════════════════════════════════
  {
    theme: "farm",
    worldWidth: 4000,
    factoryX: 3850,
    groundSegments: [
      [0, 600, 620], [640, 1200, 620], [1280, 1600, 620],
      [1700, 2200, 600], [2300, 2800, 620], [2880, 3400, 620],
      [3480, 4000, 620],
    ],
    platforms: [
      { x: 300, y: 500, w: 140 }, { x: 600, y: 420, w: 120 },
      { x: 1100, y: 480, w: 160 }, { x: 1500, y: 400, w: 140 },
      { x: 2000, y: 460, w: 180 }, { x: 2500, y: 400, w: 140 },
      { x: 3100, y: 480, w: 160 },
    ],
    pickups: [
      { x: 200, y: 560, type: "small" }, { x: 450, y: 560, type: "small" },
      { x: 800, y: 560, type: "medium" }, { x: 1300, y: 560, type: "small" },
      { x: 1550, y: 360, type: "golden" }, { x: 2100, y: 560, type: "medium" },
      { x: 2600, y: 560, type: "small" }, { x: 2900, y: 560, type: "small" },
      { x: 3200, y: 560, type: "large" }, { x: 3600, y: 560, type: "small" },
    ],
    obstacles: [
      // Farm — simple spikes and hay bales
      { type: "spike", x: 500, y: 595 },
      { type: "spike", x: 1800, y: 575 },
      { type: "spike", x: 2500, y: 595 },
      { type: "milk_spill", x: 3200, y: 612, w: 120, h: 10 },
    ],
    coins: [
      [350, 550], [380, 540], [410, 530], // ground trail
      [620, 380], [640, 370],             // platform arc
      [1600, 540], [1630, 530], [1660, 520],
      [3050, 540], [3080, 530], [3110, 520],
    ],
    checkpoints: [1200],
    movingPlatforms: [],
  },

  // ═══════════════════════════════════════════
  // LEVEL 2 — VILLAGE (moving platforms)
  // ═══════════════════════════════════════════
  {
    theme: "village",
    worldWidth: 4800,
    factoryX: 4650,
    groundSegments: [
      [0, 500, 620], [600, 1000, 600], [1100, 1400, 640],
      [1500, 2000, 580], [2100, 2500, 620], [2600, 3200, 600],
      [3300, 3800, 620], [3900, 4400, 600], [4480, 4800, 620],
    ],
    platforms: [
      { x: 400, y: 480, w: 160 }, { x: 800, y: 400, w: 120 },
      { x: 1200, y: 500, w: 140 }, { x: 1700, y: 420, w: 180 },
      { x: 2300, y: 460, w: 140 }, { x: 2800, y: 400, w: 160 },
      { x: 3500, y: 480, w: 180 }, { x: 4200, y: 420, w: 140 },
    ],
    pickups: [
      { x: 250, y: 560, type: "small" }, { x: 800, y: 360, type: "medium" },
      { x: 1200, y: 560, type: "small" }, { x: 1750, y: 380, type: "golden" },
      { x: 2300, y: 560, type: "small" }, { x: 2850, y: 360, type: "large" },
      { x: 3500, y: 560, type: "medium" }, { x: 4000, y: 560, type: "small" },
      { x: 4400, y: 560, type: "small" },
    ],
    obstacles: [
      // Village — cows, fences, mud
      { type: "cow", x: 700, y: 595, range: 150, speed: 50 },
      { type: "fence", x: 1600, y: 595 },
      { type: "cow", x: 2800, y: 595, range: 200, speed: 60 },
      { type: "mud", x: 3600, y: 612, w: 160, h: 16 },
      { type: "spike", x: 4300, y: 595 },
    ],
    coins: [
      [450, 440], [470, 430], [490, 420],
      [1700, 380], [1740, 370], [1780, 360],
      [3000, 540], [3030, 530], [3060, 520],
    ],
    checkpoints: [900, 2600],
    movingPlatforms: [
      // { x, y, w, axis: 'x'|'y', range, speed }
      { x: 900, y: 480, w: 120, axis: "x", range: 150, speed: 1200 },
      { x: 2200, y: 380, w: 120, axis: "y", range: 80, speed: 1800 },
      { x: 3400, y: 440, w: 140, axis: "x", range: 180, speed: 1500 },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 3 — FOREST (vertical + hidden routes)
  // ═══════════════════════════════════════════
  {
    theme: "forest",
    worldWidth: 5600,
    weather: "fog",
    weatherIntensity: 0.6,
    factoryX: 5450,
    groundSegments: [
      [0, 400, 620], [500, 800, 640], [900, 1200, 600],
      [1300, 1800, 620], [1900, 2200, 580], [2300, 2600, 640],
      [2700, 3200, 600], [3300, 3600, 620], [3700, 4200, 580],
      [4300, 4800, 620], [4900, 5400, 600], [5480, 5600, 620],
    ],
    platforms: [
      // Main path
      { x: 300, y: 500, w: 140 }, { x: 700, y: 420, w: 160 },
      { x: 1100, y: 480, w: 140 }, { x: 1600, y: 380, w: 180 },
      { x: 2100, y: 460, w: 140 }, { x: 2500, y: 400, w: 160 },
      { x: 3000, y: 480, w: 140 }, { x: 3500, y: 420, w: 180 },
      { x: 4000, y: 480, w: 140 }, { x: 4600, y: 400, w: 160 },
      { x: 5200, y: 480, w: 140 },
      // Upper hidden route (left side)
      { x: 500, y: 280, w: 100 }, { x: 800, y: 300, w: 100 },
      { x: 1100, y: 250, w: 120 }, { x: 1400, y: 280, w: 100 },
      // Upper hidden route (right side)
      { x: 3100, y: 260, w: 120 }, { x: 3500, y: 240, w: 140 },
      { x: 3900, y: 280, w: 120 },
    ],
    pickups: [
      { x: 200, y: 560, type: "small" }, { x: 700, y: 380, type: "medium" },
      { x: 1200, y: 560, type: "small" }, { x: 1650, y: 340, type: "large" },
      { x: 2100, y: 560, type: "small" }, { x: 2500, y: 360, type: "golden" },
      { x: 3000, y: 560, type: "medium" }, { x: 3500, y: 380, type: "small" },
      { x: 4100, y: 560, type: "small" }, { x: 4600, y: 360, type: "large" },
      { x: 5200, y: 560, type: "medium" },
      // Secret upper pickups
      { x: 550, y: 230, type: "golden" },
      { x: 850, y: 250, type: "large" },
      { x: 3200, y: 210, type: "golden" },
      { x: 3550, y: 190, type: "large" },
    ],
    obstacles: [
      // Forest — falling hay, water, spikes
      { type: "hay", x: 600, y: 100, falling: true },
      { type: "water", x: 1400, y: 620, w: 200, h: 60 },
      { type: "spike", x: 2000, y: 595 },
      { type: "hay", x: 2800, y: 100, falling: true },
      { type: "cheese", x: 3800, y: 300, vx: 120, vy: -250 },
      { type: "spike", x: 5000, y: 595 },
    ],
    coins: [
      [600, 380], [630, 370], [660, 360],
      [1550, 340], [1580, 330], [1610, 320],
      [2500, 360], [2540, 350], [2580, 340],
      [4600, 360], [4630, 350], [4660, 340],
    ],
    checkpoints: [1000, 2800, 4300],
    movingPlatforms: [
      { x: 1400, y: 440, w: 120, axis: "x", range: 200, speed: 1500 },
      { x: 3000, y: 420, w: 140, axis: "y", range: 100, speed: 2000 },
      { x: 5000, y: 440, w: 120, axis: "x", range: 160, speed: 1400 },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 4 — MOUNTAIN (steep climbs, coin trails)
  // ═══════════════════════════════════════════
  {
    theme: "mountain",
    worldWidth: 6000,
    factoryX: 5850,
    groundSegments: [
      [0, 400, 620], [500, 700, 580], [800, 1000, 540],
      [1100, 1300, 500], [1400, 1600, 460], [1700, 1900, 500],
      [2000, 2300, 540], [2400, 2700, 580], [2800, 3100, 620],
      [3200, 3500, 580], [3600, 3900, 540], [4000, 4300, 500],
      [4400, 4700, 540], [4800, 5200, 580], [5300, 5700, 620],
      [5750, 6000, 620],
    ],
    platforms: [
      { x: 450, y: 440, w: 120 }, { x: 850, y: 380, w: 140 },
      { x: 1200, y: 340, w: 120 }, { x: 1550, y: 380, w: 140 },
      { x: 1900, y: 420, w: 160 }, { x: 2600, y: 440, w: 140 },
      { x: 3000, y: 480, w: 120 }, { x: 3400, y: 420, w: 140 },
      { x: 3800, y: 380, w: 160 }, { x: 4200, y: 340, w: 140 },
      { x: 4600, y: 400, w: 120 }, { x: 5000, y: 440, w: 160 },
      { x: 5500, y: 480, w: 140 },
    ],
    pickups: [
      { x: 250, y: 560, type: "small" }, { x: 900, y: 340, type: "medium" },
      { x: 1300, y: 560, type: "small" }, { x: 1600, y: 340, type: "large" },
      { x: 2200, y: 560, type: "medium" }, { x: 2700, y: 560, type: "small" },
      { x: 3100, y: 560, type: "golden" }, { x: 3500, y: 380, type: "small" },
      { x: 3900, y: 340, type: "large" }, { x: 4400, y: 560, type: "medium" },
      { x: 5000, y: 560, type: "small" }, { x: 5600, y: 560, type: "small" },
    ],
    obstacles: [
      // Mountain — tractors, cheese, hay bales
      { type: "tractor", x: 600, y: 595, range: 250, speed: 80 },
      { type: "hay", x: 1050, y: 595 },
      { type: "cheese", x: 1500, y: 200, vx: 100, vy: -200 },
      { type: "tractor", x: 2500, y: 595, range: 300, speed: 90 },
      { type: "hay", x: 3300, y: 595 },
      { type: "cheese", x: 4100, y: 250, vx: 130, vy: -220 },
      { type: "spike", x: 5200, y: 595 },
      { type: "spike", x: 5600, y: 595 },
    ],
    coins: [
      [500, 400], [530, 390], [560, 380], [590, 370], // slope trail
      [1550, 340], [1580, 330], [1610, 320],
      [3500, 380], [3530, 370], [3560, 360], [3590, 350],
      [4200, 300], [4230, 290], [4260, 280],
    ],
    checkpoints: [800, 2400, 4400],
    movingPlatforms: [
      { x: 700, y: 420, w: 120, axis: "y", range: 80, speed: 1400 },
      { x: 2200, y: 460, w: 140, axis: "x", range: 200, speed: 1800 },
      { x: 4000, y: 400, w: 120, axis: "y", range: 100, speed: 1200 },
      { x: 5200, y: 460, w: 140, axis: "x", range: 180, speed: 1600 },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 5 — RIVER (timing challenges)
  // ═══════════════════════════════════════════
  {
    theme: "river",
    worldWidth: 6400,
    weather: "rain",
    weatherIntensity: 0.7,
    factoryX: 6250,
    groundSegments: [
      [0, 300, 620], [400, 600, 620], [700, 900, 620],
      [1100, 1400, 620], [1600, 1800, 620], [2000, 2300, 620],
      [2500, 2800, 620], [3000, 3200, 620], [3400, 3700, 620],
      [3900, 4300, 620], [4500, 4800, 620], [5000, 5300, 620],
      [5500, 5900, 620], [6000, 6400, 620],
    ],
    platforms: [
      { x: 350, y: 480, w: 100 }, { x: 500, y: 420, w: 100 },
      { x: 950, y: 440, w: 120 }, { x: 1500, y: 460, w: 140 },
      { x: 1900, y: 400, w: 120 }, { x: 2400, y: 480, w: 100 },
      { x: 2700, y: 420, w: 140 }, { x: 3300, y: 460, w: 120 },
      { x: 3600, y: 400, w: 140 }, { x: 4200, y: 480, w: 120 },
      { x: 4700, y: 420, w: 140 }, { x: 5200, y: 460, w: 120 },
      { x: 5600, y: 400, w: 140 }, { x: 6100, y: 460, w: 120 },
    ],
    pickups: [
      { x: 200, y: 560, type: "small" }, { x: 600, y: 380, type: "medium" },
      { x: 1000, y: 560, type: "small" }, { x: 1550, y: 420, type: "large" },
      { x: 2000, y: 360, type: "golden" }, { x: 2500, y: 560, type: "small" },
      { x: 2800, y: 380, type: "medium" }, { x: 3400, y: 560, type: "small" },
      { x: 3700, y: 360, type: "large" }, { x: 4300, y: 560, type: "medium" },
      { x: 4800, y: 380, type: "small" }, { x: 5300, y: 560, type: "small" },
      { x: 5800, y: 560, type: "large" }, { x: 6200, y: 420, type: "golden" },
    ],
    obstacles: [
      // River — water hazards, mud, cows
      { type: "water", x: 450, y: 625, w: 200, h: 50 },
      { type: "water", x: 1200, y: 625, w: 240, h: 50 },
      { type: "mud", x: 1800, y: 612, w: 160, h: 16 },
      { type: "cow", x: 3100, y: 595, range: 180, speed: 55 },
      { type: "water", x: 4000, y: 625, w: 220, h: 50 },
      { type: "spike", x: 5100, y: 595 },
    ],
    coins: [
      [950, 400], [980, 390], [1010, 380],
      [1900, 360], [1930, 350], [1960, 340],
      [2700, 380], [2730, 370], [2760, 360],
      [4700, 380], [4730, 370], [4760, 360],
      [6100, 420], [6130, 410], [6160, 400],
    ],
    checkpoints: [700, 2500, 3900, 5000],
    movingPlatforms: [
      { x: 700, y: 460, w: 120, axis: "y", range: 120, speed: 1000 },
      { x: 2100, y: 440, w: 140, axis: "x", range: 250, speed: 2000 },
      { x: 3500, y: 440, w: 120, axis: "y", range: 100, speed: 1200 },
      { x: 4900, y: 440, w: 140, axis: "x", range: 200, speed: 1500 },
      { x: 5900, y: 440, w: 120, axis: "y", range: 140, speed: 1100 },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 6 — FACTORY EXTERIOR (fast platforms)
  // ═══════════════════════════════════════════
  {
    theme: "factoryExt",
    worldWidth: 6400,
    factoryX: 6250,
    groundSegments: [
      [0, 400, 620], [500, 800, 600], [900, 1200, 640],
      [1300, 1700, 600], [1800, 2100, 620], [2300, 2600, 580],
      [2700, 3000, 620], [3200, 3600, 600], [3700, 4000, 620],
      [4200, 4500, 580], [4600, 5000, 620], [5100, 5500, 600],
      [5600, 6000, 620], [6100, 6400, 620],
    ],
    platforms: [
      { x: 350, y: 480, w: 140 }, { x: 750, y: 400, w: 120 },
      { x: 1100, y: 500, w: 140 }, { x: 1500, y: 420, w: 160 },
      { x: 2000, y: 480, w: 120 }, { x: 2500, y: 400, w: 140 },
      { x: 2900, y: 480, w: 160 }, { x: 3400, y: 420, w: 120 },
      { x: 3900, y: 500, w: 140 }, { x: 4400, y: 400, w: 160 },
      { x: 4800, y: 480, w: 120 }, { x: 5300, y: 420, w: 140 },
      { x: 5800, y: 500, w: 160 }, { x: 6200, y: 440, w: 120 },
    ],
    pickups: [
      { x: 250, y: 560, type: "small" }, { x: 800, y: 360, type: "medium" },
      { x: 1200, y: 560, type: "small" }, { x: 1600, y: 380, type: "large" },
      { x: 2100, y: 560, type: "small" }, { x: 2600, y: 360, type: "golden" },
      { x: 3000, y: 560, type: "medium" }, { x: 3500, y: 380, type: "small" },
      { x: 4000, y: 560, type: "large" }, { x: 4500, y: 360, type: "small" },
      { x: 4900, y: 560, type: "medium" }, { x: 5400, y: 380, type: "small" },
      { x: 5900, y: 560, type: "large" },
      // Secrets on fast platforms
      { x: 750, y: 360, type: "golden" },
      { x: 3400, y: 380, type: "golden" },
    ],
    obstacles: [
      // Factory Exterior — conveyors, tractors, fences
      { type: "conveyor", x: 550, y: 610, w: 160, h: 14, direction: 1 },
      { type: "tractor", x: 1400, y: 595, range: 280, speed: 100 },
      { type: "conveyor", x: 2200, y: 610, w: 160, h: 14, direction: -1 },
      { type: "spike", x: 3300, y: 595 },
      { type: "fence", x: 4300, y: 595 },
      { type: "tractor", x: 5200, y: 595, range: 300, speed: 110 },
      { type: "conveyor", x: 6000, y: 610, w: 180, h: 14, direction: 1 },
    ],
    coins: [
      [750, 360], [780, 350], [810, 340],
      [1600, 380], [1630, 370], [1660, 360],
      [4400, 360], [4430, 350], [4460, 340],
    ],
    checkpoints: [900, 2700, 4600],
    movingPlatforms: [
      { x: 600, y: 440, w: 120, axis: "x", range: 250, speed: 900 },
      { x: 1700, y: 460, w: 140, axis: "y", range: 100, speed: 800 },
      { x: 3100, y: 440, w: 120, axis: "x", range: 300, speed: 1000 },
      { x: 4600, y: 440, w: 140, axis: "x", range: 250, speed: 900 },
      { x: 5500, y: 460, w: 120, axis: "y", range: 120, speed: 800 },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 7 — FACTORY INTERIOR (complex platforming)
  // ═══════════════════════════════════════════
  {
    theme: "factoryInt",
    worldWidth: 6000,
    factoryX: 5850,
    groundSegments: [
      [0, 300, 620], [400, 600, 620], [700, 900, 620],
      [1100, 1400, 600], [1500, 1700, 620], [1900, 2200, 580],
      [2300, 2500, 620], [2700, 3000, 600], [3100, 3400, 620],
      [3600, 3900, 580], [4000, 4200, 620], [4400, 4700, 600],
      [4800, 5100, 620], [5300, 5600, 580], [5700, 6000, 620],
    ],
    platforms: [
      { x: 250, y: 480, w: 100 }, { x: 500, y: 400, w: 140 },
      { x: 800, y: 500, w: 120 }, { x: 1200, y: 380, w: 100 },
      { x: 1400, y: 300, w: 120 }, { x: 1700, y: 460, w: 140 },
      { x: 2100, y: 360, w: 120 }, { x: 2400, y: 480, w: 160 },
      { x: 2900, y: 380, w: 120 }, { x: 3200, y: 460, w: 140 },
      { x: 3800, y: 340, w: 120 }, { x: 4100, y: 480, w: 160 },
      { x: 4600, y: 380, w: 120 }, { x: 5000, y: 480, w: 140 },
      { x: 5500, y: 380, w: 160 }, { x: 5800, y: 480, w: 120 },
    ],
    pickups: [
      { x: 200, y: 560, type: "small" }, { x: 550, y: 360, type: "medium" },
      { x: 900, y: 560, type: "small" }, { x: 1250, y: 340, type: "large" },
      { x: 1600, y: 560, type: "small" }, { x: 2150, y: 320, type: "golden" },
      { x: 2500, y: 560, type: "medium" }, { x: 3000, y: 340, type: "small" },
      { x: 3400, y: 560, type: "large" }, { x: 4000, y: 560, type: "small" },
      { x: 4400, y: 560, type: "medium" }, { x: 4800, y: 340, type: "small" },
      { x: 5200, y: 560, type: "golden" }, { x: 5600, y: 340, type: "large" },
    ],
    obstacles: [
      // Factory Interior — machinery, steam, conveyors
      { type: "steam", x: 350, y: 595, interval: 1800, force: -400 },
      { type: "machinery", x: 1000, y: 595, range: 50, speed: 1200 },
      { type: "spike", x: 1600, y: 595 },
      { type: "conveyor", x: 2000, y: 610, w: 180, h: 14, direction: 1 },
      { type: "steam", x: 2800, y: 595, interval: 1500, force: -380 },
      { type: "machinery", x: 3700, y: 595, range: 60, speed: 1000 },
      { type: "conveyor", x: 4500, y: 610, w: 200, h: 14, direction: -1 },
      { type: "steam", x: 5400, y: 595, interval: 2000, force: -420 },
    ],
    coins: [
      [800, 460], [830, 450], [860, 440],
      [1700, 420], [1730, 410], [1760, 400],
      [2900, 340], [2930, 330], [2960, 320],
      [4600, 340], [4630, 330], [4660, 320],
      [5500, 340], [5530, 330], [5560, 320],
    ],
    checkpoints: [600, 2300, 4000, 4800],
    movingPlatforms: [
      { x: 600, y: 420, w: 100, axis: "y", range: 140, speed: 900 },
      { x: 1600, y: 400, w: 120, axis: "x", range: 200, speed: 1000 },
      { x: 2800, y: 420, w: 120, axis: "y", range: 120, speed: 800 },
      { x: 4200, y: 440, w: 140, axis: "x", range: 250, speed: 1100 },
      { x: 5200, y: 420, w: 120, axis: "y", range: 150, speed: 900 },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 8 — FINAL DELIVERY (everything combined)
  // ═══════════════════════════════════════════
  {
    theme: "final",
    worldWidth: 7200,
    factoryX: 7050,
    groundSegments: [
      [0, 400, 620], [500, 700, 580], [800, 1000, 560],
      [1100, 1400, 620], [1500, 1700, 580], [1800, 2000, 640],
      [2100, 2400, 600], [2500, 2700, 620], [2800, 3200, 580],
      [3300, 3500, 620], [3600, 3900, 600], [4000, 4300, 620],
      [4400, 4600, 580], [4700, 5000, 620], [5100, 5400, 600],
      [5500, 5800, 620], [5900, 6200, 580], [6300, 6600, 620],
      [6700, 7000, 600], [7050, 7200, 620],
    ],
    platforms: [
      { x: 350, y: 460, w: 120 }, { x: 650, y: 380, w: 140 },
      { x: 950, y: 480, w: 120 }, { x: 1300, y: 400, w: 160 },
      { x: 1600, y: 340, w: 120 }, { x: 1900, y: 480, w: 140 },
      { x: 2300, y: 380, w: 120 }, { x: 2600, y: 460, w: 160 },
      { x: 3000, y: 340, w: 120 }, { x: 3400, y: 480, w: 140 },
      { x: 3800, y: 380, w: 120 }, { x: 4200, y: 460, w: 160 },
      { x: 4500, y: 340, w: 140 }, { x: 4900, y: 480, w: 120 },
      { x: 5300, y: 380, w: 160 }, { x: 5700, y: 460, w: 120 },
      { x: 6100, y: 340, w: 140 }, { x: 6500, y: 480, w: 160 },
      { x: 6900, y: 400, w: 120 },
    ],
    pickups: [
      { x: 200, y: 560, type: "medium" }, { x: 700, y: 340, type: "large" },
      { x: 1000, y: 560, type: "small" }, { x: 1400, y: 360, type: "golden" },
      { x: 1700, y: 560, type: "medium" }, { x: 2000, y: 560, type: "small" },
      { x: 2400, y: 340, type: "large" }, { x: 2800, y: 560, type: "small" },
      { x: 3100, y: 300, type: "golden" }, { x: 3500, y: 560, type: "medium" },
      { x: 3900, y: 340, type: "small" }, { x: 4300, y: 560, type: "large" },
      { x: 4700, y: 560, type: "small" }, { x: 5000, y: 340, type: "golden" },
      { x: 5400, y: 560, type: "medium" }, { x: 5800, y: 560, type: "small" },
      { x: 6200, y: 300, type: "large" }, { x: 6600, y: 560, type: "medium" },
      { x: 7000, y: 360, type: "golden" },
    ],
    obstacles: [
      // Final Delivery — everything combined
      { type: "tractor", x: 450, y: 595, range: 250, speed: 100 },
      { type: "steam", x: 900, y: 595, interval: 1500, force: -420 },
      { type: "cow", x: 1200, y: 595, range: 180, speed: 60 },
      { type: "fence", x: 1800, y: 595 },
      { type: "cheese", x: 2200, y: 250, vx: 140, vy: -240 },
      { type: "machinery", x: 2900, y: 595, range: 55, speed: 900 },
      { type: "water", x: 3500, y: 625, w: 200, h: 50 },
      { type: "conveyor", x: 4100, y: 610, w: 200, h: 14, direction: 1 },
      { type: "tractor", x: 4800, y: 595, range: 300, speed: 120 },
      { type: "steam", x: 5300, y: 595, interval: 1200, force: -450 },
      { type: "machinery", x: 5800, y: 595, range: 65, speed: 800 },
      { type: "spike", x: 6400, y: 595 },
    ],
    coins: [
      [650, 340], [680, 330], [710, 320],
      [1300, 360], [1330, 350], [1360, 340],
      [2300, 340], [2330, 330], [2360, 320],
      [3000, 300], [3030, 290], [3060, 280],
      [4500, 300], [4530, 290], [4560, 280],
      [5700, 420], [5730, 410], [5760, 400],
      [6500, 440], [6530, 430], [6560, 420],
    ],
    checkpoints: [800, 2100, 3600, 5100, 6300],
    movingPlatforms: [
      { x: 800, y: 420, w: 120, axis: "x", range: 250, speed: 800 },
      { x: 1600, y: 400, w: 140, axis: "y", range: 120, speed: 700 },
      { x: 2500, y: 420, w: 120, axis: "x", range: 300, speed: 900 },
      { x: 3800, y: 420, w: 140, axis: "y", range: 140, speed: 800 },
      { x: 5000, y: 440, w: 120, axis: "x", range: 280, speed: 850 },
      { x: 6200, y: 400, w: 140, axis: "y", range: 160, speed: 750 },
      { x: 6800, y: 440, w: 120, axis: "x", range: 220, speed: 900 },
    ],
  },
];

// Shared layout tuning: wider routes make every map feel more expansive, while
// lower airborne platforms make the full campaign easier to jump through.
const MAP_WIDTH_SCALE = 1.12;
const PLATFORM_DROP = 35;
const elevatedY = (y) => (y < 540 ? y + PLATFORM_DROP : y);

export const LEVELS = BASE_LEVELS.map((level) => ({
  ...level,
  worldWidth: Math.round(level.worldWidth * MAP_WIDTH_SCALE),
  factoryX: Math.round(level.factoryX * MAP_WIDTH_SCALE),
  groundSegments: level.groundSegments.map(([start, end, y]) => [
    Math.round(start * MAP_WIDTH_SCALE),
    Math.round(end * MAP_WIDTH_SCALE),
    y,
  ]),
  platforms: level.platforms.map((platform) => ({
    ...platform,
    x: Math.round(platform.x * MAP_WIDTH_SCALE),
    w: Math.round(platform.w * MAP_WIDTH_SCALE),
    y: platform.y + PLATFORM_DROP,
  })),
  movingPlatforms: (level.movingPlatforms || []).map((platform) => ({
    ...platform,
    x: Math.round(platform.x * MAP_WIDTH_SCALE),
    w: Math.round(platform.w * MAP_WIDTH_SCALE),
    range: Math.round(platform.range * MAP_WIDTH_SCALE),
    y: platform.y + PLATFORM_DROP,
  })),
  pickups: level.pickups.map((pickup) => ({
    ...pickup,
    x: Math.round(pickup.x * MAP_WIDTH_SCALE),
    y: elevatedY(pickup.y),
  })),
  coins: (level.coins || []).map(([x, y]) => [
    Math.round(x * MAP_WIDTH_SCALE),
    elevatedY(y),
  ]),
  checkpoints: (level.checkpoints || []).map((x) => Math.round(x * MAP_WIDTH_SCALE)),
  obstacles: level.obstacles.map((obstacle) => ({
    ...obstacle,
    x: Number.isFinite(obstacle.x) ? Math.round(obstacle.x * MAP_WIDTH_SCALE) : obstacle.x,
    w: Number.isFinite(obstacle.w) ? Math.round(obstacle.w * MAP_WIDTH_SCALE) : obstacle.w,
    range: Number.isFinite(obstacle.range) ? Math.round(obstacle.range * MAP_WIDTH_SCALE) : obstacle.range,
  })),
})).map((level) => {
  const platformBounds = [
    ...level.platforms.map((platform) => ({
      left: platform.x,
      right: platform.x + platform.w,
      y: platform.y,
    })),
    ...level.movingPlatforms.map((platform) => ({
      left: platform.x - platform.w / 2,
      right: platform.x + platform.w / 2,
      y: platform.y,
    })),
  ];

  return {
    ...level,
    coins: level.coins.map(([x, y]) => {
      const platform = platformBounds
        .filter(({ left, right }) => x >= left && x <= right)
        .sort((a, b) => Math.abs(a.y - y) - Math.abs(b.y - y))[0];
      // Coin centers must stay above the platform top, never inside its body.
      return platform && y > platform.y - 28 ? [x, platform.y - 28] : [x, y];
    }),
  };
});
