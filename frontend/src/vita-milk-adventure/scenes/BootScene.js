import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("vita-logo", "/vita.png");
    this.load.image("vita-factory", "/game-assets/vita-factory.png");
    this.load.image("char-whipping-cream", "/products/whipping_cream.webp");
    this.load.image("char-milk-32", "/game-assets/characters/milk-32.webp");
    this.load.image("char-kos", "/game-assets/characters/kos.png");
    this.load.image("char-cooking-cream", "/game-assets/characters/cooking-cream.png");
  }

  create() {
    this._createPlayerTextures();
    this._createPlatformTextures();
    this._createMilkTexture();
    this._createWorldTextures();
    this.scene.start("MenuScene");
  }

  _createPlayerTextures() {
    const createPlayer = (key, bodyColor, capOffset = 0) => {
      const graphic = this.add.graphics();
      graphic.fillStyle(bodyColor, 1);
      graphic.fillRoundedRect(2, 12 + capOffset, 28, 38 - capOffset, 6);
      graphic.fillStyle(0x0753a4, 1);
      graphic.fillRoundedRect(8, 2 + capOffset, 16, 14, 3);
      graphic.fillStyle(0x1b74bf, 1);
      graphic.fillRect(5, 30, 22, 12);
      graphic.fillStyle(0xffffff, 0.9);
      graphic.fillRect(9, 33, 14, 5);
      graphic.generateTexture(key, 32, 52);
      graphic.destroy();
    };
    createPlayer("player-idle", 0xf8fcff);
    createPlayer("player-run", 0xeaf5ff, 2);
    createPlayer("player-jump", 0xffffff, -2);
  }

  _createPlatformTextures() {
    const platforms = {
      "platform-static": [0x4b7f2b, 0x97ca51],
      "platform-floating": [0x8d611e, 0xf0c35a],
      "platform-moving": [0x426f98, 0x8ac6e8],
      "platform-bounce": [0xa54987, 0xff8ed1],
      "platform-hidden": [0x6a5a97, 0xc4b7ff],
      "platform-conveyor": [0x444444, 0xa0a0a0],
    };
    Object.entries(platforms).forEach(([key, [base, top]]) => {
      const graphic = this.add.graphics();
      graphic.fillStyle(base, 1);
      graphic.fillRect(0, 0, 64, 24);
      graphic.fillStyle(top, 1);
      graphic.fillRect(0, 0, 64, 4);
      if (key === "platform-conveyor") {
        graphic.fillStyle(0xd7d7d7, 0.65);
        graphic.fillTriangle(18, 7, 32, 12, 18, 17);
        graphic.fillTriangle(44, 7, 58, 12, 44, 17);
      }
      graphic.generateTexture(key, 64, 24);
      graphic.destroy();
    });
  }

  _createMilkTexture() {
    const graphic = this.add.graphics();
    graphic.fillStyle(0xf8fcff, 1).fillRoundedRect(3, 10, 30, 39, 6);
    graphic.fillStyle(0x0753a4, 1).fillRoundedRect(10, 2, 16, 13, 3);
    graphic.fillStyle(0x1a72bf, 1).fillRoundedRect(5, 24, 26, 18, 4);
    graphic.fillStyle(0xffffff, 0.38).fillRect(7, 14, 5, 28);
    graphic.fillStyle(0xd7e4ef, 1).fillRect(4, 43, 28, 3);
    graphic.generateTexture("milk-bottle", 36, 50);
    graphic.destroy();
  }

  _createWorldTextures() {
    const create = (key, width, height, draw) => {
      const graphic = this.add.graphics();
      draw(graphic);
      graphic.generateTexture(key, width, height);
      graphic.destroy();
    };
    create("farm-spike", 32, 20, (g) => {
      g.fillStyle(0xe74c3c, 1).fillTriangle(16, 0, 1, 20, 31, 20);
      g.fillStyle(0xffa0a0, 0.75).fillTriangle(16, 4, 8, 18, 16, 18);
    });
    create("farm-tree", 70, 112, (g) => {
      g.fillStyle(0x6b4524, 1).fillRect(31, 60, 10, 52);
      g.fillStyle(0x2e7d32, 1).fillCircle(35, 38, 32);
      g.fillStyle(0x58a84f, 1).fillCircle(22, 48, 22).fillCircle(49, 48, 22);
    });
    create("farm-cow", 74, 46, (g) => {
      g.fillStyle(0xf8f4e6, 1).fillRoundedRect(3, 12, 50, 25, 8);
      g.fillStyle(0x5b422b, 1).fillCircle(18, 22, 7).fillCircle(40, 29, 6);
      g.fillStyle(0xf8f4e6, 1).fillRoundedRect(48, 8, 22, 23, 7);
      g.fillStyle(0x222222, 1).fillCircle(61, 16, 2);
      g.fillStyle(0x6b4524, 1).fillRect(10, 34, 5, 12).fillRect(40, 34, 5, 12);
    });
    create("farm-factory", 160, 150, (g) => {
      g.fillStyle(0xf1f4f6, 1).fillRect(8, 48, 144, 102);
      g.fillStyle(0x0a4d9c, 1).fillTriangle(80, 10, 4, 50, 156, 50);
      g.fillStyle(0x0753a4, 1).fillRect(45, 80, 70, 22);
      g.fillStyle(0xffffff, 1).fillRect(58, 86, 44, 8);
      g.fillStyle(0x5b6470, 1).fillRect(122, 20, 20, 38);
      g.fillStyle(0x6b4524, 1).fillRect(62, 110, 36, 40);
      g.fillStyle(0x9fd7ff, 1).fillRect(20, 75, 20, 20).fillRect(120, 75, 20, 20);
    });
  }
}
