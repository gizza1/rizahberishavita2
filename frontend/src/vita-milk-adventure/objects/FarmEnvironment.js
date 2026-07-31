export class FarmEnvironment {
  static create(scene, level) {
    const sky = scene.add.graphics();
    sky.fillStyle(0x8ed4ef, 1).fillRect(0, 0, level.worldWidth, level.worldHeight);
    sky.fillStyle(0x9bc98c, 0.8);
    for (let x = 0; x < level.worldWidth; x += 320) sky.fillCircle(x + 160, 650, 220);
    sky.fillStyle(0x70a75f, 0.75);
    for (let x = 0; x < level.worldWidth; x += 440) sky.fillCircle(x + 210, 680, 180);
    sky.setDepth(-10);
    level.trees.forEach((x) => scene.add.image(x, 668, "farm-tree").setOrigin(0.5, 1).setDepth(1));
    level.cows.forEach((x) => scene.add.image(x, 640, "farm-cow").setOrigin(0.5, 1).setDepth(2));
    for (let x = 90; x < level.worldWidth; x += 110) {
      scene.add.rectangle(x, 656, 2, 18, 0x508331, 0.65).setDepth(3);
    }
  }
}
