export class MobileControls {
  constructor(scene, player) {
    if (scene.sys.game.device.os.desktop) return;
    const controls = { left: false, right: false, jump: false };
    player.setTouchInput(controls);
    const makeButton = (x, label, key) => {
      const button = scene.add.circle(x, scene.scale.height - 72, 44, 0x0753a4, 0.55).setScrollFactor(0).setDepth(150).setInteractive();
      scene.add.text(x, scene.scale.height - 72, label, { fontFamily: "Arial Black", fontSize: "25px", color: "#ffffff" }).setOrigin(0.5).setScrollFactor(0).setDepth(151);
      button.on("pointerdown", () => { controls[key] = true; });
      button.on("pointerup", () => { controls[key] = false; });
      button.on("pointerout", () => { controls[key] = false; });
    };
    makeButton(70, "←", "left");
    makeButton(170, "→", "right");
    makeButton(scene.scale.width - 85, "↑", "jump");
  }
}
