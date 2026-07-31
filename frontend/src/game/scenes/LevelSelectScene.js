// Vita Milk Rush — Level Select
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS, THEMES } from "../config";

export class LevelSelectScene extends Phaser.Scene {
  constructor() { super("LevelSelectScene"); }

  create() {
    const cx = GAME_WIDTH / 2;
    this.add.image(cx, GAME_HEIGHT / 2, "background");
    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.45);

    // Title
    this.add.text(cx, 60, "SELECT LEVEL", { fontFamily: "Arial Black", fontSize: "42px", color: "#FFFFFF", stroke: "#007BFF", strokeThickness: 4 }).setOrigin(0.5);

    const unlocked = Math.min(+(localStorage.getItem("vita_unlocked") || 1), 8);
    const keys = Object.keys(THEMES);

    // 2 rows of 4
    const startX = GAME_WIDTH / 2 - 250;
    const startY = 160;
    const colW = 170, rowH = 140;

    for (let i = 0; i < 8; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = startX + col * colW;
      const y = startY + row * rowH;
      const locked = i >= unlocked;

      const container = this.add.container(x, y).setAlpha(0);
      this.tweens.add({ targets: container, alpha: 1, y: y - 6, delay: 300 + i * 80, duration: 400, ease: "Cubic.easeOut" });

      const w = 150, h = 110;
      const bg = this.add.graphics();
      bg.fillStyle(locked ? 0x333344 : COLORS.vitaBlue, locked ? 0.5 : 0.8);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
      bg.lineStyle(2, locked ? 0x555566 : 0xFFFFFF, 0.2);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
      container.add(bg);

      // Level number
      const num = this.add.text(0, -18, locked ? "🔒" : `${i + 1}`, {
        fontFamily: "Arial Black", fontSize: locked ? "28px" : "32px", color: locked ? "#555566" : "#FFFFFF",
      }).setOrigin(0.5);
      container.add(num);

      // Level name
      const name = this.add.text(0, 22, locked ? "LOCKED" : THEMES[keys[i]]?.name || `Level ${i + 1}`, {
        fontFamily: "Arial", fontSize: "12px", color: locked ? "#444455" : "#AABBCC",
      }).setOrigin(0.5);
      container.add(name);

      if (!locked) {
        const hit = this.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
        hit.on("pointerover", () => { bg.clear(); bg.fillStyle(0x0098FF, 1); bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12); bg.lineStyle(2, 0xFFFFFF, 0.4); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12); });
        hit.on("pointerout", () => { bg.clear(); bg.fillStyle(COLORS.vitaBlue, 0.8); bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12); bg.lineStyle(2, 0xFFFFFF, 0.2); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12); });
        hit.on("pointerdown", () => {
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("GameScene", { level: i }));
        });
        container.add(hit);
      }
    }

    // Back button
    this._backButton(GAME_WIDTH / 2, GAME_HEIGHT - 60);

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  _backButton(x, y) {
    const w = 180, h = 44;
    const bg = this.add.graphics();
    bg.fillStyle(0x555566, 0.7);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 10);
    this.add.text(x, y, "← BACK", { fontFamily: "Arial Black", fontSize: "18px", color: "#CCCCCC" }).setOrigin(0.5);
    const hit = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    hit.on("pointerdown", () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("MenuScene"));
    });
  }
}
