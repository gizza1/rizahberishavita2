import Phaser from "phaser";
import { saveCompletion } from "../lib/ProgressStore";
import { LEVELS } from "../levels/LevelRegistry";

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
    this.add.rectangle(width / 2, height / 2, width, height, 0x172b3a);
    this.add.rectangle(width / 2, height - 80, width, 160, 0x34414a);
    this.add.text(width / 2, 54, "VITA FACTORY · PRODUCTION COMPLETE", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "31px", color: "#ffffff",
    }).setOrigin(0.5);
    // Processing tank and animated milk fill.
    this.add.rectangle(250, 350, 170, 280, 0xaebdc5).setStrokeStyle(6, 0xeaf7ff);
    const milk = this.add.rectangle(250, 450, 146, 0, 0xf8fcff).setOrigin(0.5, 1);
    this.tweens.add({ targets: milk, displayHeight: 210, duration: 1200, ease: "Sine.easeInOut" });
    this.add.text(250, 525, "MILK\nTANK", { fontFamily: "Arial Black", fontSize: "22px", color: "#0a3f83", align: "center" }).setOrigin(0.5);
    this.add.rectangle(600, 500, 350, 26, 0x252f36).setStrokeStyle(3, 0x8999a4);
    for (let x = 470; x <= 730; x += 65) this.add.text(x, 500, "›", { fontSize: "32px", color: "#d9e5ec" }).setOrigin(0.5);
    const packages = [0, 1, 2, 3].map((index) => this.add.image(460 + index * 45, 458, this.results.characterKey || "char-milk-32").setDisplaySize(28, 46));
    packages.forEach((pack, index) => this.tweens.add({ targets: pack, x: 750, duration: 1700, delay: 700 + index * 260, repeat: -1, ease: "Linear" }));
    this.add.rectangle(960, 388, 240, 240, 0x0a4d9c).setStrokeStyle(5, 0x8ac6e8);
    this.add.text(960, 300, "PACK & SHIP", { fontFamily: "Arial Black", fontSize: "24px", color: "#ffffff" }).setOrigin(0.5);
    this.add.text(width / 2, 620, `Milk delivered: ${collected}/${total}   ·   Score: ${score}   ·   Lives: ${lives}`, {
      fontFamily: "Arial", fontSize: "20px", color: "#ddecff",
    }).setOrigin(0.5);
    const nextLevel = LEVELS[levelIndex + 1];
    const label = nextLevel ? "NEXT LEVEL" : "PLAY AGAIN";
    const button = this.add.text(width / 2, 675, label, {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "20px", color: "#0a3f83",
      backgroundColor: "#ffffff", padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const advance = () => this.scene.start("GameScene", { levelId: nextLevel?.id || levelId, characterKey: this.results.characterKey });
    button.on("pointerdown", advance);
    this.input.keyboard.once("keydown-SPACE", advance);
  }
}
