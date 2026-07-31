import Phaser from "phaser";

const TUNING = {
  maxSpeed: 290,
  acceleration: 2200,
  deceleration: 1900,
  airAcceleration: 1450,
  jumpVelocity: -516,
  spaceJumpVelocity: -730,
  doubleJumpVelocity: -470,
  coyoteTime: 110,
  jumpBufferTime: 120,
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, characterKey) {
    super(scene, x, y, "player-idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.characterKey = characterKey;
    this.body.setSize(26, 46).setOffset(3, 4);
    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(TUNING.maxSpeed, 900);
    this.body.setDragX(TUNING.deceleration);
    this.setDepth(30);
    // Product art is separate from physics, which keeps every package consistently
    // aligned with platforms despite their different source-image proportions.
    if (this.characterKey) {
      this.setAlpha(0);
      this.characterVisual = scene.add.image(x, y + 4, this.characterKey)
        .setOrigin(0.5, 1)
        .setDisplaySize(32, 52)
        .setDepth(31);
    }
    this.logo = this.characterKey ? null : scene.add.image(x, y + 8, "vita-logo").setDisplaySize(21, 19).setDepth(31);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys("A,D,W,SPACE");
    this.jumpsUsed = 0;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.wasGrounded = false;
    this.animationState = "idle";
    this.hurtUntil = 0;
    this.touchInput = { left: false, right: false, jump: false };
    this.lastSpaceJumpAt = -Infinity;
    this.queuedJumpVelocity = TUNING.jumpVelocity;
  }

  update(time, delta) {
    const body = this.body;
    const dt = Math.min(delta, 33);
    const grounded = body.blocked.down || body.touching.down;
    const left = this.cursors.left.isDown || this.keys.A.isDown || this.touchInput.left;
    const right = this.cursors.right.isDown || this.keys.D.isDown || this.touchInput.right;
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    const normalJumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
      || Phaser.Input.Keyboard.JustDown(this.keys.W)
      || (this.touchInput.jump && !this.jumpWasTouched);
    const jumpPressed = normalJumpPressed || spacePressed;
    this.jumpWasTouched = this.touchInput.jump;

    if (grounded) {
      this.jumpsUsed = 0;
      this.coyoteTimer = TUNING.coyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    if (jumpPressed) {
      this.jumpBufferTimer = TUNING.jumpBufferTime;
      this.queuedJumpVelocity = spacePressed ? TUNING.spaceJumpVelocity : TUNING.jumpVelocity;
    }
    if (spacePressed && time - this.lastSpaceJumpAt < 300 && this.jumpsUsed === 1 && !grounded) {
      this._jump(TUNING.doubleJumpVelocity);
    }
    if (spacePressed) this.lastSpaceJumpAt = time;

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
        this._jump(this.queuedJumpVelocity);
      } else if (this.jumpsUsed === 1) {
        this._jump(TUNING.doubleJumpVelocity);
      }
    }

    // A short hop is possible by releasing the jump key early.
    const jumpHeld = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown || this.touchInput.jump;
    if (!jumpHeld && body.velocity.y < -220) body.setVelocityY(-220);

    this._animate(time, grounded, direction);
    if (this.logo) this.logo.setPosition(this.x, this.y + 8).setAlpha(this.alpha);
    if (this.characterVisual) {
      this.characterVisual.setPosition(this.x, this.y + 4).setFlipX(this.flipX).setAlpha(this.alpha);
    }
    this.wasGrounded = grounded;
  }

  bounce() {
    this.body.setVelocityY(-620);
    this.jumpsUsed = 1;
    this.jumpBufferTimer = 0;
  }

  setTouchInput(input) { this.touchInput = input; }

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
    this.scene.events.emit("sound:jump");
  }

  _animate(time, grounded, direction) {
    let nextState = "idle";
    if (!grounded) nextState = "jump";
    else if (Math.abs(this.body.velocity.x) > 35 || direction !== 0) nextState = "run";

    if (nextState !== this.animationState) {
      this.animationState = nextState;
      if (!this.characterKey) this.setTexture(`player-${nextState}`);
    }

    if (!this.characterKey) this.setScale(1);
    this.setAngle(0);
  }
}
