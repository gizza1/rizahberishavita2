// Vita Milk Rush — Game Scene
import Phaser from "phaser";
import { Player } from "../player/Player";
import { LEVELS } from "../levels/LevelData";
import { ObstacleManager } from "../obstacles/ObstacleManager";
import { VisualEffects } from "../effects/VisualEffects";
import {
  GAME_WIDTH, GAME_HEIGHT,
  COLORS, PHYSICS, DEPTH, MILK, MILK_REQUIRED_PCT, THEMES, COIN_VALUE,
} from "../config";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.levelIndex = data.level ?? 0;
    this.levelComplete = false;
    this.levelBlocked = false;
    this.coinsCollected = 0;
    this.lastCheckpointX = data.checkpointX ?? 100;
    this.lastCheckpointY = data.checkpointY ?? 400;
    this.startTime = data.startTime ?? this.time.now;
    this.deathCount = data.deathCount ?? 0;
    this.lives = data.lives ?? 3;
    this.paused = false;
  }

  create() {
    const level = LEVELS[this.levelIndex];
    const theme = THEMES[level.theme] || THEMES.farm;
    const worldW = level.worldWidth;
    this.physics.world.setBounds(0, 0, worldW, GAME_HEIGHT + 200);

    // Pause key
    this.input.keyboard.on("keydown-ESC", () => this._togglePause());
    this.input.keyboard.on("keydown-P", () => this._togglePause());

    // --- Background (parallax layers) ---
    this.bgLayer = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, "background")
      .setOrigin(0).setDepth(DEPTH.bg).setScrollFactor(0);

    // Far hills
    this.farHills = this.add.graphics().setDepth(DEPTH.bg + 1).setScrollFactor(0.1);
    this._drawHills(this.farHills, theme.hills1, 0.35, 100, 80, worldW);

    // Near hills
    this.nearHills = this.add.graphics().setDepth(DEPTH.bg + 2).setScrollFactor(0.3);
    this._drawHills(this.nearHills, theme.hills2, 0.45, 70, 50, worldW);

    // --- Ground segments ---
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    this.groundGroup = this.physics.add.staticGroup();
    level.groundSegments.forEach(([sx, ex, gy]) => {
      const w = ex - sx;
      // Use tiled image for ground
      for (let gx = sx; gx < ex; gx += 64) {
        const tileW = Math.min(64, ex - gx);
        const seg = this.add.image(gx + tileW / 2, gy, "ground")
          .setDepth(DEPTH.platforms).setOrigin(0, 0).setDisplaySize(tileW, 32);
        this.groundGroup.add(seg);
        seg.body.setSize(tileW, 32);
        seg.body.setOffset(0, 0);
      }
    });

    // --- Platforms ---
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    this.platformGroup = this.physics.add.staticGroup();
    level.platforms.forEach(({ x, y, w }) => {
      for (let offsetX = 0; offsetX < w; offsetX += 32) {
        const tileW = Math.min(32, w - offsetX);
        const px = x + offsetX + tileW / 2;
        const p = this.add.image(px, y, "platform")
          .setDepth(DEPTH.platforms)
          .setDisplaySize(tileW, 16);
        this.platformGroup.add(p);
        // The physics body is exactly the rendered platform tile.
        p.body.setSize(tileW, 16);
        p.body.setOffset(0, 0);
      }
    });

    // --- Player ---
    this.player = new Player(this, this.lastCheckpointX, this.lastCheckpointY);
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.player, this.platformGroup);
    // Spawn invincibility
    this.player.invincible = true;
    this.player.invincibleTimer = 1500;

    // Player drop shadow
    this.playerShadow = this.add.ellipse(this.player.x, this.player.y + 28, 22, 6, 0x000000, 0.22)
      .setDepth(DEPTH.player - 2);

    // --- Visual Effects ---
    this.vfx = new VisualEffects(this, worldW);
    this.vfx.spawnClouds(level.clouds ?? 8);
    this.vfx.spawnBirds(level.birds ?? 5);
    this.vfx.spawnDust(18);
    this.vfx.spawnLightRays(4);
    this.vfx.createGrassTiles(level.groundSegments, this.groundGroup);
    if (level.weather) this.vfx.spawnWeather(level.weather, level.weatherIntensity ?? 1);

    // --- Milk Pickups ---
    /** @type {Phaser.Physics.Arcade.Group} */
    this.milkGroup = this.physics.add.group({ allowGravity: false });
    this.milkMax = 0;
    level.pickups.forEach(({ x, y, type }) => {
      const tier = MILK[type] || MILK.small;
      this.milkMax += tier.value;
      const tex = type === "medium" ? "milk_medium"
        : type === "large" ? "milk_large"
        : type === "golden" ? "milk_golden"
        : "milk";
      const m = this.add.image(x, y, tex)
        .setDepth(DEPTH.pickups).setScale(tier.size)
        .setData("type", type)
        .setData("value", tier.value);
      this.milkGroup.add(m);
      m.body.setSize(m.width * tier.size * 0.7, m.height * tier.size * 0.7);
      m.body.setOffset(-m.width * tier.size * 0.35, -m.height * tier.size * 0.35);
      // Put the supplied Vita logo directly on every collectible milk bottle/carton.
      const logoWidth = type === "large" ? 20 : type === "medium" ? 17 : 14;
      const milkLogo = this.add.image(x, y + 5, "vita_logo")
        .setDisplaySize(logoWidth, logoWidth * 0.92)
        .setDepth(DEPTH.pickups + 0.1);
      m.setData("logo", milkLogo);
      // Float + sparkle animation
      this.tweens.add({
        targets: [m, milkLogo], y: y - 6,
        duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
      });
      // Golden ones pulse
      if (type === "golden") {
        this.tweens.add({
          targets: m, scaleX: tier.size * 1.15, scaleY: tier.size * 1.15,
          duration: 600, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
        });
      }
    });
    this.milkRequired = Math.floor(this.milkMax * MILK_REQUIRED_PCT);

    this.physics.add.overlap(this.player, this.milkGroup, this._collectMilk, null, this);

    // --- Coins ---
    this.coinGroup = this.physics.add.group({ allowGravity: false });
    (level.coins || []).forEach(([cx, cy]) => {
      const c = this.add.image(cx, cy, "coin").setDepth(DEPTH.pickups).setScale(0.9);
      this.coinGroup.add(c);
      c.body.setSize(16, 16);
      c.body.setOffset(-8, -8);
      this.tweens.add({
        targets: c, y: cy - 4,
        duration: 800, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
      });
    });
    this.physics.add.overlap(this.player, this.coinGroup, this._collectCoin, null, this);

    // --- Checkpoints ---
    this.checkpointGroup = this.physics.add.group({ allowGravity: false });
    (level.checkpoints || []).forEach((cx) => {
      const cp = this.add.image(cx, 590, "checkpoint")
        .setDepth(DEPTH.platforms + 1).setOrigin(0.5, 1);
      this.checkpointGroup.add(cp);
      cp.body.setSize(20, 36);
      cp.body.setOffset(-10, -36);
    });
    this.physics.add.overlap(this.player, this.checkpointGroup, this._hitCheckpoint, null, this);

    // --- Moving Platforms ---
    this.movingPlatforms = [];
    (level.movingPlatforms || []).forEach((mp) => {
      const container = this.add.container(mp.x, mp.y).setDepth(DEPTH.platforms);
      const tileW = Math.ceil(mp.w / 32);
      for (let i = 0; i < tileW; i++) {
        const px = i * 32 + 16 - mp.w / 2;
        const p = this.add.image(px, 0, "platform");
        container.add(p);
      }
      // Physics body on the container
      this.physics.world.enable(container);
      container.body.setSize(mp.w, 16);
      container.body.setOffset(-mp.w / 2, -8);
      container.body.setImmovable(true);
      container.body.setAllowGravity(false);
      this.physics.add.collider(this.player, container);
      this.movingPlatforms.push({ container, mp, originX: mp.x, originY: mp.y });
    });

    // --- Obstacles (via ObstacleManager) ---
    this.obstacleMgr = new ObstacleManager(this);
    this.obstacleMgr.spawnAll(level, this.groundGroup);
    this.physics.add.overlap(this.player, this.obstacleMgr.spikeGroup, this._hitObstacle, null, this);

    // --- Factory (end goal) ---
    const factoryBaseY = this._groundYAt(level, level.factoryX);
    this.factory = this.add.image(level.factoryX, factoryBaseY, "factory")
      .setDepth(DEPTH.factory).setOrigin(0.5, 1).setScale(1.3);
    this.factoryLogo = this.add.image(level.factoryX, factoryBaseY - 84, "vita_logo")
      .setDisplaySize(82, 75)
      .setDepth(DEPTH.factory + 0.1);

    // Factory glow
    const glow = this.add.circle(level.factoryX, factoryBaseY - 10, 50, 0xFFD700, 0.08)
      .setDepth(DEPTH.factory - 1);
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.05, to: 0.18 },
      scaleX: { from: 1, to: 1.4 },
      scaleY: { from: 1, to: 1.4 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Factory chimney smoke
    this.vfx.spawnFactorySmoke(level.factoryX, factoryBaseY);

    // Factory trigger zone
    this.factoryZone = this.add.zone(level.factoryX, factoryBaseY, 80, 120)
      .setOrigin(0.5, 1);
    this.physics.world.enable(this.factoryZone);
    this.factoryZone.body.setAllowGravity(false);
    this.factoryZone.body.setImmovable(true);
    this.factoryZone.body.setSize(80, 120);
    this.physics.add.overlap(this.player, this.factoryZone, this._reachFactory, null, this);

    // --- Camera ---
    this.cameras.main.setBounds(0, 0, worldW, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(100, 50);

    // --- Controls ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this._prevJumpDown = false;
    this._prevGrounded = true;

    // --- HUD ---
    this._createHUD();

    // --- Particles ---
    this._createBackgroundParticles();

    // --- Events ---
    this.events.on("player-died", this._onPlayerDied, this);

    // --- Death fall check ---
    this.fallCheck = this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        if (this.player && this.player.y > GAME_HEIGHT + 100) {
          this.player.die();
        }
      },
    });

    // Music-like audio context on first interaction
    this._audioStarted = false;
    this.input.once("pointerdown", () => this._startAmbientAudio());

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Mobile controls hint
    if (!this.sys.game.device.os.desktop) {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, "Tap left/right to move · Swipe up to jump · Tap mid-air for double jump", {
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        color: "#8090A0",
      }).setOrigin(0.5).setDepth(DEPTH.hud).setScrollFactor(0).setAlpha(0.7);
    } else {
      // Controls legend
      const legend = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30,
        "ARROWS/WASD: Move  |  UP/W/SPACE: Jump (hold for height)  |  SHIFT: Run  |  X: Dash  |  DOWN: Slide", {
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        color: "#607080",
      }).setOrigin(0.5).setDepth(DEPTH.hud).setScrollFactor(0).setAlpha(0.6);
      this.tweens.add({ targets: legend, alpha: 0, delay: 15000, duration: 2000 });
    }
  }

  update(time, delta) {
    if (this.paused || this.levelComplete) return;
    if (!this.player || !this.player.alive) return;

    const p = this.player;

    // Timer update (display)
    const elapsed = time - this.startTime;
    this._updateTimer(elapsed);

    // Landing detection
    if (p.grounded && !this._prevGrounded) {
      p.onLand();
    }
    this._prevGrounded = p.grounded;

    // Jump pressed (edge-triggered)
    const jumpDown = this.cursors.up.isDown || this.wasd.up.isDown || this.spaceKey.isDown;
    const jumpPressed = jumpDown && !this._prevJumpDown;
    this._prevJumpDown = jumpDown;

    // Build input object for player controller
    const input = {
      left: this.cursors.left.isDown || this.wasd.left.isDown,
      right: this.cursors.right.isDown || this.wasd.right.isDown,
      up: jumpDown,
      down: this.cursors.down.isDown || this.wasd.down.isDown,
      jump: jumpDown,
      jumpPressed: jumpPressed,
    };

    // Run modifier
    p.runHeld = this.shiftKey.isDown;

    // Dash (X key or Shift double-tap — just X for now)
    if (Phaser.Input.Keyboard.JustDown(this.dashKey)) {
      p.dash();
    }

    // Slide (down + running)
    if (this.cursors.down.isDown || this.wasd.down.isDown) {
      p.slide();
    }

    p.update(input, delta);

    // Update shadow
    this.playerShadow.setPosition(p.x, p.y + 28);

    // Update obstacle manager
    this.obstacleMgr.update(time, delta);
    this.obstacleMgr.applyZoneEffects(p.body);
    if (this.obstacleMgr.checkDeathZones()) {
      p.die();
    }

    // Update visual effects
    this.vfx.update(time, delta, this.cameras.main.scrollX);

    // Animate moving platforms
    this.movingPlatforms.forEach(({ container, mp, originX, originY }) => {
      const t = (this.time.now / mp.speed) % (Math.PI * 2);
      if (mp.axis === "x") {
        container.x = originX + Math.sin(t) * mp.range;
        container.body.x = container.x - mp.w / 2;
      } else {
        container.y = originY + Math.sin(t) * mp.range;
        container.body.y = container.y - 8;
      }
    });

    // Update progress bar
    this._updateProgressBar();

    // Parallax
    const cx = this.cameras.main.scrollX;
    this.bgLayer.tilePositionX = cx * 0.05;
  }

  // ─── Collision handlers ───

  _groundYAt(level, x) {
    const segment = level.groundSegments.find(([start, end]) => x >= start && x <= end);
    return segment ? segment[2] : GAME_HEIGHT - 100;
  }

  _collectMilk(player, milk) {
    const value = milk.getData("value") || 5;
    const type = milk.getData("type") || "small";
    const worldX = milk.x;
    const worldY = milk.y;

    // Disable physics immediately
    milk.body.enable = false;
    const milkLogo = milk.getData("logo");
    milk.setDepth(DEPTH.hudFly);

    // Fly toward HUD bottle position (top-left, accounting for camera scroll)
    const hudTargetX = this.cameras.main.scrollX + 40;
    const hudTargetY = 100;

    this.tweens.add({
      targets: milkLogo ? [milk, milkLogo] : milk,
      x: hudTargetX,
      y: hudTargetY,
      alpha: 0.7,
      duration: 400,
      ease: "Cubic.easeIn",
      onComplete: () => {
        const amt = player.collectMilk(value);
        this._updateBottleFill(amt);
        this._playPickupSound(type);
        milkLogo?.destroy();
        milk.destroy();
      },
    });
    this.tweens.add({
      targets: milk,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 400,
      ease: "Cubic.easeIn",
    });

    // Particle burst at pickup location
    const color = MILK[type]?.color || 0xCCDDFF;
    for (let i = 0; i < 8; i++) {
      const p = this.add.circle(worldX + Phaser.Math.Between(-10, 10), worldY + Phaser.Math.Between(-10, 10),
        Phaser.Math.Between(1, 3), color, 0.8)
        .setDepth(DEPTH.pickups + 1);
      this.tweens.add({
        targets: p,
        x: p.x + Phaser.Math.Between(-30, 30),
        y: p.y + Phaser.Math.Between(-30, 10),
        alpha: 0,
        scale: 0,
        duration: 350,
        onComplete: () => p.destroy(),
      });
    }

    // Floating value text
    const label = MILK[type]?.label || "+5";
    const vt = this.add.text(worldX, worldY - 20, `+${value}`, {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: type === "golden" ? "22px" : type === "large" ? "18px" : "14px",
      color: type === "golden" ? "#FFD700" : "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(DEPTH.hudFly);
    this.tweens.add({
      targets: vt,
      y: vt.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => vt.destroy(),
    });
  }

  _hitObstacle(player) {
    player.die();
  }

  _collectCoin(player, coin) {
    coin.destroy();
    this.coinsCollected++;

    // Score text
    const vt = this.add.text(coin.x, coin.y - 14, "+1", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "13px",
      color: "#FFD700",
      stroke: "#000000",
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(DEPTH.hudFly);
    this.tweens.add({
      targets: vt, y: vt.y - 25, alpha: 0, duration: 600,
      onComplete: () => vt.destroy(),
    });

    // Sparkle
    for (let i = 0; i < 3; i++) {
      const s = this.add.circle(coin.x + Phaser.Math.Between(-5, 5), coin.y + Phaser.Math.Between(-5, 5),
        2, 0xFFD700, 0.8).setDepth(DEPTH.pickups + 1);
      this.tweens.add({
        targets: s, alpha: 0, scale: 0, duration: 250,
        onComplete: () => s.destroy(),
      });
    }
  }

  _hitCheckpoint(player, checkpoint) {
    if (checkpoint.getData("activated")) return;
    checkpoint.setData("activated", true);
    this.lastCheckpointX = checkpoint.x;
    this.lastCheckpointY = checkpoint.y - 20;

    // Visual feedback — flag brightens
    checkpoint.setTint(0x00FF44);
    this.tweens.add({ targets: checkpoint, scaleX: 1.3, scaleY: 1.3, duration: 150, yoyo: true });

    const vt = this.add.text(checkpoint.x, checkpoint.y - 50, "CHECKPOINT!", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "16px",
      color: "#10B981",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(60);
    this.tweens.add({
      targets: vt, y: vt.y - 30, alpha: 0, duration: 1200,
      onComplete: () => vt.destroy(),
    });
  }

  _reachFactory(player) {
    if (this.levelComplete || this.levelBlocked) return;

    // Check milk requirement
    if (player.milkCollected < this.milkRequired) {
      this.levelBlocked = true;
      const short = this.milkRequired - player.milkCollected;
      const msg = this.add.text(player.x, player.y - 60,
        `NOT ENOUGH MILK!\nNeed ${this.milkRequired} · Have ${player.milkCollected}\nCollect ${short} more`, {
        fontFamily: "Arial Black, Arial, sans-serif",
        fontSize: "20px",
        color: "#FF6B6B",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      }).setOrigin(0.5).setDepth(60);

      this.tweens.add({
        targets: msg, alpha: 0, y: msg.y - 30,
        delay: 2000, duration: 800,
        onComplete: () => { msg.destroy(); this.levelBlocked = false; },
      });

      // Shake the factory
      this.cameras.main.shake(200, 0.005);
      return;
    }

    this.levelComplete = true;
    player.body.setVelocity(0, 0);
    player.body.setAllowGravity(false);
    player.alive = false;

    // Celebration particles
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 60, () => {
        const px = player.x + Phaser.Math.Between(-40, 40);
        const py = player.y + Phaser.Math.Between(-50, 0);
        const p = this.add.image(px, py, "particle")
          .setDepth(50)
          .setTint(Phaser.Math.Between(0, 1) ? 0xFFD700 : 0x00FF88)
          .setScale(Phaser.Math.FloatBetween(0.4, 1.0));
        this.tweens.add({
          targets: p,
          y: py - Phaser.Math.Between(80, 200),
          alpha: 0,
          duration: Phaser.Math.Between(600, 1200),
          ease: "Cubic.easeOut",
          onComplete: () => p.destroy(),
        });
      });
    }

    const completeText = this.add.text(
      player.x, player.y - 80,
      `DELIVERED!\n${player.milkCollected} / ${this.milkMax} milk`,
      {
        fontFamily: "Arial Black, Arial, sans-serif",
        fontSize: "28px",
        color: "#FFD700",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      }
    ).setOrigin(0.5).setDepth(60);

    this.tweens.add({
      targets: completeText,
      y: completeText.y - 40,
      duration: 2000,
      ease: "Cubic.easeOut",
    });

    this.time.delayedCall(2200, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        const elapsed = this.time.now - this.startTime;
        this.scene.start("FactorySequence", {
          level: this.levelIndex,
          milk: player.milkCollected,
          milkMax: this.milkMax,
          milkRequired: this.milkRequired,
          coins: this.coinsCollected,
          playTime: elapsed,
          deaths: this.deathCount,
        });
      });
    });
  }

  _onPlayerDied() {
    if (this.levelComplete || this.paused) return;
    const newLives = this.lives - 1;
    if (newLives <= 0) {
      // Game Over
      this.time.delayedCall(1000, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("GameOverScene", {
            won: false, milk: this.player.milkCollected,
            total: this.milkMax, required: this.milkRequired,
            coins: this.coinsCollected, level: this.levelIndex,
          });
        });
      });
    } else {
      this.time.delayedCall(1000, () => {
        this.scene.restart({
          level: this.levelIndex,
          checkpointX: this.lastCheckpointX,
          checkpointY: this.lastCheckpointY,
          startTime: this.startTime,
          deathCount: this.deathCount + 1,
          lives: newLives,
        });
      });
    }
  }

  // ═══════════════════════════════════════════
  //  PAUSE
  // ═══════════════════════════════════════════

  _togglePause() {
    if (this.levelComplete) return;
    this.paused = !this.paused;

    if (this.paused) {
      this.physics.pause();
      this._showPauseMenu();
    } else {
      this.physics.resume();
      if (this._pauseOverlay) { this._pauseOverlay.destroy(); this._pauseOverlay = null; }
    }
  }

  _showPauseMenu() {
    const cx = GAME_WIDTH / 2, cy = GAME_HEIGHT / 2;
    this._pauseOverlay = this.add.container(0, 0).setDepth(200).setScrollFactor(0);

    const dim = this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55);
    this._pauseOverlay.add(dim);

    const title = this.add.text(cx, cy - 130, "⏸  PAUSED", {
      fontFamily: "Arial Black", fontSize: "40px", color: "#FFFFFF",
    }).setOrigin(0.5);
    this._pauseOverlay.add(title);

    const buttons = [
      { text: "▶  RESUME", action: () => this._togglePause() },
      { text: "🔄  RESTART", action: () => { this.physics.resume(); this.scene.restart({ level: this.levelIndex }); } },
      { text: "⚙  SETTINGS", action: () => { this.physics.resume(); this.scene.start("SettingsScene"); } },
      { text: "🏠  MAIN MENU", action: () => { this.physics.resume(); this.scene.start("MenuScene"); } },
    ];

    buttons.forEach((btn, i) => {
      const y = cy - 40 + i * 65;
      const w = 260, h = 48;
      const bg = this.add.graphics();
      bg.fillStyle(0x007BFF, 0.8);
      bg.fillRoundedRect(cx - w / 2, y - h / 2, w, h, 10);
      this._pauseOverlay.add(bg);

      const label = this.add.text(cx, y, btn.text, {
        fontFamily: "Arial Black", fontSize: "20px", color: "#FFFFFF",
      }).setOrigin(0.5);
      this._pauseOverlay.add(label);

      const hit = this.add.zone(cx, y, w, h).setInteractive({ useHandCursor: true });
      hit.on("pointerdown", btn.action);
      this._pauseOverlay.add(hit);
    });
  }

  // ═══════════════════════════════════════════
  //  TIMER
  // ═══════════════════════════════════════════

  _updateTimer(elapsed) {
    this.timerText.setText(this._formatTime(elapsed));
  }

  _formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
  }

  // ─── HUD ───

  _createHUD() {
    this.hudContainer = this.add.container(0, 0).setDepth(DEPTH.hud).setScrollFactor(0);

    // Filling bottle (top-left)
    this.bottleBg = this.add.image(42, 90, "hud_bottle").setOrigin(0.5, 0.5);
    this.hudContainer.add(this.bottleBg);

    // Milk fill mask (drawn programmatically)
    this.bottleFill = this.add.graphics();
    this.hudContainer.add(this.bottleFill);

    // Milk count text below bottle
    this.milkText = this.add.text(42, 148, "0", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "16px",
      color: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5, 0);
    this.hudContainer.add(this.milkText);

    // Required marker text
    this.milkReqText = this.add.text(42, 168, `/ ${this.milkRequired} needed`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      color: "#8899AA",
    }).setOrigin(0.5, 0);
    this.hudContainer.add(this.milkReqText);

    // Coin counter
    this.hudContainer.add(this.add.image(42, 192, "coin").setScale(0.7));
    this.coinText = this.add.text(56, 192, "0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#FFD700",
      stroke: "#000000",
      strokeThickness: 2,
    }).setOrigin(0, 0.5);
    this.hudContainer.add(this.coinText);

    // Lives display
    this.livesText = this.add.text(GAME_WIDTH - 30, 80, "♥♥♥", {
      fontFamily: "Arial", fontSize: "18px", color: "#FF4444",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(1, 0.5);
    this.hudContainer.add(this.livesText);

    // Timer
    this.timerText = this.add.text(GAME_WIDTH - 30, 110, "0:00", {
      fontFamily: "Arial", fontSize: "16px", color: "#CCDDEE",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(1, 0.5);
    this.hudContainer.add(this.timerText);

    // Pause button
    const pauseX = GAME_WIDTH - 30, pauseY = 145;
    const pauseBg = this.add.graphics();
    pauseBg.fillStyle(0x000000, 0.35);
    pauseBg.fillRoundedRect(pauseX - 18, pauseY - 14, 36, 28, 6);
    this.hudContainer.add(pauseBg);
    const pauseIcon = this.add.text(pauseX, pauseY, "⏸", { fontSize: "16px" }).setOrigin(0.5);
    this.hudContainer.add(pauseIcon);
    const pauseHit = this.add.zone(pauseX, pauseY, 36, 28).setInteractive({ useHandCursor: true });
    pauseHit.on("pointerdown", () => this._togglePause());
    this.hudContainer.add(pauseHit);
    this.hudContainer.add(
      this.add.text(GAME_WIDTH - 30, 40, LEVELS[this.levelIndex].name, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#B0C0D0",
        stroke: "#000000",
        strokeThickness: 2,
      }).setOrigin(1, 0.5)
    );

    // Progress bar background
    const barX = GAME_WIDTH / 2;
    const barY = 38;
    const barW = 300;
    const barH = 14;
    const barBg = this.add.graphics();
    barBg.fillStyle(0x000000, 0.4);
    barBg.fillRoundedRect(barX - barW / 2, barY - barH / 2, barW, barH, 7);
    barBg.lineStyle(2, 0xffffff, 0.2);
    barBg.strokeRoundedRect(barX - barW / 2, barY - barH / 2, barW, barH, 7);
    this.hudContainer.add(barBg);

    this.progressBar = this.add.graphics();
    this.hudContainer.add(this.progressBar);
    this._barW = barW;
    this._barH = barH;
    this._barX = barX;
    this._barY = barY;

    this.hudContainer.add(
      this.add.text(barX + barW / 2 + 12, barY, "🏭", { fontSize: "18px" }).setOrigin(0, 0.5)
    );
    this.hudContainer.add(
      this.add.text(barX - barW / 2 - 12, barY, "🍶", { fontSize: "14px" }).setOrigin(1, 0.5)
    );

    this._updateBottleFill(0);
    this._updateLives();
  }

  _updateBottleFill(amount) {
    const pct = this.milkMax > 0 ? Math.min(amount / this.milkMax, 1) : 0;
    this.milkText.setText(`${amount}`);
    this.coinText.setText(`${this.coinsCollected}`);

    // Redraw fill inside bottle
    const g = this.bottleFill;
    g.clear();
    if (pct <= 0) return;

    const bx = 42 - 16; // bottle inner left
    const by = 90 + 44; // bottle inner bottom
    const bw = 32;
    const bh = 74;      // inner height
    const fillH = bh * pct;

    // Milk color gradient from light blue to white
    g.fillStyle(0xF0F8FF, 0.85);
    g.fillRect(bx, by - fillH, bw, fillH);
    // Top foam line
    g.fillStyle(0xFFFFFF, 0.6);
    g.fillRect(bx, by - fillH, bw, 3);
    // Subtle horizontal lines for "liquid" feel
    g.lineStyle(1, 0xE0ECFF, 0.3);
    for (let y = by - fillH + 6; y < by; y += 10) {
      g.strokeRect(bx + 2, y, bw - 4, 0);
    }
  }

  // ─── Background particles ───

  _createBackgroundParticles() {
    const worldW = LEVELS[this.levelIndex].worldWidth;
    for (let i = 0; i < 8; i++) {
      const px = Phaser.Math.Between(100, worldW - 100);
      const py = Phaser.Math.Between(100, GAME_HEIGHT - 200);
      const p = this.add.image(px, py, "particle")
        .setDepth(DEPTH.bg + 3)
        .setTint(0xaaffaa)
        .setAlpha(0.25)
        .setScale(Phaser.Math.FloatBetween(0.3, 0.8));
      this.tweens.add({
        targets: p,
        x: px + Phaser.Math.Between(-100, 100),
        y: py + Phaser.Math.Between(-60, 60),
        alpha: { from: 0.15, to: 0.35 },
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  _updateLives() {
    let hearts = "";
    for (let i = 0; i < this.lives; i++) hearts += "♥";
    this.livesText.setText(hearts || "💀");
    if (this.lives <= 1) this.livesText.setColor("#FF0000");
  }

  _updateProgressBar() {
    const worldW = LEVELS[this.levelIndex].worldWidth;
    const progress = Phaser.Math.Clamp(this.player.x / worldW, 0, 1);
    const g = this.progressBar;
    g.clear();
    const fillW = (this._barW - 4) * progress;
    if (fillW > 0) {
      g.fillStyle(COLORS.vitaGreen, 0.9);
      g.fillRoundedRect(
        this._barX - this._barW / 2 + 2,
        this._barY - this._barH / 2 + 2,
        fillW,
        this._barH - 4,
        5
      );
    }
    const fx = LEVELS[this.levelIndex].factoryX;
    const fProgress = fx / worldW;
    const fX = this._barX - this._barW / 2 + (this._barW - 4) * fProgress;
    g.fillStyle(0xFFD700, 0.8);
    g.fillRect(fX - 1, this._barY - this._barH / 2, 3, this._barH);
  }

  // ─── Audio ───

  _playPickupSound(type) {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "golden") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "large") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(780, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (_) { /* audio not available */ }
  }

  _startAmbientAudio() {
    if (this._audioStarted) return;
    this._audioStarted = true;
    try {
      const ctx = new AudioContext();
      // Light wind
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 120;
      gain.gain.value = 0.015;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      // Gentle modulation
      setInterval(() => {
        osc.frequency.linearRampToValueAtTime(
          100 + Math.random() * 40,
          ctx.currentTime + 4
        );
      }, 4000);
    } catch (_) {
      // Audio not supported — game still works
    }
  }

  // ─── Helpers ───

  _drawHills(graphics, color, alpha, baseY, amplitude, worldW) {
    graphics.fillStyle(color, alpha);
    graphics.beginPath();
    graphics.moveTo(0, GAME_HEIGHT);
    for (let x = 0; x <= worldW + 200; x += 50) {
      const y = GAME_HEIGHT - baseY
        - Math.sin(x * 0.003) * amplitude
        - Math.sin(x * 0.007 + 1.5) * (amplitude * 0.6);
      graphics.lineTo(x, y);
    }
    graphics.lineTo(worldW + 200, GAME_HEIGHT);
    graphics.closePath();
    graphics.fillPath();
  }
}
