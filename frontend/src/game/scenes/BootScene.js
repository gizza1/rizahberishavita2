// Vita Milk Rush — Boot Scene (asset generation)
import Phaser from "phaser";
import { COLORS, WORLD_WIDTH, GAME_HEIGHT } from "../config";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Shared brand artwork used on factories and milk pickups.
    this.load.image("vita_logo", "/vita.png");
    this.load.image("vitaFactory", "/game-assets/vita-factory.png");
  }

  create() {
    // Generate all textures procedurally
    this._genGroundTexture();
    this._genPlatformTexture();
    this._genMilkPickupTexture();
    this._genSpikeTexture();
    this._genFactoryTexture();
    this._genParticleTexture();
    this._genBgTexture();
    this._genCoinTexture();
    this._genCheckpointTexture();
    this._genCowTexture();
    this._genTractorTexture();
    this._genCheeseTexture();
    this._genHayBaleTexture();
    this._genFenceTexture();
    this._genSteamVentTexture();
    this._genMachineryTexture();
    this._genTruckTexture();
    this._genPackageTexture();
    this._genTankTexture();

    this.scene.start("MenuScene");
  }

  _genGroundTexture() {
    const g = this.add.graphics();
    // Grass surface
    g.fillStyle(COLORS.ground, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(COLORS.groundDark, 1);
    g.fillRect(0, 16, 64, 16);
    // Grass top
    g.fillStyle(COLORS.platformTop, 1);
    g.fillRect(0, 0, 64, 4);
    g.generateTexture("ground", 64, 32);
    g.destroy();
  }

  _genPlatformTexture() {
    const g = this.add.graphics();
    g.fillStyle(COLORS.platform, 1);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(COLORS.platformTop, 1);
    g.fillRect(0, 0, 32, 3);
    g.generateTexture("platform", 32, 16);
    g.destroy();
  }

  _genMilkPickupTexture() {
    // Small milk carton
    let g = this.add.graphics();
    g.fillStyle(0xf8fcff, 1);
    g.fillRect(4, 8, 16, 18);
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRect(8, 2, 8, 8);
    g.fillStyle(COLORS.vitaBlue, 0.9);
    g.fillRect(6, 14, 12, 6);
    g.fillStyle(0xffffff, 0.3);
    g.fillRect(5, 20, 3, 4);
    g.generateTexture("milk", 24, 28);
    g.destroy();

    // Medium milk carton (taller)
    g = this.add.graphics();
    g.fillStyle(0xf0f6ff, 1);
    g.fillRect(4, 16, 20, 26);
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRect(9, 4, 10, 14);
    g.fillStyle(0x6699FF, 0.9);
    g.fillRect(6, 24, 16, 8);
    g.fillStyle(0xffffff, 0.35);
    g.fillRect(6, 30, 4, 6);
    g.generateTexture("milk_medium", 28, 44);
    g.destroy();

    // Large milk can
    g = this.add.graphics();
    // Metal can body
    g.fillStyle(0xE8E0D0, 1);
    g.fillRoundedRect(0, 8, 36, 44, 4);
    // Ridges
    g.lineStyle(1, 0xC8C0B0, 0.6);
    g.strokeRect(4, 16, 28, 0);
    g.strokeRect(4, 28, 28, 0);
    g.strokeRect(4, 40, 28, 0);
    // Handle
    g.lineStyle(3, 0x888888, 1);
    g.strokeRect(10, -2, 16, 12);
    // Label
    g.fillStyle(0xFFCC44, 1);
    g.fillRect(8, 32, 20, 12);
    g.generateTexture("milk_large", 36, 54);
    g.destroy();

    // Golden milk
    g = this.add.graphics();
    g.fillStyle(0xFFE880, 1);
    g.fillRect(4, 8, 18, 22);
    g.fillStyle(0xFFD700, 1);
    g.fillRoundedRect(8, 0, 10, 10, 2);
    g.fillStyle(0xB8860B, 0.9);
    g.fillRect(6, 16, 14, 6);
    // Sparkle dots
    g.fillStyle(0xFFFFFF, 0.8);
    g.fillCircle(6, 10, 2);
    g.fillCircle(18, 22, 1.5);
    g.fillCircle(10, 28, 1);
    g.generateTexture("milk_golden", 26, 32);
    g.destroy();

    // HUD bottle for fill display
    g = this.add.graphics();
    g.fillStyle(0x1a2a3a, 0.5);
    g.fillRoundedRect(0, 0, 40, 100, 8);
    g.lineStyle(2, 0xFFFFFF, 0.3);
    g.strokeRoundedRect(0, 0, 40, 100, 8);
    // Neck
    g.fillStyle(0x1a2a3a, 0.5);
    g.fillRect(12, -14, 16, 18);
    g.lineStyle(2, 0xFFFFFF, 0.3);
    g.strokeRect(12, -14, 16, 18);
    // Cap
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRoundedRect(10, -20, 20, 10, 3);
    g.generateTexture("hud_bottle", 40, 100);
    g.destroy();
  }

  _genSpikeTexture() {
    const g = this.add.graphics();
    g.fillStyle(COLORS.spike, 1);
    g.fillTriangle(10, 0, 0, 18, 20, 18);
    g.fillStyle(0xc0392b, 1);
    g.fillTriangle(10, 3, 3, 18, 17, 18);
    g.generateTexture("spike", 20, 18);
    g.destroy();
  }

  _genFactoryTexture() {
    const g = this.add.graphics();
    // Main building
    g.fillStyle(COLORS.factory, 1);
    g.fillRect(0, 30, 120, 90);
    // Roof
    g.fillStyle(COLORS.factoryRoof, 1);
    g.fillTriangle(60, 0, 0, 30, 120, 30);
    // Door
    g.fillStyle(0x5D4037, 1);
    g.fillRect(40, 70, 40, 50);
    // Windows
    g.fillStyle(0xFFECB3, 0.8);
    g.fillRect(15, 40, 25, 20);
    g.fillRect(80, 40, 25, 20);
    // Chimney
    g.fillStyle(0x6D4C41, 1);
    g.fillRect(85, 5, 15, 25);
    // VITA sign
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRect(25, 55, 70, 15);
    g.generateTexture("factory", 120, 120);
    g.destroy();
  }

  _genParticleTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture("particle", 8, 8);
    g.destroy();
  }

  _genBgTexture() {
    const g = this.add.graphics();
    const w = 1280;
    const h = 720;
    // Sky gradient
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Phaser.Math.Interpolation.Linear([135, 200], t);
      const gr = Phaser.Math.Interpolation.Linear([206, 230], t);
      const b = Phaser.Math.Interpolation.Linear([235, 255], t);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gr, b), 1);
      g.fillRect(0, y, w, 1);
    }
    // Distant hills
    g.fillStyle(0x7BA05B, 0.4);
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 40) {
      g.lineTo(x, h - 80 - Math.sin(x * 0.008) * 40 - Math.sin(x * 0.015) * 30);
    }
    g.lineTo(w, h);
    g.closePath();
    g.fillPath();

    g.fillStyle(0x6B8E4E, 0.5);
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 30) {
      g.lineTo(x, h - 60 - Math.sin(x * 0.01 + 1) * 35 - Math.sin(x * 0.02) * 20);
    }
    g.lineTo(w, h);
    g.closePath();
    g.fillPath();

    g.generateTexture("background", w, h);
    g.destroy();
  }

  _genCoinTexture() {
    const g = this.add.graphics();
    // Outer ring
    g.fillStyle(0xFFD700, 1);
    g.fillCircle(10, 10, 10);
    // Inner
    g.fillStyle(0xFFEC80, 1);
    g.fillCircle(10, 10, 7);
    // Star
    g.fillStyle(0xFFD700, 1);
    g.fillCircle(10, 10, 3);
    g.generateTexture("coin", 20, 20);
    g.destroy();
  }

  _genCheckpointTexture() {
    const g = this.add.graphics();
    // Pole
    g.fillStyle(0xAAAAAA, 1);
    g.fillRect(5, 0, 4, 36);
    // Flag
    g.fillStyle(COLORS.vitaGreen, 1);
    g.fillTriangle(9, 4, 28, 14, 9, 24);
    // Glow base
    g.fillStyle(COLORS.vitaGreen, 0.3);
    g.fillCircle(7, 38, 8);
    g.generateTexture("checkpoint", 30, 40);
    g.destroy();
  }

  _genCowTexture() {
    const g = this.add.graphics();
    // Body
    g.fillStyle(0xF5F5DC, 1);
    g.fillRoundedRect(2, 8, 44, 22, 6);
    // Spots
    g.fillStyle(0x4A3520, 0.6);
    g.fillCircle(14, 16, 6); g.fillCircle(34, 20, 5);
    // Head
    g.fillStyle(0xF5F5DC, 1);
    g.fillRoundedRect(42, 6, 14, 18, 4);
    // Eyes
    g.fillStyle(0x000000, 1);
    g.fillCircle(50, 14, 2);
    // Legs
    g.fillStyle(0xE8DCC8, 1);
    g.fillRect(8, 28, 5, 14); g.fillRect(18, 28, 5, 14);
    g.fillRect(30, 28, 5, 14); g.fillRect(40, 28, 5, 14);
    // Horns
    g.fillStyle(0xDDD5C5, 1);
    g.fillTriangle(44, 6, 47, 0, 50, 6);
    g.fillTriangle(52, 6, 55, 0, 54, 6);
    g.generateTexture("cow", 60, 42);
    g.destroy();
  }

  _genTractorTexture() {
    const g = this.add.graphics();
    // Body
    g.fillStyle(0xCC3333, 1);
    g.fillRect(0, 10, 56, 24);
    // Cab
    g.fillStyle(0xAA2222, 1);
    g.fillRect(10, -8, 24, 20);
    // Window
    g.fillStyle(0x88CCFF, 0.7);
    g.fillRect(14, -4, 16, 12);
    // Big wheel
    g.fillStyle(0x222222, 1);
    g.fillCircle(48, 34, 14);
    g.fillStyle(0x444444, 1);
    g.fillCircle(48, 34, 8);
    // Small wheel
    g.fillStyle(0x222222, 1);
    g.fillCircle(12, 34, 9);
    g.fillStyle(0x444444, 1);
    g.fillCircle(12, 34, 5);
    // Exhaust
    g.fillStyle(0x666666, 1);
    g.fillRect(0, -2, 4, 14);
    g.generateTexture("tractor", 62, 50);
    g.destroy();
  }

  _genCheeseTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xFFD700, 1);
    g.fillCircle(18, 18, 18);
    g.fillStyle(0xFFEC80, 0.5);
    g.fillCircle(18, 18, 14);
    // Holes
    g.fillStyle(0xE8C800, 0.6);
    g.fillCircle(10, 10, 4);
    g.fillCircle(24, 14, 3);
    g.fillCircle(14, 24, 5);
    g.fillCircle(26, 24, 2);
    g.generateTexture("cheese", 36, 36);
    g.destroy();
  }

  _genHayBaleTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xDAA520, 1);
    g.fillRoundedRect(0, 0, 36, 24, 4);
    // Lines
    g.lineStyle(1, 0xB8860B, 0.5);
    g.strokeRect(4, 4, 28, 0);
    g.strokeRect(4, 10, 28, 0);
    g.strokeRect(4, 16, 28, 0);
    // Tie strings
    g.lineStyle(2, 0x8B6914, 0.7);
    g.strokeRect(10, 0, 0, 24);
    g.strokeRect(26, 0, 0, 24);
    g.generateTexture("hay", 36, 24);
    g.destroy();
  }

  _genFenceTexture() {
    const g = this.add.graphics();
    // Posts
    g.fillStyle(0x8B6914, 1);
    g.fillRect(0, 0, 4, 28);
    g.fillRect(28, 0, 4, 28);
    // Rails
    g.fillRect(0, 6, 32, 3);
    g.fillRect(0, 18, 32, 3);
    // Electric sparks (small dots)
    g.fillStyle(0xFFFF00, 0.8);
    g.fillCircle(6, 15, 1.5);
    g.fillCircle(16, 7, 1.5);
    g.fillCircle(26, 19, 1.5);
    g.generateTexture("fence", 32, 28);
    g.destroy();
  }

  _genSteamVentTexture() {
    const g = this.add.graphics();
    // Pipe
    g.fillStyle(0x888888, 1);
    g.fillRect(6, 10, 20, 20);
    // Opening
    g.fillStyle(0x444444, 1);
    g.fillRect(10, 0, 12, 12);
    // Base
    g.fillStyle(0x999999, 1);
    g.fillRect(2, 26, 28, 6);
    // Bolts
    g.fillStyle(0x666666, 1);
    g.fillCircle(6, 30, 2);
    g.fillCircle(26, 30, 2);
    g.generateTexture("steam_vent", 32, 32);
    g.destroy();
  }

  _genMachineryTexture() {
    const g = this.add.graphics();
    // Base
    g.fillStyle(0x666666, 1);
    g.fillRect(4, 20, 40, 24);
    // Piston
    g.fillStyle(0x888888, 1);
    g.fillRect(16, 4, 16, 16);
    // Head
    g.fillStyle(0xAAAAAA, 1);
    g.fillRect(10, 0, 28, 8);
    // Gears
    g.fillStyle(0x777777, 1);
    g.fillCircle(8, 32, 6);
    g.fillCircle(40, 32, 6);
    g.fillStyle(0x555555, 1);
    g.fillCircle(8, 32, 3);
    g.fillCircle(40, 32, 3);
    // Warning stripe
    g.fillStyle(0xFFCC00, 1);
    g.fillRect(4, 40, 40, 4);
    g.generateTexture("machinery", 48, 44);
    g.destroy();
  }

  _genTruckTexture() {
    const g = this.add.graphics();
    // Cab
    g.fillStyle(0x3366CC, 1);
    g.fillRect(0, 4, 24, 22);
    // Windshield
    g.fillStyle(0x88CCFF, 0.7);
    g.fillRect(16, 8, 6, 10);
    // Cargo box
    g.fillStyle(0xFFFFFF, 1);
    g.fillRect(26, 0, 40, 26);
    // VITA logo on cargo
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRect(34, 8, 24, 12);
    // Wheels
    g.fillStyle(0x222222, 1);
    g.fillCircle(8, 30, 8);
    g.fillCircle(54, 30, 8);
    g.fillStyle(0x444444, 1);
    g.fillCircle(8, 30, 4);
    g.fillCircle(54, 30, 4);
    g.generateTexture("truck", 66, 38);
    g.destroy();
  }

  _genPackageTexture() {
    const g = this.add.graphics();
    // Carton
    g.fillStyle(0xF8FCFF, 1);
    g.fillRoundedRect(0, 0, 20, 26, 3);
    // VITA branding
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRect(2, 8, 16, 10);
    // Cap
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRoundedRect(5, -4, 10, 6, 2);
    g.generateTexture("package", 20, 26);
    g.destroy();
  }

  _genTankTexture() {
    const g = this.add.graphics();
    // Tank body
    g.fillStyle(0xCCCCCC, 1);
    g.fillRoundedRect(0, 10, 80, 50, 8);
    // Glass window showing milk
    g.fillStyle(0x88AACC, 0.5);
    g.fillRect(20, 18, 40, 34);
    // Fill level indicator lines
    g.lineStyle(1, 0x666666, 0.3);
    g.strokeRect(20, 26, 40, 0);
    g.strokeRect(20, 34, 40, 0);
    g.strokeRect(20, 42, 40, 0);
    // Legs
    g.fillStyle(0x999999, 1);
    g.fillRect(8, 58, 10, 12);
    g.fillRect(62, 58, 10, 12);
    // Pipe
    g.fillStyle(0xAAAAAA, 1);
    g.fillRect(80, 20, 16, 8);
    g.generateTexture("tank", 96, 70);
    g.destroy();
  }
}
