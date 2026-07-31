import Phaser from "phaser";
import { LEVELS } from "../levels/LevelRegistry";

const CHARACTERS = [
  { key: "char-whipping-cream", name: "Whipping Cream", tint: 0xe24335 },
  { key: "char-milk-32", name: "Vita Milk", tint: 0x1b5ba7 },
  { key: "char-kos", name: "Kos Yogurt", tint: 0x20a6cb },
  { key: "char-cooking-cream", name: "Cooking Cream", tint: 0xe24335 },
];

export class CharacterSelectScene extends Phaser.Scene {
  constructor() { super("CharacterSelectScene"); }

  create() {
    const { width, height } = this.scale;
    this.selected = null;
    this.add.text(width / 2, 66, "CHOOSE YOUR VITA CHARACTER", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "34px", color: "#0a3f83",
    }).setOrigin(0.5);
    this.add.text(width / 2, 108, "Pick a product, then begin Level 1", {
      fontFamily: "Arial, sans-serif", fontSize: "19px", color: "#285878",
    }).setOrigin(0.5);

    CHARACTERS.forEach((character, index) => this._addCharacter(character, 232 + index * 272, 300));

    this.playButton = this.add.text(width / 2, height - 82, "PLAY LEVEL 1", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "24px", color: "#ffffff",
      backgroundColor: "#a2b4c4", padding: { x: 34, y: 15 },
    }).setOrigin(0.5).setAlpha(0.65);
    this.playButton.on("pointerdown", () => {
      if (!this.selected) return;
      this.scene.start("GameScene", { levelId: LEVELS[0].id, characterKey: this.selected.key });
    });
    this.input.keyboard.once("keydown-ESC", () => this.scene.start("MenuScene"));
  }

  _addCharacter(character, x, y) {
    const card = this.add.rectangle(x, y, 220, 330, 0xffffff, 0.92).setStrokeStyle(4, 0xc6d9ea);
    const picture = this.add.image(x, y - 24, character.key).setDisplaySize(124, 212);
    const label = this.add.text(x, y + 132, character.name, {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "20px", color: "#0a3f83",
    }).setOrigin(0.5);
    const hit = this.add.zone(x, y, 220, 330).setInteractive({ useHandCursor: true });
    hit.on("pointerdown", () => {
      this.cards?.forEach((item) => item.card.setStrokeStyle(4, 0xc6d9ea));
      card.setStrokeStyle(7, character.tint);
      this.selected = character;
      this.playButton.setAlpha(1).setInteractive({ useHandCursor: true });
      this.playButton.setBackgroundColor("#0753a4");
    });
    this.cards = this.cards || [];
    this.cards.push({ card, picture, label, hit });
  }
}
