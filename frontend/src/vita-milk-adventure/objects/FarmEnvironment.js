export class FarmEnvironment {
  static create(scene, level) {
    const isFarm = level.theme === "farm";
    const computedGroundY = Math.min(
      ...level.staticPlatforms
        .filter(([, y]) => y >= 650)
        .map(([, y]) => y - 12),
      683,
    );
    const groundY = level.groundY ?? computedGroundY;
    const sky = scene.add.graphics();
    sky.fillStyle(isFarm ? 0x8ed4ef : level.theme === "mega" ? 0x202644 : 0x526474, 1).fillRect(0, 0, level.worldWidth, level.worldHeight);
    sky.fillStyle(isFarm ? 0x9bc98c : 0x6b7c89, 0.8);
    for (let x = 0; x < level.worldWidth; x += 320) sky.fillCircle(x + 160, 650, 220);
    sky.fillStyle(isFarm ? 0x70a75f : 0x3e4d5c, 0.75);
    for (let x = 0; x < level.worldWidth; x += 440) sky.fillCircle(x + 210, 680, 180);
    sky.setDepth(-10);
    let cowNpcs = [];
    if (isFarm) {
      level.trees.forEach((x) => scene.add.image(x, groundY, "farm-tree").setOrigin(0.5, 1).setDepth(1));
      cowNpcs = level.cows.map((x, index) => {
        // Keep each cow within its starting solid-ground segment. Spikes do not
        // affect these bounds, so cows can walk over them but never into a gap.
        const segment = level.staticPlatforms.find(([center, y, width]) => (
          y >= 650 && x >= center - width / 2 && x <= center + width / 2
        ));
        const [center, , width] = segment || level.staticPlatforms[0];
        const minX = center - width / 2 + 38;
        const maxX = center + width / 2 - 38;
        const startX = Math.min(maxX, Math.max(minX, x));
        const cow = scene.add.image(startX, groundY, "farm-cow").setOrigin(0.5, 1).setDepth(18);
        scene.physics.add.existing(cow);
        cow.body.setSize(66, 38).setOffset(4, 8).setAllowGravity(false).setImmovable(true);
        cow.body.setVelocityX(index % 2 === 0 ? 46 : -46);
        return { cow, minX, maxX, direction: index % 2 === 0 ? 1 : -1 };
      });
    } else {
      for (let x = 250; x < level.worldWidth; x += 520) {
        const tank = scene.add.container(x, groundY - 81).setDepth(2);
        tank.add(scene.add.rectangle(0, 0, 80, 115, 0xb8c8d2).setStrokeStyle(3, 0xe8f2f7));
        tank.add(scene.add.ellipse(0, -57, 80, 20, 0xd9e6ec));
        tank.add(scene.add.rectangle(0, 2, 60, 42, 0xd8f3ff, 0.5));
        tank.add(scene.add.rectangle(-26, 64, 8, 34, 0x7b8790));
        tank.add(scene.add.rectangle(26, 64, 8, 34, 0x7b8790));
      }
      for (let x = 520; x < level.worldWidth; x += 740) {
        scene.add.rectangle(x, groundY - 40, 145, 80, 0x3b4754).setStrokeStyle(3, 0x94a5b5).setDepth(2);
        scene.add.circle(x - 38, groundY - 30, 15, 0x8ea3b2).setDepth(3);
        scene.add.circle(x + 35, groundY - 55, 22, 0x8ea3b2).setDepth(3);
      }
    }
    for (let x = 90; x < level.worldWidth; x += 110) {
      scene.add.rectangle(x, groundY - 9, 2, 18, 0x508331, 0.65).setDepth(3);
    }
    return cowNpcs;
  }

  static updateCows(cows = []) {
    cows.forEach((npc) => {
      if (npc.cow.x >= npc.maxX) npc.direction = -1;
      if (npc.cow.x <= npc.minX) npc.direction = 1;
      npc.cow.body.setVelocityX(npc.direction * 46);
      npc.cow.setFlipX(npc.direction < 0);
    });
  }
}
