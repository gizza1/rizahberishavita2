// Vita Milk Rush — Game Over Scene
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "../config";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create(data) {
    const { won, milk, total, required, coins } = data;

    // Background
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "background");
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5);

    if (won) {
      // Victory
      const vGlow = this.add.text(GAME_WIDTH / 2, 140, "DELIVERY COMPLETE!", {
        fontFamily: "Arial Black, Arial, sans-serif",
        fontSize: "54px",
        color: "#FFD700",
      }).setOrigin(0.5).setAlpha(0.3);
      const vText = this.add.text(GAME_WIDTH / 2, 140, "DELIVERY COMPLETE!", {
        fontFamily: "Arial Black, Arial, sans-serif",
        fontSize: "54px",
        color: "#FFD700",
        stroke: "#B8860B",
        strokeThickness: 4,
      }).setOrigin(0.5);

      this.tweens.add({ targets: vGlow, alpha: { from: 0.2, to: 0.5 }, duration: 1500, yoyo: true, repeat: -1 });
      this.tweens.add({ targets: [vText, vGlow], y: "-=8", duration: 2000, yoyo: true, repeat: -1 });

      this.add.text(GAME_WIDTH / 2, 220, "The factory received fresh milk from your run!", {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
        color: "#E0F0FF",
      }).setOrigin(0.5);
    } else {
      this.add.text(GAME_WIDTH / 2, 200, "GAME OVER", {
        fontFamily: "Arial Black, Arial, sans-serif",
        fontSize: "56px",
        color: "#E74C3C",
        stroke: "#7B241C",
        strokeThickness: 4,
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 260, "No lives remaining. Try again!", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#A0B0C0",
      }).setOrigin(0.5);
    }

    // Stats
    this.add.text(GAME_WIDTH / 2, 310, `Milk Delivered: ${milk} / ${total}  (need ${required || 0})`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#FFFFFF",
    }).setOrigin(0.5);

    if (coins > 0) {
      this.add.text(GAME_WIDTH / 2, 350, `Coins Collected: ${coins}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#FFD700",
      }).setOrigin(0.5);
    }

    const pct = total > 0 ? Math.round((milk / total) * 100) : 0;
    const stars = pct >= 90 ? "★★★" : pct >= 60 ? "★★☆" : "★☆☆";
    this.add.text(GAME_WIDTH / 2, 390, stars, {
      fontFamily: "Arial, sans-serif",
      fontSize: "40px",
      color: "#FFD700",
    }).setOrigin(0.5);

    const nextIdx = data.nextLevel;
    if (won && nextIdx !== undefined && nextIdx < 8) {
      this._createButton(GAME_WIDTH / 2, 480, "NEXT LEVEL →", () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("GameScene", { level: nextIdx });
        });
      });
    }

    this._createButton(GAME_WIDTH / 2, 560, "PLAY AGAIN", () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("GameScene", { level: data.level ?? 0 });
      });
    });

    this._createButton(GAME_WIDTH / 2, 640, "MAIN MENU", () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("MenuScene");
      });
    });

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  _createButton(x, y, text, onClick) {
    const w = 240, h = 56;
    const bg = this.add.graphics();
    const draw = (hover) => {
      bg.clear();
      bg.fillStyle(hover ? 0x0098FF : COLORS.vitaBlue, 1);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 12);
      bg.fillStyle(0xffffff, hover ? 0.2 : 0.1);
      bg.fillRoundedRect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h / 2 - 3, 10);
    };
    draw(false);

    this.add.text(x, y, text, {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "22px",
      color: "#FFFFFF",
    }).setOrigin(0.5);

    const hit = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    hit.on("pointerover", () => draw(true));
    hit.on("pointerout", () => draw(false));
    hit.on("pointerdown", () => {
      this.tweens.add({ targets: bg, scaleX: 0.95, scaleY: 0.95, duration: 80, yoyo: true, onComplete: onClick });
    });
  }
}
