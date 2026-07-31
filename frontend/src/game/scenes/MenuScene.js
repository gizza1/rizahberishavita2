// Vita Milk Rush — Main Menu
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "../config";

export class MenuScene extends Phaser.Scene {
  constructor() { super("MenuScene"); }

  create() {
    const cx = GAME_WIDTH / 2;
    this.add.image(cx, GAME_HEIGHT / 2, "background");
    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.35);

    // Floating milk particles
    for (let i = 0; i < 10; i++) {
      const p = this.add.image(Phaser.Math.Between(80, GAME_WIDTH - 80), Phaser.Math.Between(80, GAME_HEIGHT - 80), "milk")
        .setAlpha(0.2).setScale(0.7);
      this.tweens.add({ targets: p, y: p.y - 30, alpha: 0.08, duration: Phaser.Math.Between(2000, 4000), yoyo: true, repeat: -1 });
    }

    // Title
    const glow = this.add.text(cx, 140, "VITA MILK RUSH", { fontFamily: "Arial Black", fontSize: "68px", color: "#FFD700" })
      .setOrigin(0.5).setAlpha(0.2);
    const title = this.add.text(cx, 140, "VITA MILK RUSH", { fontFamily: "Arial Black", fontSize: "68px", color: "#FFFFFF", stroke: "#007BFF", strokeThickness: 6 })
      .setOrigin(0.5);
    this.tweens.add({ targets: glow, alpha: { from: 0.15, to: 0.4 }, duration: 2000, yoyo: true, repeat: -1 });
    this.tweens.add({ targets: [title, glow], y: "-=6", duration: 2500, yoyo: true, repeat: -1 });

    // Subtitle
    this.add.text(cx, 215, "Fresh Thinking. Fresh Dairy.", { fontFamily: "Arial", fontSize: "18px", color: "#A0B8D0" }).setOrigin(0.5);

    // Menu buttons
    const startY = 310;
    const gap = 70;
    const buttons = [
      { text: "▶  PLAY", action: () => this._startGame() },
      { text: "📋  LEVEL SELECT", action: () => this._transition("LevelSelectScene") },
      { text: "⚙  SETTINGS", action: () => this._transition("SettingsScene") },
      { text: "📜  CREDITS", action: () => this._transition("CreditsScene") },
    ];

    buttons.forEach((btn, i) => {
      const y = startY + i * gap;
      this._menuButton(cx, y, btn.text, btn.action, 800 + i * 100);
    });

    // Version
    this.add.text(GAME_WIDTH - 20, GAME_HEIGHT - 16, "v1.0", { fontFamily: "Arial", fontSize: "11px", color: "#506070" }).setOrigin(1);

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  _startGame() {
    // Start from level 1 or last unlocked
    const lvl = Math.min(+(localStorage.getItem("vita_unlocked") || 1), 8);
    this._transition("GameScene", { level: lvl - 1 });
  }

  _transition(target, data) {
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start(target, data));
  }

  _menuButton(x, y, text, action, delay = 0) {
    const w = 320, h = 56;
    const container = this.add.container(x, y).setAlpha(0);
    this.tweens.add({ targets: container, alpha: 1, y: y - 4, delay, duration: 400, ease: "Cubic.easeOut" });

    const bg = this.add.graphics();
    bg.fillStyle(0x007BFF, 0.85);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    bg.fillStyle(0xFFFFFF, 0.08);
    bg.fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h / 2 - 4, 12);
    container.add(bg);

    const label = this.add.text(0, 0, text, { fontFamily: "Arial Black", fontSize: "22px", color: "#FFFFFF" }).setOrigin(0.5);
    container.add(label);

    const hit = this.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
    hit.on("pointerover", () => { bg.clear(); bg.fillStyle(0x0098FF, 1); bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14); bg.fillStyle(0xFFFFFF, 0.15); bg.fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h / 2 - 4, 12); });
    hit.on("pointerout", () => { bg.clear(); bg.fillStyle(0x007BFF, 0.85); bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14); bg.fillStyle(0xFFFFFF, 0.08); bg.fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h / 2 - 4, 12); });
    hit.on("pointerdown", () => {
      this.tweens.add({ targets: container, scaleX: 0.95, scaleY: 0.95, duration: 80, yoyo: true, onComplete: action });
    });
    container.add(hit);
  }
}
