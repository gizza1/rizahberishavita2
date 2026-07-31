import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
  constructor() { super("IntroScene"); }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x073b78);
    const glow = this.add.circle(width / 2, height / 2, 95, 0xffffff, 0.1);
    const logo = this.add.image(width / 2, height / 2, "vita-logo").setScale(0.15).setAlpha(0);
    const leftCurtain = this.add.rectangle(width / 4, height / 2, width / 2, height, 0x073b78);
    const rightCurtain = this.add.rectangle(width * 0.75, height / 2, width / 2, height, 0x073b78);

    this.tweens.add({ targets: [logo, glow], alpha: { from: 0, to: 1 }, duration: 450, ease: "Sine.easeOut" });
    this.tweens.add({ targets: logo, scale: 0.5, duration: 900, ease: "Back.easeOut" });
    this.tweens.add({
      targets: logo, alpha: 0, scale: 0.66, delay: 1200, duration: 380, ease: "Cubic.easeIn",
      onComplete: () => {
        this.tweens.add({ targets: leftCurtain, x: -width / 4, duration: 500, ease: "Cubic.easeInOut" });
        this.tweens.add({
          targets: rightCurtain, x: width * 1.25, duration: 500, ease: "Cubic.easeInOut",
          onComplete: () => this.scene.start("MenuScene"),
        });
      },
    });
    this.input.once("pointerdown", () => this.scene.start("MenuScene"));
    this.input.keyboard.once("keydown-SPACE", () => this.scene.start("MenuScene"));
  }
}
