export class ObstacleSystem {
  constructor(scene, player, onHit) {
    this.scene = scene;
    this.player = player;
    this.onHit = onHit;
    this.spikes = scene.physics.add.staticGroup();
    scene.physics.add.overlap(player, this.spikes, () => this.hitPlayer());
  }

  addSpike(x, groundY) {
    const spike = this.spikes.create(x, groundY, "farm-spike").setOrigin(0.5, 1);
    spike.body.setSize(24, 16).setOffset(4, 2);
    spike.refreshBody();
    return spike;
  }

  hitPlayer() {
    if (this.player.takeHit()) this.onHit();
  }
}
