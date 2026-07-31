import Phaser from "phaser";

export class CollectibleSystem {
  constructor(scene, player, onCollect) {
    this.scene = scene;
    this.onCollect = onCollect;
    this.bottles = scene.physics.add.group({ allowGravity: false });
    scene.physics.add.overlap(player, this.bottles, (_player, bottle) => this.collect(bottle));
  }

  addMilkBottle(x, y, scoreValue = 100, hidden = false) {
    const bottle = this.bottles.create(x, y, "milk-bottle");
    bottle.setData("scoreValue", scoreValue);
    bottle.body.setCircle(13, 2, 2);
    bottle.setAlpha(hidden ? 0.2 : 1).setData("hidden", hidden);
    this.scene.tweens.add({
      targets: bottle, y: y - 8, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
    });
    return bottle;
  }

  collect(bottle) {
    if (!bottle.active || bottle.getData("collecting")) return;
    bottle.setData("collecting", true);
    bottle.body.enable = false;
    const value = bottle.getData("scoreValue");
    this.scene.tweens.killTweensOf(bottle);
    this.scene.tweens.add({
      targets: bottle, y: bottle.y - 40, scale: 1.5, alpha: 0,
      duration: 280, ease: "Cubic.easeOut",
      onComplete: () => {
        bottle.destroy();
        this.onCollect({ scoreValue: value });
        // Placeholder sound hook; replace with an audio asset in production.
        this.scene.events.emit("sound:collect-milk");
      },
    });
  }

  update(player) {
    this.bottles.children.iterate((bottle) => {
      if (bottle?.active && bottle.getData("hidden")) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, bottle.x, bottle.y);
        bottle.setAlpha(distance < 150 ? 1 : 0.2);
      }
    });
  }
}
