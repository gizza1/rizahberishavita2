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
    bottle.setDepth(20);
    bottle.setData("scoreValue", scoreValue);
    bottle.body.setCircle(13, 2, 2);
    const logo = this.scene.add.image(x, y + 7, "vita-logo").setDisplaySize(21, 19).setDepth(21);
    bottle.setData("logo", logo).setAlpha(hidden ? 0.2 : 1).setData("hidden", hidden);
    logo.setAlpha(hidden ? 0.2 : 1);
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
    const logo = bottle.getData("logo");
    this.scene.tweens.killTweensOf(bottle);
    this.scene.tweens.killTweensOf(logo);
    this.scene.tweens.add({
      targets: [bottle, logo], y: bottle.y - 40, alpha: 0,
      duration: 280, ease: "Cubic.easeOut",
      onComplete: () => {
        for (let i = 0; i < 6; i += 1) {
          const spark = this.scene.add.circle(bottle.x, bottle.y, 3, 0xffd34d, 0.9);
          this.scene.tweens.add({ targets: spark, x: bottle.x + Phaser.Math.Between(-35, 35), y: bottle.y + Phaser.Math.Between(-35, 15), alpha: 0, duration: 300, onComplete: () => spark.destroy() });
        }
        logo.destroy();
        bottle.destroy();
        this.onCollect({ scoreValue: value });
        // Placeholder sound hook; replace with an audio asset in production.
        this.scene.events.emit("sound:collect-milk");
      },
    });
  }

  update(player) {
    this.bottles.getChildren().forEach((bottle) => {
      if (bottle?.active && !bottle.getData("collecting")) {
        const logo = bottle.getData("logo");
        logo?.setPosition(bottle.x, bottle.y + 7);
        if (bottle.getData("hidden")) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, bottle.x, bottle.y);
          const alpha = distance < 150 ? 1 : 0.2;
          bottle.setAlpha(alpha);
          logo?.setAlpha(alpha);
        }
      }
    });
  }
}
