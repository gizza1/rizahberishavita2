// Vita Milk Rush — Credits
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "../config";

export class CreditsScene extends Phaser.Scene {
  constructor() { super("CreditsScene"); }

  create() {
    const cx = GAME_WIDTH / 2;
    this.add.image(cx, GAME_HEIGHT / 2, "background");
    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55);

    this.add.text(cx, 80, "CREDITS", { fontFamily: "Arial Black", fontSize: "42px", color: "#FFFFFF", stroke: "#007BFF", strokeThickness: 4 }).setOrigin(0.5);

    // Credits text (scrolls up)
    const credits = [
      "", "VITA MILK RUSH", "", "A Qumështorja VITA Production", "",
      "───────  TEAM  ───────", "",
      "Game Design ......... VITA Studio",
      "Programming ......... VITA Dev Team",
      "Art & Animation ..... VITA Creative",
      "Sound Design ........ VITA Audio",
      "Quality Assurance ... VITA QA",
      "", "───────  SPECIAL THANKS  ───────", "",
      "The farmers of Kosovo",
      "Every VITA customer since 2003",
      "Fresh milk, every day",
      "", "───────  BUILT WITH  ───────", "",
      "Phaser.js Game Framework",
      "React · Tailwind CSS",
      "Web Audio API",
      "", "", "© 2026 Qumështorja VITA", "All rights reserved.",
      "", "Fresh Thinking. Fresh Dairy.",
    ];

    const yStart = GAME_HEIGHT;
    const text = this.add.text(cx, yStart, credits.join("\n"), {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#CCDDEE",
      align: "center",
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    // Scroll animation
    this.tweens.add({
      targets: text,
      y: -text.height,
      duration: 18000,
      ease: "Linear",
      onComplete: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("MenuScene"));
      },
    });

    // Skip hint
    this.add.text(cx, GAME_HEIGHT - 30, "Press ESC or tap to skip", {
      fontFamily: "Arial", fontSize: "12px", color: "#667788",
    }).setOrigin(0.5);

    this.input.once("pointerdown", () => this.scene.start("MenuScene"));
    this.input.keyboard.once("keydown-ESC", () => this.scene.start("MenuScene"));

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }
}
