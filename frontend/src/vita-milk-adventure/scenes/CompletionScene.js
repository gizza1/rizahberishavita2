import Phaser from "phaser";
import { saveCompletion } from "../lib/ProgressStore";

export class CompletionScene extends Phaser.Scene {
  constructor() {
    super("CompletionScene");
  }

  init(data) {
    this.results = data;
  }

  create() {
    const { width, height } = this.scale;
    const { collected, total, score, lives, levelId, levelIndex } = this.results;
    const percentage = total ? Math.round((collected / total) * 100) : 0;
    if (levelId) saveCompletion(levelId, { percentage, score }, levelIndex || 0);
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a3f83);
    this.add.text(width / 2, height / 2 - 130, "LEVEL COMPLETE!", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "42px", color: "#ffffff",
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 50, `🥛 Milk: ${collected} / ${total}\n⭐ Score: ${score}\n❤️ Lives: ${lives}\nCompletion: ${percentage}%`, {
      fontFamily: "Arial, sans-serif", fontSize: "24px", color: "#ddecff", align: "center", lineSpacing: 10,
    }).setOrigin(0.5);
    if (percentage === 100) {
      this.add.text(width / 2, height / 2 + 100, "100% Vita Collection Completed", {
        fontFamily: "Arial Black, Arial, sans-serif", fontSize: "24px", color: "#ffd34d",
      }).setOrigin(0.5);
    }
    const button = this.add.text(width / 2, height / 2 + 180, "LEVEL SELECT", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "20px", color: "#0a3f83",
      backgroundColor: "#ffffff", padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => this.scene.start("LevelSelectScene"));
    this.input.keyboard.once("keydown-SPACE", () => this.scene.start("LevelSelectScene"));
  }
}
