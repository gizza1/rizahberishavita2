// Vita Milk Rush — Settings
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export class SettingsScene extends Phaser.Scene {
  constructor() { super("SettingsScene"); }

  create() {
    const cx = GAME_WIDTH / 2;
    this.add.image(cx, GAME_HEIGHT / 2, "background");
    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5);

    this.add.text(cx, 80, "SETTINGS", { fontFamily: "Arial Black", fontSize: "42px", color: "#FFFFFF", stroke: "#007BFF", strokeThickness: 4 }).setOrigin(0.5);

    // Controls display
    const controlsPanel = this.add.container(cx, 280);
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x1A2A3A, 0.8);
    panelBg.fillRoundedRect(-300, -120, 600, 240, 16);
    panelBg.lineStyle(2, 0x007BFF, 0.3);
    panelBg.strokeRoundedRect(-300, -120, 600, 240, 16);
    controlsPanel.add(panelBg);

    this.add.text(cx, 190, "🎮  CONTROLS", { fontFamily: "Arial Black", fontSize: "22px", color: "#FFD700" }).setOrigin(0.5);

    const controls = [
      ["Move", "← →  /  A D"],
      ["Jump", "↑  /  W  /  SPACE"],
      ["Run", "Hold SHIFT"],
      ["Dash", "X"],
      ["Slide", "↓  /  S"],
      ["Pause", "ESC  /  P"],
    ];

    controls.forEach(([label, key], i) => {
      const y = 230 + i * 36;
      this.add.text(cx - 160, y, label, { fontFamily: "Arial", fontSize: "16px", color: "#8899AA" }).setOrigin(0, 0.5);
      this.add.text(cx + 160, y, key, { fontFamily: "Arial Black", fontSize: "16px", color: "#FFFFFF" }).setOrigin(1, 0.5);
    });

    // Back button
    this._backButton(cx, GAME_HEIGHT - 60);
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
