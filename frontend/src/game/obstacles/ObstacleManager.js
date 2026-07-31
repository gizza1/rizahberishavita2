// Vita Milk Rush — Obstacle Manager
// Handles all obstacle types: cows, tractors, cheese wheels, hay bales,
// electric fences, water, mud, spilled milk, conveyor belts, steam vents, machinery
import Phaser from "phaser";
import { COLORS, DEPTH } from "../config";

export class ObstacleManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.player = scene.player;

    // Obstacle groups
    this.cows = [];           // Walking cows: move back/forth
    this.tractors = [];       // Moving tractors: faster horizontal
    this.cheeseWheels = [];   // Rolling cheese: bounce off walls
    this.hayBales = [];       // Hay bales: static or falling
    this.fences = [];         // Electric fences: static with sparkle
    this.waterZones = [];     // Water: death zone rectangles
    this.mudZones = [];       // Mud: slow zone
    this.milkSpills = [];     // Spilled milk: slippery surface
    this.conveyorBelts = [];  // Conveyor: push player
    this.steamVents = [];     // Steam vents: periodic burst
    this.machines = [];       // Factory machinery: piston/crusher

    this.spikeGroup = scene.physics.add.staticGroup(); // legacy spikes
  }

  /**
   * Spawn all obstacles from level data.
   * @param {object} level — the level definition
   * @param {Phaser.Physics.Arcade.StaticGroup} groundGroup
   */
  spawnAll(level, groundGroup) {
    const obs = level.obstacles || [];
    // Two extra spikes keep every level challenging without hand-positioning
    // hazards in gaps between ground segments.
    const groundedSpikes = this._extraGroundedSpikes(level, obs);

    [...obs, ...groundedSpikes].forEach((o) => {
      switch (o.type) {
        case "spike":
          this._spawnSpike(o, level);
          break;
        case "cow":
          this._spawnCow(o);
          break;
        case "tractor":
          this._spawnTractor(o);
          break;
        case "cheese":
          this._spawnCheeseWheel(o);
          break;
        case "hay":
          this._spawnHayBale(o, groundGroup);
          break;
        case "fence":
          this._spawnFence(o);
          break;
        case "water":
          this._spawnWater(o);
          break;
        case "mud":
          this._spawnMud(o);
          break;
        case "milk_spill":
          this._spawnMilkSpill(o);
          break;
        case "conveyor":
          this._spawnConveyor(o);
          break;
        case "steam":
          this._spawnSteamVent(o);
          break;
        case "machinery":
          this._spawnMachinery(o);
          break;
      }
    });
  }

  /**
   * Update all animated obstacles. Call every frame.
   * @param {number} time
   * @param {number} delta
   */
  update(time, delta) {
    this._updateCows(time);
    this._updateTractors(time);
    this._updateCheeseWheels(time, delta);
    this._updateHayBales();
    this._updateFences(time);
    this._updateSteamVents(time);
    this._updateMachines(time);
    this._updateConveyors();
  }

  /**
   * Check if player is in a death zone (water).
   * @returns {boolean}
   */
  checkDeathZones() {
    if (!this.player || !this.player.alive) return false;
    for (const w of this.waterZones) {
      if (this._overlaps(this.player, w)) return true;
    }
    return false;
  }

  /**
   * Apply zone effects (mud slow, milk slip, conveyor push).
   * Called every frame after player update.
   * @param {Phaser.Physics.Arcade.Body} body
   */
  applyZoneEffects(body) {
    // Mud — slow down
    for (const m of this.mudZones) {
      if (this._overlaps(this.player, m)) {
        body.setDragX(800);
        if (Math.abs(body.velocity.x) > 120) body.setVelocityX(body.velocity.x * 0.9);
        break;
      }
    }

    // Spilled milk — slippery (low friction)
    for (const s of this.milkSpills) {
      if (this._overlaps(this.player, s) && this.player.grounded) {
        body.setDragX(50);
        break;
      }
    }

    // Conveyor belts — push player
    for (const c of this.conveyorBelts) {
      if (this._overlapsBottom(this.player, c)) {
        const dir = c.getData("direction") || 1;
        body.setVelocityX(body.velocity.x + dir * 120);
        break;
      }
    }
  }

  destroy() {
    // Cleanup all tweens and objects
    this._allObstacles().forEach(o => { if (o && o.destroy) o.destroy(); });
  }

  // ═══════════════════════════════════════════
  //  SPAWNERS
  // ═══════════════════════════════════════════

  _spawnSpike(o, level) {
    // Place the spike's bottom edge exactly on the ground below it. Older
    // level data used a fixed y value, which made spikes float on slopes.
    const groundY = this._groundYAt(level, o.x) ?? o.y;
    const s = this.scene.add.image(o.x, groundY, "spike")
      .setDepth(DEPTH.obstacles).setOrigin(0.5, 1).setScale(0.82);
    this.spikeGroup.add(s);
    // Smaller hazard, with a body that exactly matches the rendered spike.
    s.body.setSize(20 * 0.82, 18 * 0.82);
    s.body.setOffset(0, 0);
  }

  _spawnCow(o) {
    const cow = this.scene.add.image(o.x, o.y, "cow")
      .setDepth(DEPTH.obstacles).setOrigin(0.5, 1);
    this.scene.physics.world.enable(cow);
    cow.body.setSize(52, 36);
    cow.body.setOffset(-26, -36);
    cow.body.setAllowGravity(false);
    cow.body.setImmovable(true);
    cow.setData("dir", 1);
    cow.setData("originX", o.x);
    cow.setData("range", o.range || 200);
    cow.setData("speed", o.speed || 60);
    this.cows.push(cow);
    this.scene.physics.add.overlap(this.player, cow, () => this.player.die());
  }

  _spawnTractor(o) {
    const t = this.scene.add.image(o.x, o.y, "tractor")
      .setDepth(DEPTH.obstacles).setOrigin(0.5, 1);
    this.scene.physics.world.enable(t);
    t.body.setSize(56, 38);
    t.body.setOffset(-28, -38);
    t.body.setAllowGravity(false);
    t.body.setImmovable(true);
    t.setData("dir", 1);
    t.setData("originX", o.x);
    t.setData("range", o.range || 300);
    t.setData("speed", o.speed || 100);
    this.tractors.push(t);
    this.scene.physics.add.overlap(this.player, t, () => this.player.die());
  }

  _spawnCheeseWheel(o) {
    const c = this.scene.add.image(o.x, o.y, "cheese")
      .setDepth(DEPTH.obstacles).setOrigin(0.5, 0.5);
    this.scene.physics.world.enable(c);
    c.body.setCircle(16, -2, -2);
    c.body.setBounce(0.6);
    c.body.setDrag(20);
    c.body.setCollideWorldBounds(false);
    c.body.setVelocityX(o.vx || 80);
    c.body.setVelocityY(o.vy || -200);
    c.setData("bounces", 0);
    this.cheeseWheels.push(c);
    this.scene.physics.add.collider(c, this.scene.groundGroup, () => {
      c.setData("bounces", (c.getData("bounces") || 0) + 1);
    });
    this.scene.physics.add.overlap(this.player, c, () => this.player.die());
  }

  _spawnHayBale(o, groundGroup) {
    if (o.falling) {
      // Falls from above
      const h = this.scene.add.image(o.x, o.y, "hay")
        .setDepth(DEPTH.obstacles).setOrigin(0.5, 0.5).setScale(0.82);
      this.scene.physics.world.enable(h);
      h.body.setSize(36 * 0.82, 24 * 0.82);
      h.body.setOffset(0, 0);
      h.body.setBounce(0.2);
      h.body.setDrag(100);
      this.scene.physics.add.collider(h, groundGroup);
      this.scene.physics.add.overlap(this.player, h, () => this.player.die());
      this.hayBales.push(h);
    } else {
      // Static
      const h = this.scene.add.image(o.x, o.y, "hay")
        .setDepth(DEPTH.obstacles).setOrigin(0.5, 1).setScale(0.82);
      this.spikeGroup.add(h);
      // Hay bales are the game's box obstacles; keep their collision box flush
      // with the smaller visible bale.
      h.body.setSize(36 * 0.82, 24 * 0.82);
      h.body.setOffset(0, 0);
    }
  }

  _spawnFence(o) {
    const f = this.scene.add.image(o.x, o.y, "fence")
      .setDepth(DEPTH.obstacles).setOrigin(0.5, 1);
    this.spikeGroup.add(f);
    f.body.setSize(30, 26);
    f.body.setOffset(-15, -26);
    this.fences.push(f);
  }

  _spawnWater(o) {
    const g = this.scene.add.graphics().setDepth(DEPTH.platforms);
    const w = o.w || 200;
    const h = o.h || 60;
    // Blue water with ripple
    g.fillStyle(0x3388CC, 0.7);
    g.fillRect(o.x - w / 2, o.y - h / 2, w, h);
    g.fillStyle(0x44AAEE, 0.3);
    for (let i = 0; i < 3; i++) {
      g.fillRect(o.x - w / 2 + 10 + i * 60, o.y - h / 2 + 5, 40, 3);
    }
    this.waterZones.push({ x: o.x - w / 2, y: o.y - h / 2, w, h });
  }

  _spawnMud(o) {
    const g = this.scene.add.graphics().setDepth(DEPTH.platforms);
    const w = o.w || 120;
    const h = o.h || 16;
    g.fillStyle(0x6B4226, 0.65);
    g.fillRect(o.x - w / 2, o.y - h / 2, w, h);
    g.fillStyle(0x7B5236, 0.3);
    g.fillRect(o.x - w / 2 + 10, o.y - h / 2 + 2, w - 20, h - 4);
    this.mudZones.push({ x: o.x - w / 2, y: o.y - h / 2, w, h });
  }

  _spawnMilkSpill(o) {
    const g = this.scene.add.graphics().setDepth(DEPTH.platforms);
    const w = o.w || 140;
    const h = o.h || 10;
    g.fillStyle(0xF8FCFF, 0.5);
    g.fillRect(o.x - w / 2, o.y - h / 2, w, h);
    g.fillStyle(0xFFFFFF, 0.3);
    g.fillRect(o.x - w / 2 + 20, o.y - h / 2, w - 40, h * 0.6);
    this.milkSpills.push({ x: o.x - w / 2, y: o.y - h / 2, w, h });
  }

  _spawnConveyor(o) {
    const g = this.scene.add.graphics().setDepth(DEPTH.platforms);
    const w = o.w || 160;
    const h = o.h || 14;
    // Belt surface
    g.fillStyle(0x444444, 1);
    g.fillRect(o.x - w / 2, o.y - h / 2, w, h);
    // Arrows
    g.fillStyle(0x888888, 0.6);
    const dir = o.direction || 1;
    for (let i = 0; i < w - 20; i += 30) {
      const ax = o.x - w / 2 + 15 + i;
      g.fillTriangle(
        ax + dir * 8, o.y,
        ax - dir * 4, o.y - 5,
        ax - dir * 4, o.y + 5
      );
    }
    const zone = { x: o.x - w / 2, y: o.y - h / 2, w, h };
    this.scene.physics.world.enable(zone);
    this.conveyorBelts.push(zone);
    zone.setData = (k, v) => { zone[k] = v; };
    zone.getData = (k) => zone[k];
    zone.setData("direction", dir);
    // Physics body for standing on
    const body = this.scene.add.zone(o.x, o.y, w, h).setDepth(DEPTH.platforms);
    this.scene.physics.world.enable(body);
    body.body.setAllowGravity(false);
    body.body.setImmovable(true);
    body.body.setSize(w, h);
    this.scene.physics.add.collider(this.player, body);
    zone._body = body;
  }

  _spawnSteamVent(o) {
    const v = this.scene.add.image(o.x, o.y, "steam_vent")
      .setDepth(DEPTH.obstacles).setOrigin(0.5, 1);
    v.setData("interval", o.interval || 2000);
    v.setData("force", o.force || -350);
    v.setData("active", false);
    v.setData("timer", Phaser.Math.Between(0, o.interval || 2000));
    this.steamVents.push(v);
  }

  _spawnMachinery(o) {
    const m = this.scene.add.image(o.x, o.y, "machinery")
      .setDepth(DEPTH.obstacles).setOrigin(0.5, 1);
    this.scene.physics.world.enable(m);
    m.body.setSize(44, 42);
    m.body.setOffset(-22, -42);
    m.body.setAllowGravity(false);
    m.body.setImmovable(true);
    m.setData("originY", o.y);
    m.setData("range", o.range || 60);
    m.setData("speed", o.speed || 1500);
    m.setData("phase", Phaser.Math.Between(0, 1000));
    this.machines.push(m);
    this.scene.physics.add.overlap(this.player, m, () => this.player.die());
  }

  // ═══════════════════════════════════════════
  //  UPDATERS
  // ═══════════════════════════════════════════

  _updateCows(time) {
    this.cows.forEach((cow) => {
      const originX = cow.getData("originX");
      const range = cow.getData("range");
      const speed = cow.getData("speed");
      let dir = cow.getData("dir");
      cow.x += dir * speed * 0.016;
      cow.setFlipX(dir > 0);
      if (cow.x > originX + range) cow.setData("dir", -1);
      else if (cow.x < originX - range) cow.setData("dir", 1);
      cow.body.x = cow.x - 26;
    });
  }

  _updateTractors(time) {
    this.tractors.forEach((t) => {
      const originX = t.getData("originX");
      const range = t.getData("range");
      const speed = t.getData("speed");
      let dir = t.getData("dir");
      t.x += dir * speed * 0.016;
      t.setFlipX(dir < 0);
      if (t.x > originX + range) t.setData("dir", -1);
      else if (t.x < originX - range) t.setData("dir", 1);
      t.body.x = t.x - 28;
    });
  }

  _updateCheeseWheels(time, delta) {
    for (let i = this.cheeseWheels.length - 1; i >= 0; i--) {
      const c = this.cheeseWheels[i];
      c.angle += c.body.velocity.x * 0.05;
      // Destroy if fallen off screen or bounced too much
      if (c.y > 800 || c.getData("bounces") > 8) {
        c.destroy();
        this.cheeseWheels.splice(i, 1);
      }
    }
  }

  _updateHayBales() {
    // Only cleanup fallen hay bales
    for (let i = this.hayBales.length - 1; i >= 0; i--) {
      if (this.hayBales[i].y > 800) {
        this.hayBales[i].destroy();
        this.hayBales.splice(i, 1);
      }
    }
  }

  _updateFences(time) {
    this.fences.forEach((f) => {
      // Electric sparkle every ~500ms
      if (Math.floor(time / 500) !== Math.floor((time - 16) / 500)) {
        for (let i = 0; i < 3; i++) {
          const s = this.scene.add.circle(
            f.x + Phaser.Math.Between(-12, 12),
            f.y - Phaser.Math.Between(8, 22),
            Phaser.Math.Between(1, 2),
            0xFFFF00,
            0.8
          ).setDepth(DEPTH.obstacles + 1);
          this.scene.tweens.add({
            targets: s, alpha: 0, scale: 2, duration: 400,
            onComplete: () => s.destroy(),
          });
        }
      }
    });
  }

  _updateSteamVents(time) {
    this.steamVents.forEach((v) => {
      const interval = v.getData("interval");
      let timer = v.getData("timer");
      timer -= 16;
      if (timer <= 0) {
        timer = interval;
        v.setData("active", true);
        // Steam particles
        for (let i = 0; i < 8; i++) {
          const sx = v.x + Phaser.Math.Between(-8, 8);
          const sy = v.y - 32;
          const cloud = this.scene.add.circle(sx, sy, Phaser.Math.Between(4, 10), 0xFFFFFF, 0.5)
            .setDepth(DEPTH.obstacles + 1);
          this.scene.tweens.add({
            targets: cloud,
            y: sy - Phaser.Math.Between(40, 100),
            x: cloud.x + Phaser.Math.Between(-30, 30),
            alpha: 0,
            scaleX: 1.5, scaleY: 1.5,
            duration: Phaser.Math.Between(600, 1000),
            onComplete: () => cloud.destroy(),
          });
        }
        // Push player if nearby
        const force = v.getData("force");
        const dx = this.player.x - v.x;
        const dy = this.player.y - v.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          this.player.body.setVelocityY(force);
          this.player.body.setVelocityX(dx * 2);
        }
      } else {
        v.setData("active", false);
      }
      v.setData("timer", timer);
    });
  }

  _updateMachines(time) {
    this.machines.forEach((m) => {
      const originY = m.getData("originY");
      const range = m.getData("range");
      const speed = m.getData("speed");
      const phase = m.getData("phase");
      // Piston-like oscillating motion
      const t = (time + phase) / speed;
      m.y = originY + Math.sin(t * Math.PI * 2) * range;
      m.body.y = m.y - 42;
    });
  }

  _updateConveyors() {
    // Conveyor push is handled in applyZoneEffects
  }

  // ═══════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════

  _overlaps(player, zone) {
    const px = player.x;
    const py = player.y;
    const pw = player.body.width || 24;
    const ph = player.body.height || 54;
    return (
      px - pw / 2 < zone.x + zone.w &&
      px + pw / 2 > zone.x &&
      py - ph / 2 < zone.y + zone.h &&
      py + ph / 2 > zone.y
    );
  }

  _overlapsBottom(player, zone) {
    const px = player.x;
    const py = player.y + 26; // feet
    return (
      px - 12 < zone.x + zone.w &&
      px + 12 > zone.x &&
      py > zone.y &&
      py < zone.y + zone.h + 10 &&
      player.grounded
    );
  }

  _allObstacles() {
    return [
      ...this.cows, ...this.tractors, ...this.cheeseWheels,
      ...this.hayBales, ...this.fences, ...this.steamVents, ...this.machines,
    ];
  }

  _groundYAt(level, x) {
    const segment = level.groundSegments?.find(([start, end]) => x >= start && x <= end);
    return segment?.[2];
  }

  _extraGroundedSpikes(level, obstacles) {
    const targets = [level.worldWidth * 0.34, level.worldWidth * 0.68];
    const occupied = obstacles
      .filter((obstacle) => Number.isFinite(obstacle.x))
      .map((obstacle) => obstacle.x);

    return targets.map((target) => {
      const candidates = (level.groundSegments || [])
        .filter(([start, end]) => end - start >= 140)
        .map(([start, end]) => ({
          x: Phaser.Math.Clamp(target, start + 70, end - 70),
          distance: Math.abs(target - Phaser.Math.Clamp(target, start + 70, end - 70)),
        }))
        .sort((a, b) => a.distance - b.distance);
      const safe = candidates.find(({ x }) => occupied.every((otherX) => Math.abs(otherX - x) >= 110));
      const x = (safe || candidates[0]).x;
      occupied.push(x);
      return { type: "spike", x };
    });
  }
}
