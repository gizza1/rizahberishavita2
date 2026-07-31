export class AudioHooks {
  constructor(scene) {
    this.scene = scene;
    this.enabled = this._enabled();
    scene.events.on("sound:jump", () => this.play("jump"));
    scene.events.on("sound:collect-milk", () => this.play("collect"));
    scene.events.on("sound:complete", () => this.play("complete"));
  }

  startMusic() { if (this.enabled) this.scene.events.emit("audio:background-music-placeholder"); }
  play(name) { if (this.enabled) this.scene.events.emit(`audio:${name}-placeholder`); }

  _enabled() {
    try { return (JSON.parse(localStorage.getItem("vita-milk-adventure-settings")) || { audio: true }).audio; }
    catch { return true; }
  }
}
