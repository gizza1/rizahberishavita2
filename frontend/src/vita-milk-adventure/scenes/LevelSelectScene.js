import Phaser from "phaser";
import { LEVELS } from "../levels/LevelRegistry";
import { loadProgress } from "../lib/ProgressStore";

export class LevelSelectScene extends Phaser.Scene {
  constructor() { super("LevelSelectScene"); }

  create() {
    const { width } = this.scale;
    const progress = loadProgress();
    this.add.text(width / 2, 90, "CHOOSE YOUR ADVENTURE", { fontFamily: "Arial Black", fontSize: "36px", color: "#0a3f83" }).setOrigin(0.5);
    LEVELS.forEach((level, index) => {
      const unlocked = index <= progress.unlocked;
      const card = this.add.rectangle(width / 2, 210 + index * 145, 540, 112, unlocked ? 0xffffff : 0x9aa9b7, 1)
        .setStrokeStyle(3, unlocked ? 0x0753a4 : 0x74808b);
      const text = this.add.text(width / 2, 190 + index * 145, `${index + 1}. ${level.name}`, {
        fontFamily: "Arial Black", fontSize: "24px", color: unlocked ? "#0a3f83" : "#54606a",
      }).setOrigin(0.5);
      const detail = this.add.text(width / 2, 226 + index * 145, unlocked ? `Collect ${level.requiredMilk} bottles · ${level.theme === "farm" ? "Easy" : level.theme === "processing" ? "Medium" : "Final"}` : "Complete the previous level to unlock", {
        fontFamily: "Arial", fontSize: "16px", color: unlocked ? "#346080" : "#54606a",
      }).setOrigin(0.5);
      if (unlocked) {
        card.setInteractive({ useHandCursor: true });
        card.on("pointerdown", () => this.scene.start("GameScene", { levelId: level.id }));
        text.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.scene.start("GameScene", { levelId: level.id }));
        detail.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.scene.start("GameScene", { levelId: level.id }));
      }
    });
    this.add.text(width / 2, 665, "ESC: Main Menu", { fontFamily: "Arial", fontSize: "17px", color: "#174b6e" }).setOrigin(0.5);
    this.input.keyboard.once("keydown-ESC", () => this.scene.start("MenuScene"));
  }
}
