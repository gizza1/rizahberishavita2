import Phaser from "phaser";

const KEY = "vita-milk-adventure-settings";
const getSettings = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { audio: true, particles: true }; }
  catch { return { audio: true, particles: true }; }
};

export class SettingsScene extends Phaser.Scene {
  constructor() { super("SettingsScene"); }
  init(data) { this.returnTo = data.returnTo || "MenuScene"; this.levelId = data.levelId; }

  create() {
    const { width, height } = this.scale;
    this.settings = getSettings();
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a3f83);
    this.add.text(width / 2, 160, "SETTINGS", { fontFamily: "Arial Black", fontSize: "40px", color: "#ffffff" }).setOrigin(0.5);
    this.audio = this._toggle(width / 2, 285, "Audio", "audio");
    this.particles = this._toggle(width / 2, 370, "Particles", "particles");
    const back = this.add.text(width / 2, 510, "BACK", { fontFamily: "Arial Black", fontSize: "20px", color: "#0a3f83", backgroundColor: "#ffffff", padding: { x: 32, y: 13 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this._back());
    this.input.keyboard.once("keydown-ESC", () => this._back());
  }

  _toggle(x, y, label, key) {
    const item = this.add.text(x, y, "", { fontFamily: "Arial Black", fontSize: "24px", color: "#ffffff" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const render = () => item.setText(`${label}: ${this.settings[key] ? "ON" : "OFF"}`);
    render();
    item.on("pointerdown", () => { this.settings[key] = !this.settings[key]; localStorage.setItem(KEY, JSON.stringify(this.settings)); render(); });
    return item;
  }

  _back() { this.scene.start(this.returnTo, this.levelId ? { levelId: this.levelId } : {}); }
}
