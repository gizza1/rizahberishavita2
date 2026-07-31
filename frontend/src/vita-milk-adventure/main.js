import Phaser from "phaser";
import "./styles.css";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";
import { CompletionScene } from "./scenes/CompletionScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { SettingsScene } from "./scenes/SettingsScene";

export function createVitaMilkAdventure(parentId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: parentId,
    backgroundColor: "#8ed4ef",
    physics: {
      default: "arcade",
      arcade: { gravity: { y: 1100 }, debug: false },
    },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, MenuScene, LevelSelectScene, GameScene, CompletionScene, SettingsScene],
  });
}
