import Phaser from "phaser";

export class PlatformSystem {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.moving = [];
    this.hidden = [];
    this.conveyors = [];
    this.disappearing = [];
  }

  addStatic(x, y, width) {
    return this._staticPlatform(x, y, width, "platform-static");
  }

  addFloating(x, y, width) {
    return this._staticPlatform(x, y, width, "platform-floating");
  }

  addBounce(x, y, width) {
    const platform = this._staticPlatform(x, y, width, "platform-bounce");
    this.scene.physics.add.collider(this.player, platform, (player) => {
      if (player.body.velocity.y >= 0) player.bounce();
    });
    return platform;
  }

  addHidden(x, y, width) {
    const platform = this._staticPlatform(x, y, width, "platform-hidden");
    platform.setAlpha(0.12);
    this.hidden.push(platform);
    return platform;
  }

  addConveyor(x, y, width, direction = 1) {
    const platform = this._staticPlatform(x, y, width, "platform-conveyor");
    this.conveyors.push({ platform, direction });
    return platform;
  }

  addMoving(x, y, width, options = {}) {
    const platform = this.scene.add.tileSprite(x, y, width, 24, "platform-moving").setOrigin(0.5);
    this.scene.physics.add.existing(platform);
    platform.body.setSize(width, 24).setOffset(0, 0).setImmovable(true).setAllowGravity(false);
    platform.body.moves = false;
    this.scene.physics.add.collider(this.player, platform);
    this.moving.push({
      platform,
      originX: x,
      originY: y,
      axis: options.axis || "x",
      distance: options.distance || 180,
      duration: options.duration || 1800,
    });
    return platform;
  }

  addDisappearing(x, y, width, interval = 1800) {
    const platform = this._staticPlatform(x, y, width, "platform-hidden");
    this.disappearing.push({ platform, interval });
    return platform;
  }

  update(time) {
    this.moving.forEach((item) => {
      const amount = Math.sin((time / item.duration) * Math.PI * 2) * item.distance;
      item.platform.setPosition(
        item.axis === "x" ? item.originX + amount : item.originX,
        item.axis === "y" ? item.originY + amount : item.originY,
      );
      item.platform.body.updateFromGameObject();
    });

    this.hidden.forEach((platform) => {
      const near = Phaser.Math.Distance.Between(this.player.x, this.player.y, platform.x, platform.y) < 150;
      platform.setAlpha(near ? 0.75 : 0.12);
    });

    this.conveyors.forEach(({ platform, direction }) => {
      const body = this.player.body;
      const onTop = body.touching.down
        && body.right > platform.body.left
        && body.left < platform.body.right;
      if (onTop) body.setVelocityX(body.velocity.x + direction * 8);
    });

    this.disappearing.forEach(({ platform, interval }) => {
      const visible = Math.floor(time / interval) % 2 === 0;
      platform.setAlpha(visible ? 1 : 0.12);
      platform.body.enable = visible;
    });
  }

  _staticPlatform(x, y, width, texture) {
    const platform = this.scene.add.tileSprite(x, y, width, 24, texture).setOrigin(0.5);
    this.scene.physics.add.existing(platform, true);
    platform.body.setSize(width, 24).setOffset(0, 0);
    platform.body.updateFromGameObject();
    this.scene.physics.add.collider(this.player, platform);
    return platform;
  }
}
