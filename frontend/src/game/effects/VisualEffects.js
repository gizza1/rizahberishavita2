// Vita Milk Rush — Visual Effects Manager
// Handles: clouds, birds, dust, smoke, weather, dynamic lighting, shadows
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, DEPTH } from "../config";

export class VisualEffects {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} worldWidth
   */
  constructor(scene, worldWidth) {
    this.scene = scene;
    this.worldW = worldWidth;
    this.effects = [];
  }

  // ═══════════════════════════════════════════
  //  CLOUDS
  // ═══════════════════════════════════════════

  spawnClouds(count = 8) {
    for (let i = 0; i < count; i++) {
      const y = Phaser.Math.Between(30, 200);
      const x = Phaser.Math.Between(0, this.worldW);
      const cloud = this.scene.add.container(x, y).setDepth(DEPTH.bg + 4).setAlpha(0.7);
      const g = this.scene.add.graphics();

      // Fluffy cloud shape
      g.fillStyle(0xFFFFFF, 0.8);
      const w = Phaser.Math.Between(80, 160);
      const h = Phaser.Math.Between(25, 40);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
      // Extra puffs
      g.fillCircle(-w / 4, -h / 2 + 4, h / 2 + 2);
      g.fillCircle(w / 4, -h / 2 + 2, h / 2 + 4);
      g.fillCircle(0, -h / 2 - 2, h / 2 + 6);
      cloud.add(g);

      // Soft shadow under cloud
      const shadow = this.scene.add.ellipse(0, 8, w * 0.7, 6, 0x000000, 0.06);
      cloud.add(shadow);

      cloud.setData("speed", Phaser.Math.FloatBetween(8, 22));
      cloud.setData("amplitude", Phaser.Math.FloatBetween(3, 10));
      cloud.setData("originY", y);
      this.effects.push({ type: "cloud", obj: cloud });
    }
  }

  // ═══════════════════════════════════════════
  //  BIRDS
  // ═══════════════════════════════════════════

  spawnBirds(count = 6) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, this.worldW);
      const y = Phaser.Math.Between(120, 350);
      const bird = this.scene.add.container(x, y).setDepth(DEPTH.bg + 5);
      const g = this.scene.add.graphics();

      // V-shape bird
      g.lineStyle(2, 0x2A2A2A, 0.6);
      g.beginPath();
      g.moveTo(-4, 0);
      g.lineTo(0, -2);
      g.lineTo(4, 0);
      g.strokePath();
      bird.add(g);

      bird.setData("speed", Phaser.Math.FloatBetween(40, 90));
      bird.setData("waveAmp", Phaser.Math.FloatBetween(4, 14));
      bird.setData("waveFreq", Phaser.Math.FloatBetween(0.002, 0.005));
      this.effects.push({ type: "bird", obj: bird });
    }
  }

  // ═══════════════════════════════════════════
  //  AMBIENT DUST
  // ═══════════════════════════════════════════

  spawnDust(count = 20) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, this.worldW);
      const y = Phaser.Math.Between(500, GAME_HEIGHT - 10);
      const dust = this.scene.add.circle(x, y, Phaser.Math.FloatBetween(0.5, 1.5), 0xDDCCAA, 0.25)
        .setDepth(DEPTH.bg + 6);
      dust.setData("baseX", x);
      dust.setData("baseY", y);
      dust.setData("phase", Math.random() * Math.PI * 2);
      dust.setData("speed", Phaser.Math.FloatBetween(0.3, 1.2));
      this.effects.push({ type: "dust", obj: dust });
    }
  }

  // ═══════════════════════════════════════════
  //  FACTORY SMOKE
  // ═══════════════════════════════════════════

  spawnFactorySmoke(x, y) {
    this._smokeX = x;
    this._smokeY = y;
    this._smokeTimer = 0;
  }

  // ═══════════════════════════════════════════
  //  LIGHT RAYS
  // ═══════════════════════════════════════════

  spawnLightRays(count = 5) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(100, this.worldW - 100);
      const w = Phaser.Math.Between(30, 80);
      const h = Phaser.Math.Between(200, 500);
      const ray = this.scene.add.rectangle(x, 0, w, h, 0xFFFFCC, 0.03)
        .setOrigin(0.5, 0).setDepth(DEPTH.bg + 1);
      ray.setData("phase", Math.random() * Math.PI * 2);
      ray.setData("speed", Phaser.Math.FloatBetween(0.3, 0.8));
      this.effects.push({ type: "lightRay", obj: ray });
    }
  }

  // ═══════════════════════════════════════════
  //  WEATHER
  // ═══════════════════════════════════════════

  spawnWeather(type, intensity = 1) {
    if (type === "rain") {
      this._weatherType = "rain";
      this._weatherParticles = [];
      for (let i = 0; i < Math.floor(80 * intensity); i++) {
        const x = Phaser.Math.Between(-100, GAME_WIDTH + 100);
        const y = Phaser.Math.Between(-200, GAME_HEIGHT + 100);
        const drop = this.scene.add.rectangle(x, y, 2, Phaser.Math.Between(8, 16), 0x88AACC, 0.4)
          .setDepth(DEPTH.hud - 1).setScrollFactor(0);
        drop.setData("speed", Phaser.Math.Between(400, 700));
        this._weatherParticles.push(drop);
      }
    } else if (type === "fog") {
      this._weatherType = "fog";
      this._fogLayers = [];
      for (let i = 0; i < 3; i++) {
        const fog = this.scene.add.rectangle(
          GAME_WIDTH / 2, GAME_HEIGHT - 100 - i * 50,
          GAME_WIDTH + 400, 120, 0xCCDDF0, 0.08 + i * 0.04
        ).setDepth(DEPTH.hud - 2).setScrollFactor(0);
        fog.setData("speed", 0.3 + i * 0.2);
        fog.setData("offset", i * 200);
        this._fogLayers.push(fog);
      }
    }
  }

  // ═══════════════════════════════════════════
  //  SHADOW
  // ═══════════════════════════════════════════

  createShadow(parent, width = 24, height = 8) {
    const shadow = this.scene.add.ellipse(0, 28, width, height, 0x000000, 0.2)
      .setDepth(DEPTH.player - 2);
    parent.add(shadow);
    return shadow;
  }

  // ═══════════════════════════════════════════
  //  GRASS ANIMATION TILES
  // ═══════════════════════════════════════════

  createGrassTiles(groundSegments, groundGroup) {
    this._grassTiles = [];
    groundSegments.forEach(([sx, ex, gy]) => {
      const w = ex - sx;
      if (w < 100) return;
      // Animated grass blades on top of ground
      for (let gx = sx; gx < ex; gx += Phaser.Math.Between(40, 70)) {
        const blade = this.scene.add.graphics().setDepth(DEPTH.platforms + 1);
        blade.fillStyle(0x6DBE45, 0.7);
        blade.fillTriangle(gx, gy - 1, gx + 4, gy - 8, gx + 8, gy - 1);
        blade.setData("baseX", gx);
        blade.setData("baseY", gy);
        blade.setData("phase", Math.random() * Math.PI * 2);
        this._grassTiles.push(blade);
      }
    });
  }

  // ═══════════════════════════════════════════
  //  UPDATE
  // ═══════════════════════════════════════════

  update(time, delta, camScrollX) {
    const dt = delta * 0.001;

    this.effects.forEach(({ type, obj }) => {
      switch (type) {
        case "cloud": {
          const speed = obj.getData("speed");
          const amp = obj.getData("amplitude");
          const originY = obj.getData("originY");
          obj.x += speed * dt;
          obj.y = originY + Math.sin(time * 0.0003 + obj.x * 0.001) * amp;
          if (obj.x > this.worldW + 200) obj.x = -200;
          break;
        }
        case "bird": {
          const speed = obj.getData("speed");
          const waveAmp = obj.getData("waveAmp");
          const waveFreq = obj.getData("waveFreq");
          obj.x += speed * dt;
          obj.y += Math.sin(time * waveFreq) * waveAmp * 0.3;
          if (obj.x > this.worldW + 100) obj.x = -100;
          break;
        }
        case "dust": {
          const phase = obj.getData("phase");
          const spd = obj.getData("speed");
          const bx = obj.getData("baseX");
          const by = obj.getData("baseY");
          obj.x = bx + Math.sin(time * 0.001 * spd + phase) * 20;
          obj.y = by + Math.cos(time * 0.0008 * spd + phase) * 8;
          obj.alpha = 0.15 + Math.sin(time * 0.002 + phase) * 0.1;
          break;
        }
        case "lightRay":
          obj.alpha = 0.02 + Math.sin(time * 0.001 * obj.getData("speed") + obj.getData("phase")) * 0.015;
          break;
      }
    });

    // Factory smoke
    if (this._smokeX !== undefined) {
      this._smokeTimer += dt;
      if (this._smokeTimer > 0.4) {
        this._smokeTimer = 0;
        const sx = this._smokeX + Phaser.Math.Between(-10, 10);
        const sy = this._smokeY - 110;
        const smoke = this.scene.add.circle(sx, sy, Phaser.Math.Between(4, 10), 0xAAAAAA, 0.25)
          .setDepth(DEPTH.factory + 1);
        this.scene.tweens.add({
          targets: smoke,
          y: sy - Phaser.Math.Between(40, 90),
          x: smoke.x + Phaser.Math.Between(-20, 20),
          alpha: 0,
          scaleX: 2, scaleY: 2,
          duration: Phaser.Math.Between(1500, 3000),
          onComplete: () => smoke.destroy(),
        });
      }
    }

    // Grass sway
    if (this._grassTiles) {
      this._grassTiles.forEach(blade => {
        const bx = blade.getData("baseX");
        const by = blade.getData("baseY");
        const phase = blade.getData("phase");
        const sway = Math.sin(time * 0.003 + phase) * 3;
        blade.x = bx + sway;
        blade.y = by;
      });
    }

    // Weather
    if (this._weatherType === "rain") {
      this._weatherParticles.forEach(drop => {
        drop.y += drop.getData("speed") * dt;
        if (drop.y > GAME_HEIGHT + 50) {
          drop.y = -20;
          drop.x = Phaser.Math.Between(-100, GAME_WIDTH + 100);
        }
      });
    }
    if (this._weatherType === "fog" && this._fogLayers) {
      this._fogLayers.forEach(fog => {
        fog.x += Math.sin(time * 0.0005 + fog.getData("offset")) * 0.5;
      });
    }
  }

  destroy() {
    this.effects.forEach(({ obj }) => { if (obj && obj.destroy) obj.destroy(); });
    if (this._weatherParticles) this._weatherParticles.forEach(d => d.destroy());
    if (this._fogLayers) this._fogLayers.forEach(f => f.destroy());
    if (this._grassTiles) this._grassTiles.forEach(g => g.destroy());
    this.effects = [];
  }
}
