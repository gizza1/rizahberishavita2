import Phaser from "phaser";

const TUNING = {
  maxSpeed: 290,
  acceleration: 2200,
  deceleration: 1900,
  airAcceleration: 1450,
  jumpVelocity: -510,
  doubleJumpVelocity: -470,
  coyoteTime: 110,
  jumpBufferTime: 120,
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player-idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(26, 46).setOffset(3, 4);
    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(TUNING.maxSpeed, 900);
    this.body.setDragX(TUNING.deceleration);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys("A,D,W,SPACE");
    this.jumpsUsed = 0;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.wasGrounded = false;
    this.animationState = "idle";
    this.hurtUntil = 0;
  }

  update(time, delta) {
    const body = this.body;
    const dt = Math.min(delta, 33);
    const grounded = body.blocked.down || body.touching.down;
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
      || Phaser.Input.Keyboard.JustDown(this.keys.W)
      || Phaser.Input.Keyboard.JustDown(this.keys.SPACE);

    if (grounded) {
      this.jumpsUsed = 0;
      this.coyoteTimer = TUNING.coyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    if (jumpPressed) this.jumpBufferTimer = TUNING.jumpBufferTime;

    const direction = Number(right) - Number(left);
    if (direction !== 0) {
      body.setAccelerationX(direction * (grounded ? TUNING.acceleration : TUNING.airAcceleration));
      this.setFlipX(direction < 0);
    } else {
      body.setAccelerationX(0);
      body.setDragX(grounded ? TUNING.deceleration : TUNING.deceleration * 0.28);
    }

    if (this.jumpBufferTimer > 0) {
      if (grounded || this.coyoteTimer > 0) {
        this._jump(TUNING.jumpVelocity);
      } else if (this.jumpsUsed === 1) {
        this._jump(TUNING.doubleJumpVelocity);
      }
    }

    // A short hop is possible by releasing the jump key early.
    const jumpHeld = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown;
    if (!jumpHeld && body.velocity.y < -220) body.setVelocityY(-220);

    this._animate(time, grounded, direction);
    this.wasGrounded = grounded;
  }

  bounce() {
    this.body.setVelocityY(-620);
    this.jumpsUsed = 1;
    this.jumpBufferTimer = 0;
  }

  takeHit() {
    if (this.scene.time.now < this.hurtUntil) return false;
    this.hurtUntil = this.scene.time.now + 1200;
    this.setTint(0xff7777);
    this.body.setVelocity(this.flipX ? 230 : -230, -300);
    this.scene.time.delayedCall(1200, () => this.clearTint());
    return true;
  }

  _jump(velocity) {
    this.body.setVelocityY(velocity);
    this.jumpsUsed += 1;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
  }

  _animate(time, grounded, direction) {
    let nextState = "idle";
    if (!grounded) nextState = "jump";
    else if (Math.abs(this.body.velocity.x) > 35 || direction !== 0) nextState = "run";

    if (nextState !== this.animationState) {
      this.animationState = nextState;
      this.setTexture(`player-${nextState}`);
    }

    if (nextState === "run") {
      const stride = Math.sin(time * 0.018);
      this.setScale(1 + Math.abs(stride) * 0.05, 1 - Math.abs(stride) * 0.05);
      this.setAngle(stride * 3);
    } else if (nextState === "jump") {
      this.setScale(0.94, 1.06);
      this.setAngle(Phaser.Math.Clamp(this.body.velocity.y * 0.012, -8, 8));
    } else {
      const bob = Math.sin(time * 0.005) * 0.018;
      this.setScale(1 + bob, 1 - bob);
      this.setAngle(0);
    }
  }
}
