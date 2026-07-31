// Vita Milk Rush — Factory Finish Sequence
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS, DEPTH, MILK } from "../config";

export class FactorySequence extends Phaser.Scene {
  constructor() {
    super("FactorySequence");
  }

  init(data) {
    this.level = data.level ?? 0;
    this.milk = data.milk ?? 0;
    this.milkMax = data.milkMax ?? 100;
    this.milkRequired = data.milkRequired ?? 60;
    this.coins = data.coins ?? 0;
    this.playTime = data.playTime ?? 0;
    this.deaths = data.deaths ?? 0;
  }

  create() {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    // Dark background
    this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x0A1F44, 1);

    // ─── Floor ───
    const floor = this.add.rectangle(cx, GAME_HEIGHT - 60, GAME_WIDTH, 120, 0x3A3A3A);
    const floorLine = this.add.rectangle(cx, GAME_HEIGHT - 60, GAME_WIDTH, 3, 0x555555);

    // ─── Factory background wall ───
    this.add.rectangle(cx, 280, 600, 340, 0x4A4A4A, 1).setStrokeStyle(3, 0x666666);

    // ─── Gate (two doors) ───
    this.gateLeft = this.add.rectangle(cx - 70, 350, 100, 200, 0x666666).setStrokeStyle(2, 0x888888);
    this.gateRight = this.add.rectangle(cx + 70, 350, 100, 200, 0x666666).setStrokeStyle(2, 0x888888);
    // Gate details
    this.add.rectangle(cx - 70, 360, 60, 4, 0x888888);
    this.add.rectangle(cx + 70, 360, 60, 4, 0x888888);

    // ─── Storage tank ───
    this.tank = this.add.image(cx + 220, GAME_HEIGHT - 120, "tank").setScale(1.8);
    this.tankFill = this.add.graphics();
    this.tankFillPct = 0;

    // ─── Conveyor belt ───
    this.add.rectangle(cx + 40, GAME_HEIGHT - 170, 320, 10, 0x444444);
    // Conveyor arrows
    for (let i = 0; i < 5; i++) {
      const ax = cx - 100 + i * 55;
      this.add.text(ax, GAME_HEIGHT - 170, "▸", {
        fontSize: "14px", color: "#666666",
      }).setOrigin(0.5);
    }

    // ─── Packages (hidden initially) ───
    this.packages = [];
    for (let i = 0; i < 5; i++) {
      const pkg = this.add.image(cx - 80 + i * 40, GAME_HEIGHT - 192, "package")
        .setScale(0.8).setAlpha(0);
      this.packages.push(pkg);
    }

    // ─── Delivery trucks ───
    this.trucks = [];
    for (let i = 0; i < 3; i++) {
      const truck = this.add.image(-100, GAME_HEIGHT - 85, "truck")
        .setScale(1.4);
      this.trucks.push(truck);
    }

    // ─── Bottle (character) ───
    this.bottle = this.add.graphics();
    this._drawBottle(0);
    this.bottleX = cx;
    this.bottleY = GAME_HEIGHT - 120;

