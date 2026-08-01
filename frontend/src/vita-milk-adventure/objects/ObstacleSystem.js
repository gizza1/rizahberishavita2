export class ObstacleSystem {
  constructor(scene, player, onHit) {
    this.scene = scene;
    this.player = player;
    this.onHit = onHit;
    this.spikes = scene.physics.add.staticGroup();
    scene.physics.add.overlap(player, this.spikes, () => this.hitPlayer());
  }

  addSpike(x, groundY, scale = 1) {
    const spike = this.spikes.create(x, groundY, "farm-spike")
      .setOrigin(0.5, 1)
      .setScale(scale)
      .setDepth(25);
    spike.body.setSize(24 * scale, 16 * scale).setOffset(4 * scale, 2 * scale);
    spike.refreshBody();
    return spike;
  }

  hitPlayer() {
    if (this.player.takeHit()) this.onHit();
  }
}
