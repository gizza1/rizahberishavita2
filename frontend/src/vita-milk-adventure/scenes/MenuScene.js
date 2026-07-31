import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 70, "VITA MILK ADVENTURE", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "42px", color: "#0a3f83",
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 10, "A fresh platform adventure", {
      fontFamily: "Arial, sans-serif", fontSize: "22px", color: "#174b6e",
    }).setOrigin(0.5);
    const start = this.add.text(width / 2, height / 2 + 60, "PLAY ADVENTURE", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "24px", color: "#ffffff",
      backgroundColor: "#0753a4", padding: { x: 28, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const settings = this.add.text(width / 2, height / 2 + 135, "SETTINGS", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "18px", color: "#0a3f83",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const begin = () => this.scene.start("CharacterSelectScene");
    start.on("pointerdown", begin);
    settings.on("pointerdown", () => this.scene.start("SettingsScene"));
    this.input.keyboard.once("keydown-SPACE", begin);
    this.input.keyboard.once("keydown-ENTER", begin);
  }
}