    // ─── Title text ───
    this.title = this.add.text(cx, 80, "FACTORY DELIVERY", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "36px",
      color: "#FFD700",
    }).setOrigin(0.5).setAlpha(0);

    // ─── Subtitle ───
    this.subtitle = this.add.text(cx, 130, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#AABBCC",
    }).setOrigin(0.5).setAlpha(0);

    // ─── Stats panel (hidden initially) ───
    this.statsContainer = this.add.container(cx, cy).setAlpha(0);

    const statBg = this.add.rectangle(0, 0, 420, 320, 0x1A2A3A, 0.9)
      .setStrokeStyle(2, COLORS.vitaBlue);
    this.statsContainer.add(statBg);

    const statTitle = this.add.text(0, -130, "LEVEL COMPLETE!", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "28px",
      color: "#10B981",
    }).setOrigin(0.5);
    this.statsContainer.add(statTitle);

    const stats = [
      { label: "Milk Delivered", value: `${this.milk} / ${this.milkMax}` },
      { label: "Coins Earned", value: `${this.coins}` },
      { label: "Time", value: this._formatTime(this.playTime) },
      { label: "Deaths", value: `${this.deaths}` },
    ];

    const pct = this.milkMax > 0 ? Math.round((this.milk / this.milkMax) * 100) : 0;
    const stars = pct >= 90 ? "★★★" : pct >= 60 ? "★★☆" : "★☆☆";

    stats.forEach((s, i) => {
      const y = -90 + i * 45;
      this.statsContainer.add(
        this.add.text(-160, y, s.label, {
          fontFamily: "Arial, sans-serif",
          fontSize: "18px",
          color: "#8899AA",
        }).setOrigin(0, 0.5)
      );
      this.statsContainer.add(
        this.add.text(160, y, s.value, {
          fontFamily: "Arial Black, Arial, sans-serif",
          fontSize: "18px",
          color: "#FFFFFF",
        }).setOrigin(1, 0.5)
      );
    });

    this.statsContainer.add(
      this.add.text(0, 110, stars, {
        fontFamily: "Arial, sans-serif",
        fontSize: "40px",
        color: "#FFD700",
      }).setOrigin(0.5)
    );

    // ─── Buttons (hidden) ───
    this.btnContainer = this.add.container(cx, cy + 220).setAlpha(0);
    const btnY = 0;

    if (this.level < 7) {
      this._addButton(this.btnContainer, 0, btnY, "NEXT LEVEL →", 0x10B981, () => {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("GameScene", { level: this.level + 1 });
        });
      });
    }

    this._addButton(this.btnContainer, 0, btnY + 60, "PLAY AGAIN", COLORS.vitaBlue, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("GameScene", { level: this.level });
      });
    });

    this._addButton(this.btnContainer, 0, btnY + 120, "MAIN MENU", 0x666666, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("MenuScene");
      });
    });

    // ─── Play the sequence ───
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this.time.delayedCall(500, () => this._step1_Title());
  }

  // ═══════════════════════════════════════════
  //  SEQUENCE STEPS
  // ═══════════════════════════════════════════

  _step1_Title() {
    this.tweens.add({ targets: this.title, alpha: 1, y: 70, duration: 600, ease: "Cubic.easeOut" });
    this.tweens.add({ targets: this.subtitle, alpha: 1, text: "Initiating delivery sequence...", duration: 400 });
    this.time.delayedCall(1500, () => this._step2_OpenGate());
  }

  _step2_OpenGate() {
    this.subtitle.setText("Opening factory gates...");
    this.tweens.add({ targets: this.gateLeft, x: "-=140", duration: 800, ease: "Cubic.easeInOut" });
    this.tweens.add({ targets: this.gateRight, x: "+=140", duration: 800, ease: "Cubic.easeInOut" });
    this.time.delayedCall(1000, () => this._step3_WalkIn());
  }

  _step3_WalkIn() {
    this.subtitle.setText("Delivering fresh milk...");
    // Animate bottle walking into factory
    this.tweens.add({
      targets: this,
      bottleX: GAME_WIDTH / 2,
      duration: 1200,
      ease: "Cubic.easeInOut",
      onUpdate: () => {
        this.bottle.clear();
        this._drawBottle(this.bottleX > GAME_WIDTH / 2 - 20 ? 0 : Math.sin(this.time.now * 0.01) * 0.06);
      },
      onComplete: () => {
        // Hide bottle
        this.tweens.add({ targets: this, bottleY: "-=40", duration: 300, alpha: 0 });
        this.time.delayedCall(400, () => this._step4_FillTank());
      },
    });
  }

  _step4_FillTank() {
    this.subtitle.setText("Filling storage tanks...");
    // Animate milk flowing into tank
    this.tweens.add({
      targets: this,
      tankFillPct: 1,
      duration: 1500,
      ease: "Cubic.easeInOut",
      onUpdate: () => this._drawTankFill(),
      onComplete: () => this.time.delayedCall(300, () => this._step5_Machines()),
    });
  }

  _step5_Machines() {
    this.subtitle.setText("Starting factory machines...");
    // Screen shake for machines starting
    this.cameras.main.shake(300, 0.003);

    // Show packages appearing on conveyor
    this.packages.forEach((pkg, i) => {
      this.time.delayedCall(i * 150, () => {
        this.tweens.add({ targets: pkg, alpha: 1, scaleX: 0.8, scaleY: 0.8, duration: 200 });
        // Slide along conveyor
        this.tweens.add({
          targets: pkg, x: pkg.x + 80, duration: 2000,
          delay: 500 + i * 100, ease: "Linear",
          onComplete: () => this.tweens.add({ targets: pkg, alpha: 0, duration: 200 }),
        });
      });
    });

    this.time.delayedCall(2000, () => this._step6_Trucks());
  }

  _step6_Trucks() {
    this.subtitle.setText("Loading delivery trucks...");
    // Trucks drive in and out
    this.trucks.forEach((truck, i) => {
      truck.setAlpha(1);
      this.tweens.add({
        targets: truck,
        x: GAME_WIDTH + 100,
        duration: 2500,
        delay: i * 800,
        ease: "Cubic.easeIn",
        onComplete: () => truck.setAlpha(0),
      });
    });

    this.time.delayedCall(3500, () => this._step7_Fireworks());
  }

  _step7_Fireworks() {
    this.subtitle.setText("");
    this.title.setText("DELIVERY COMPLETE!");
    this.tweens.add({ targets: this.title, scaleX: 1.1, scaleY: 1.1, duration: 300, yoyo: true });

    // Confetti / fireworks particles
    const colors = [0xFF6B6B, 0xFFD93D, 0x6BCB77, 0x4D96FF, 0xFF922B, 0xFFD700, 0xFF69B4];
    for (let wave = 0; wave < 3; wave++) {
      this.time.delayedCall(wave * 400, () => {
        for (let i = 0; i < 25; i++) {
          const px = Phaser.Math.Between(80, GAME_WIDTH - 80);
          const py = Phaser.Math.Between(40, GAME_HEIGHT - 200);
          const color = Phaser.Utils.Array.GetRandom(colors);
          const size = Phaser.Math.Between(2, 5);

          const particle = this.add.circle(px, py, size, color, 1);
          this.tweens.add({
            targets: particle,
            x: px + Phaser.Math.Between(-80, 80),
            y: py + Phaser.Math.Between(50, 200),
            alpha: 0,
            scale: 0.3,
            angle: Phaser.Math.Between(-180, 180),
            duration: Phaser.Math.Between(1000, 2000),
            ease: "Cubic.easeOut",
            onComplete: () => particle.destroy(),
          });
        }
      });
    }

    this.time.delayedCall(2500, () => this._step8_ShowStats());
  }

  _step8_ShowStats() {
    // Fade out factory elements
    this.tweens.add({
      targets: [this.title, this.subtitle, this.gateLeft, this.gateRight, this.tank],
      alpha: 0, duration: 500,
    });

    // Show stats panel
    this.tweens.add({
      targets: this.statsContainer,
      alpha: 1, y: GAME_HEIGHT / 2 - 40,
      duration: 600, ease: "Cubic.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: this.btnContainer,
          alpha: 1, y: GAME_HEIGHT / 2 + 260,
          duration: 400, ease: "Cubic.easeOut",
        });
      },
    });
  }

  // ═══════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════

  _drawBottle(tilt) {
    const g = this.bottle;
    const x = this.bottleX;
    const y = this.bottleY;

    g.clear();
    g.fillStyle(0xf8fcff, 1);
    g.fillRoundedRect(x - 12, y - 24, 24, 32, 4);
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRoundedRect(x - 7, y - 30, 14, 10, 2);
    g.fillStyle(COLORS.vitaBlue, 0.85);
    g.fillRect(x - 10, y - 6, 20, 10);
    g.setRotation(tilt);
  }

  _drawTankFill() {
    const g = this.tankFill;
    g.clear();
    const bx = this.tank.x - 60;
    const by = this.tank.y + 28;
    const bh = 50;
    const fillH = bh * this.tankFillPct;
    if (fillH > 0) {
      g.fillStyle(0xF0F8FF, 0.8);
      g.fillRect(bx + 18, by - fillH, 84, fillH);
      g.fillStyle(0xFFFFFF, 0.4);
      g.fillRect(bx + 18, by - fillH, 84, 3);
    }
  }

  _addButton(container, x, y, text, color, cb) {
    const w = 220, h = 44;
    const bg = this.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 10);
    bg.fillStyle(0xFFFFFF, 0.1);
    bg.fillRoundedRect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h / 2 - 3, 8);
    container.add(bg);

    const label = this.add.text(x, y, text, {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "18px",
      color: "#FFFFFF",
    }).setOrigin(0.5);
    container.add(label);

    const hit = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    hit.on("pointerover", () => bg.setAlpha(0.8));
    hit.on("pointerout", () => bg.setAlpha(1));
    hit.on("pointerdown", cb);
    container.add(hit);
  }

  _formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }
}
