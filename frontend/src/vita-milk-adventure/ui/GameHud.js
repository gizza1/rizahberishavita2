export class GameHud {
  constructor(scene) {
    this.stats = scene.add.text(24, 22, "", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "19px", color: "#0a3f83",
      backgroundColor: "#ffffffcc", padding: { x: 14, y: 10 },
    }).setScrollFactor(0).setDepth(100);
    this.help = scene.add.text(scene.scale.width - 24, 28, "← → / A D: Move  ·  ↑ / W / Space: Jump + Double Jump", {
      fontFamily: "Arial, sans-serif", fontSize: "15px", color: "#174b6e",
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
    this.message = scene.add.text(scene.scale.width / 2, 100, "", {
      fontFamily: "Arial Black, Arial, sans-serif", fontSize: "20px", color: "#ffffff",
      backgroundColor: "#0a3f83cc", padding: { x: 14, y: 8 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0);
  }

  setStats({ collected, required, score, lives }) {
    this.stats.setText(`🥛 Milk: ${collected} / ${required}    ⭐ Score: ${score}    ❤️ Lives: ${lives}`);
  }

  showMessage(text) {
    this.message.setText(text).setAlpha(1);
    this.message.scene.tweens.killTweensOf(this.message);
    this.message.scene.tweens.add({ targets: this.message, alpha: 0, delay: 1600, duration: 350 });
  }

  update() {}
}
