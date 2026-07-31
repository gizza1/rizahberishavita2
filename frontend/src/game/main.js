// Vita Milk Rush — Main Entry Point
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { FactorySequence } from "./scenes/FactorySequence";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { SettingsScene } from "./scenes/SettingsScene";
import { CreditsScene } from "./scenes/CreditsScene";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "./config";

/**
 * Creates and returns a Phaser.Game instance mounted to the given container.
 * @param {string} parentId - DOM element ID to mount the canvas into
 * @returns {Phaser.Game}
 */
export function createGame(parentId) {
  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: parentId,
    backgroundColor: `#${COLORS.sky.toString(16).padStart(6, "0")}`,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1200 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene, FactorySequence, LevelSelectScene, SettingsScene, CreditsScene],
    render: {
      pixelArt: false,
      antialias: true,
      roundPixels: false,
    },
  };

  return new Phaser.Game(config);
}
