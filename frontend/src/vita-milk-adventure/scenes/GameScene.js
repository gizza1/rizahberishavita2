import Phaser from "phaser";
import { getLevel, LEVELS } from "../levels/LevelRegistry";
import { Player } from "../objects/Player";
import { PlatformSystem } from "../objects/PlatformSystem";
import { CollectibleSystem } from "../objects/CollectibleSystem";
import { ObstacleSystem } from "../objects/ObstacleSystem";
import { FarmEnvironment } from "../objects/FarmEnvironment";
import { GameHud } from "../ui/GameHud";
import { AudioHooks } from "../ui/AudioHooks";
import { MobileControls } from "../ui/MobileControls";

export class GameScene extends Phaser.Scene {
  constructor() { super("GameScene"); }

  init(data) { this.levelId = data.levelId; this.characterKey = data.characterKey || "char-milk-32"; }

  create() {
    this.level = getLevel(this.levelId);
    this.platformOffsetY = 15;
    this.level.groundY = 668 + this.platformOffsetY;
    this.levelIndex = LEVELS.findIndex((level) => level.id === this.level.id);
    this.physics.world.setBounds(0, 0, this.level.worldWidth, this.level.worldHeight + 180);
    this.cameras.main.setBounds(0, 0, this.level.worldWidth, this.level.worldHeight);
    this.state = { collected: 0, required: this.level.requiredMilk, total: this.level.bottles.length, score: 0, lives: 3, complete: false };
    this.paused = false;
    FarmEnvironment.create(this, this.level);
    this.player = new Player(this, this.level.spawn.x, this.level.spawn.y, this.characterKey);
    this.platforms = new PlatformSystem(this, this.player);
    this.level.staticPlatforms.forEach(([x, y, width]) => this.platforms.addStatic(x, y + this.platformOffsetY, width));
    this.level.floatingPlatforms.forEach(([x, y, width]) => this.platforms.addFloating(x, y + this.platformOffsetY, width));
    this.level.bouncePlatforms.forEach(([x, y, width]) => this.platforms.addBounce(x, y + this.platformOffsetY, width));
    (this.level.movingPlatforms || []).forEach(([x, y, width, axis]) => this.platforms.addMoving(x, y + this.platformOffsetY, width, { axis, distance: 120 }));
    (this.level.hiddenPlatforms || []).forEach(([x, y, width]) => this.platforms.addHidden(x, y + this.platformOffsetY, width));
    (this.level.disappearingPlatforms || []).forEach(([x, y, width]) => this.platforms.addDisappearing(x, y + this.platformOffsetY, width));
    (this.level.conveyors || []).forEach(([x, y, width, direction]) => this.platforms.addConveyor(x, y + this.platformOffsetY, width, direction));
    this.obstacles = new ObstacleSystem(this, this.player, () => this._loseLife());
    this.level.spikes.forEach(([x, y]) => this.obstacles.addSpike(x, y + this.platformOffsetY));
    this.collectibles = new CollectibleSystem(this, this.player, ({ scoreValue }) => this._collectMilk(scoreValue));
    this.level.bottles.forEach(([x, y], index) => {
      this.collectibles.addMilkBottle(x, y, 100, this.level.hiddenBottleIndexes?.includes(index));
    });
    // Match the factory base exactly to the ground platform, regardless of level data offsets.
    const factoryY = this.level.groundY;
    // One shared Vita factory artwork is used as the finish destination in every level.
    this.goal = this.add.image(this.level.factory.x, factoryY, "vita-factory")
      .setOrigin(0.5, 1).setDepth(4).setScale(0.28);
    this.physics.add.existing(this.goal, true);
    this.goal.body.setSize(210, 125).setOffset(110, 150);
    this.goal.body.updateFromGameObject();
    this.physics.add.overlap(this.player, this.goal, () => this._tryComplete());
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(180, 100);
    this.hud = new GameHud(this);
    this.audio = new AudioHooks(this);
    this.audio.startMusic();
    this.mobileControls = new MobileControls(this, this.player);
    this.hud.showMessage(`LEVEL 1 MISSION: Collect ${this.level.requiredMilk} milk bottles, avoid spikes, then enter the Vita factory!`);
    this._refreshHud();
    this.input.keyboard.on("keydown-ESC", () => this._togglePause());
    this.input.keyboard.on("keydown-R", () => this.scene.restart({ levelId: this.level.id }));
  }

  update(time, delta) {
    if (this.state.complete || this.paused) return;
    this.player.update(time, delta);
    this.platforms.update(time);
    this.collectibles.update(this.player);
    if (this.player.y > this.level.worldHeight + 80) this._loseLife();
    this.hud.update();
  }

  _collectMilk(scoreValue) { this.state.collected += 1; this.state.score += scoreValue; this._refreshHud(); }

  _loseLife() {
    if (this.state.complete) return;
    this.state.lives -= 1;
    if (this.state.lives <= 0) { this.scene.restart({ levelId: this.level.id, characterKey: this.characterKey }); return; }
    this.player.setPosition(this.level.spawn.x, this.level.spawn.y);
    this.player.body.setVelocity(0, 0);
    this.hud.showMessage(`Ouch! ${this.state.lives} lives left`);
    this._refreshHud();
  }

  _tryComplete() {
    if (this.state.complete) return;
    if (this.state.collected < this.state.required) {
      this.hud.showMessage(`The factory needs ${this.state.required - this.state.collected} more bottle(s)`);
      return;
    }
    this.state.complete = true;
    this.events.emit("sound:complete");
    const { collected, total, score, lives } = this.state;
    this.scene.start("CompletionScene", { collected, total, score, lives, levelId: this.level.id, levelIndex: this.levelIndex, characterKey: this.characterKey });
  }

  _refreshHud() { const { collected, required, score, lives } = this.state; this.hud.setStats({ collected, required, score, lives }); }

  _togglePause() {
    if (this.state.complete) return;
    if (this.paused) {
      this.paused = false;
      this.physics.world.resume();
      this.pausePanel.destroy();
      return;
    }
    this.paused = true;
    this.physics.world.pause();
    const { width, height } = this.scale;
    this.pausePanel = this.add.container(width / 2, height / 2).setScrollFactor(0).setDepth(200);
    const panel = this.add.rectangle(0, 0, 360, 230, 0x0a3f83, 0.95);
    const title = this.add.text(0, -75, "PAUSED", { fontFamily: "Arial Black", fontSize: "30px", color: "#ffffff" }).setOrigin(0.5);
    const resume = this.add.text(0, -5, "RESUME", { fontFamily: "Arial Black", fontSize: "20px", color: "#0a3f83", backgroundColor: "#ffffff", padding: { x: 30, y: 10 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const restart = this.add.text(0, 60, "RESTART LEVEL", { fontFamily: "Arial", fontSize: "18px", color: "#ffffff" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const settings = this.add.text(0, 100, "SETTINGS", { fontFamily: "Arial", fontSize: "18px", color: "#ffffff" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    resume.on("pointerdown", () => this._togglePause());
    restart.on("pointerdown", () => this.scene.restart({ levelId: this.level.id, characterKey: this.characterKey }));
    settings.on("pointerdown", () => this.scene.start("SettingsScene", { returnTo: "GameScene", levelId: this.level.id }));
    this.pausePanel.add([panel, title, resume, restart, settings]);
  }
}
