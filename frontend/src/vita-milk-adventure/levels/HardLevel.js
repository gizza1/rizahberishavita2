const ground = (start, count) => Array.from({ length: count }, (_, index) => [start + index * 780, 680, 720]);

export const VitaMegaFactory = {
  id: "vita-mega-factory",
  name: "Vita Mega Factory",
  theme: "mega",
  worldWidth: 14800,
  worldHeight: 720,
  spawn: { x: 120, y: 590 },
  requiredMilk: 50,
  staticPlatforms: ground(360, 19),
  floatingPlatforms: Array.from({ length: 22 }, (_, i) => [540 + i * 630, 510 - (i % 4) * 48, 170]),
  movingPlatforms: [[1500, 450, 150, "x"], [3300, 400, 160, "y"], [5700, 440, 150, "x"], [8200, 400, 160, "y"], [10600, 440, 150, "x"], [12800, 390, 160, "y"]],
  disappearingPlatforms: [[2450, 440, 140], [4850, 380, 150], [7350, 430, 140], [9800, 370, 150], [12100, 420, 150]],
  hiddenPlatforms: [[2000, 350, 150], [6700, 330, 160], [11200, 320, 170], [13700, 350, 160]],
  conveyors: [[3900, 580, 250, 1], [6600, 580, 250, -1], [9400, 580, 250, 1], [11800, 580, 250, -1]],
  bouncePlatforms: [[2900, 580, 130], [7600, 580, 130], [13200, 580, 130]],
  bottles: Array.from({ length: 58 }, (_, i) => [180 + i * 248, i % 4 === 0 ? 610 : 370 + (i % 3) * 70]),
  hiddenBottleIndexes: [6, 14, 21, 29, 37, 44, 51, 55],
  spikes: [[850, 668], [1900, 668], [3500, 668], [5300, 668], [7100, 668], [9000, 668], [10900, 668], [12700, 668]],
  factory: { x: 14420, y: 668 },
};

export const HardLevel = VitaMegaFactory;
