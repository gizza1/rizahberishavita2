const ground = (start, count) => Array.from({ length: count }, (_, index) => [start + index * 760, 680, 720]);

export const VitaProcessingFactory = {
  id: "vita-processing-factory",
  name: "Vita Processing Factory",
  theme: "processing",
  worldWidth: 10800,
  worldHeight: 720,
  spawn: { x: 120, y: 590 },
  requiredMilk: 30,
  staticPlatforms: ground(360, 14),
  floatingPlatforms: Array.from({ length: 15 }, (_, i) => [600 + i * 680, 500 - (i % 3) * 42, 180]),
  movingPlatforms: [[1540, 450, 150, "x"], [3700, 420, 170, "y"], [6180, 440, 160, "x"], [8600, 410, 170, "y"]],
  conveyors: [[2450, 580, 240, 1], [5050, 580, 260, -1], [7500, 580, 240, 1]],
  hiddenPlatforms: [[3200, 410, 150], [7050, 385, 170]],
  bouncePlatforms: [[4300, 580, 130], [9300, 580, 130]],
  bottles: Array.from({ length: 36 }, (_, i) => [220 + i * 285, i % 3 === 0 ? 610 : 430 + (i % 2) * 55]),
  hiddenBottleIndexes: [11, 23, 31, 34],
  spikes: [[980, 668], [2900, 668], [4700, 668], [6850, 668], [8900, 668]],
  factory: { x: 10420, y: 668 },
};

export const MediumLevel = VitaProcessingFactory;
