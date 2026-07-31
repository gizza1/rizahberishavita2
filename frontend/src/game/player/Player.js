// Vita Milk Rush — Advanced Player Controller
// Walk, Run, Jump, Double Jump, Wall Jump, Dash, Slide
// Coyote Time, Jump Buffer, Variable Jump Height
import Phaser from "phaser";
import { COLORS, PHYSICS, DEPTH } from "../config";

// ─── Tunable constants ───
const CFG = {
  walkSpeed: 280,
  runSpeed: 440,
  accel: 1400,           // ground acceleration
  airAccel: 900,         // air acceleration
  decel: 1000,           // ground friction
  airDecel: 400,         // air drag
  jumpVel: -540,         // full jump velocity
  jumpMin: -260,         // minimum jump (early release)
  doubleJumpVel: -480,
  wallJumpX: 380,
  wallJumpY: -500,
  coyoteMs: 100,         // coyote time window
  bufferMs: 120,         // jump buffer window
  dashSpeed: 700,
  dashTime: 180,         // ms
  dashCooldown: 800,
  slideSpeed: 500,
  slideTime: 350,         // max slide duration ms
  slideDecel: 600,
  maxFall: 800,          // terminal velocity
  wallSlideSpeed: 120,   // max wall slide speed
  wallStickMs: 200,      // grace before wall slide starts
};

const PLAYER_SCALE = 0.9;

export class Player extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);

    // ─── State ───
    this.milkCollected = 0;
    this.alive = true;
    this.facing = 1;             // 1 = right, -1 = left

    // Ground / air state
    this.grounded = false;
    this.walledLeft = false;
    this.walledRight = false;
    this.coyoteTimer = 0;        // ms remaining
    this.jumpBufferTimer = 0;    // ms remaining
    this.jumpsUsed = 0;
    this.maxJumps = 2;           // 1 ground + 1 air = double jump

    // Wall state
    this.wallSliding = false;
    this.wallStickTimer = 0;
    this.wallJumpCooldown = 0;
    this.lastWallDir = 0;

    // Dash
    this.dashing = false;
    this.dashCooldownTimer = 0;
    this.dashDir = 0;

    // Slide
    this.sliding = false;
    this.slideTimer = 0;
    this.runHeld = false;

    // Jump
    this.jumpHeld = false;
    this.jumpCut = false;

    // Collision invincibility
    this.invincible = false;
    this.invincibleTimer = 0;
    this.runCycle = 0;
    this.squash = 1;
    this.stretch = 1;
    this.trailPieces = [];

    // ─── Bottle visual ───
    this.sprite = scene.add.graphics();
    this.add(this.sprite);
    this._drawBottle();
    this.logo = scene.add.image(0, 2, "vita_logo").setDisplaySize(18, 16);
    this.add(this.logo);

    // ─── Physics ───
    scene.physics.world.enable(this);
    /** @type {Phaser.Physics.Arcade.Body} */
    this.body.setSize(24 * PLAYER_SCALE, 56 * PLAYER_SCALE);
    this.body.setOffset(-12 * PLAYER_SCALE, -29 * PLAYER_SCALE);
    this.body.setCollideWorldBounds(false);
    this.body.setMaxVelocityY(CFG.maxFall);
    this.body.setDrag(0, 0);
    this.setScale(PLAYER_SCALE);
    this.setDepth(DEPTH.player);

    // ─── Particle pools ───
    this._particles = {
      dust: [],
      spark: [],
    };
  }

  // ═══════════════════════════════════════════
  //  MAIN UPDATE
  // ═══════════════════════════════════════════

  /**
   * @param {object} input — { left, right, up, down, dash, slide }
   * @param {number} dt — delta in ms
   */
  update(input, dt) {
    if (!this.alive) return;
    const body = this.body;

    // ── Timers ──
    const step = Math.min(dt, 33); // cap at ~30fps for physics stability
    this.coyoteTimer = Math.max(0, this.coyoteTimer - step);
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - step);
    this.dashCooldownTimer = Math.max(0, this.dashCooldownTimer - step);
    this.wallStickTimer = Math.max(0, this.wallStickTimer - step);
    this.wallJumpCooldown = Math.max(0, this.wallJumpCooldown - step);
    if (this.sliding) this.slideTimer = Math.max(0, this.slideTimer - step);
    this.animTimer += step;

    // Invincibility countdown
    if (this.invincible) {
      this.invincibleTimer -= step;
      if (this.invincibleTimer <= 0) this.invincible = false;
      // Flash effect
      this.setAlpha(Math.floor(this.invincibleTimer / 60) % 2 === 0 ? 0.4 : 1);
    }

    // ── Ground check ──
    const wasGrounded = this.grounded;
    this.grounded = body.blocked.down || body.touching.down;

    // ── Wall checks ──
    this.walledLeft = body.blocked.left || body.touching.left;
    this.walledRight = body.blocked.right || body.touching.right;

    // Coyote time
    if (this.grounded) {
      this.coyoteTimer = CFG.coyoteMs;
      this.jumpsUsed = 0;
      this.wallSliding = false;
    } else if (wasGrounded) {
      // just left ground — coyote starts ticking
    }

    // Jump buffer
    if (this.grounded) {
      if (this.jumpBufferTimer > 0) {
        this._doJump();
        this.jumpBufferTimer = 0;
      }
    }

    // ── Dash ──
    if (this.dashing) {
      body.setVelocityX(this.dashDir * CFG.dashSpeed);
      body.setVelocityY(0);
      body.setAllowGravity(false);
      body.setDrag(0);
      // Dash ends via timer in _startDash
      this._spawnDashParticles();
      this._animateSquash(0.7, 1.4);
      this._updateTrails();
      return;
    }

    body.setAllowGravity(true);

    // ── Wall slide ──
    const againstWall = (this.walledLeft || this.walledRight) && !this.grounded;
    if (againstWall && this.wallJumpCooldown <= 0) {
      if (this.wallStickTimer <= 0) {
        this.wallSliding = true;
        if (body.velocity.y > CFG.wallSlideSpeed) {
          body.setVelocityY(CFG.wallSlideSpeed);
        }
        this.lastWallDir = this.walledLeft ? -1 : 1;
      }
    } else {
      this.wallSliding = false;
    }
    if (!againstWall) {
      this.wallStickTimer = Math.max(0, this.wallStickTimer - step);
    }

    // ── Slide ──
    if (this.sliding && this.grounded) {
      if (this.slideTimer <= 0) {
        this.sliding = false;
        this._resetHitbox();
      } else {
        body.setVelocityX(this.facing * CFG.slideSpeed);
        body.setDrag(CFG.slideDecel);
        this._setHitboxSlide();
        this._animateSquash(0.65, 1.35);
        this._spawnSlideDust();
        this._updateTrails();
        return;
      }
    }

    this._resetHitbox();

    // ── Horizontal movement ──
    const speed = this.runHeld ? CFG.runSpeed : CFG.walkSpeed;
    const accel = this.grounded ? CFG.accel : CFG.airAccel;
    const decel = this.grounded ? CFG.decel : CFG.airDecel;

    if (input.left && !input.right) {
      this.facing = -1;
      const target = -speed;
      const diff = target - body.velocity.x;
      body.setAccelerationX(Phaser.Math.Clamp(diff * (accel / speed), -accel, accel));
    } else if (input.right && !input.left) {
      this.facing = 1;
      const target = speed;
      const diff = target - body.velocity.x;
      body.setAccelerationX(Phaser.Math.Clamp(diff * (accel / speed), -accel, accel));
    } else {
      body.setAccelerationX(0);
      if (this.grounded) {
        body.setDragX(decel);
      } else {
        body.setDragX(decel * 0.4);
      }
    }

    // ── Jump handling ──
    const jumpPressed = input.jumpPressed;
    const jumpDown = input.up || input.jump;

    if (jumpPressed) {
      // Try to jump
      if (this.coyoteTimer > 0 && this.jumpsUsed < this.maxJumps) {
        this._doJump();
        this.coyoteTimer = 0;
      } else if (this.wallSliding && this.wallJumpCooldown <= 0) {
        this._doWallJump();
      } else if (this.jumpsUsed < this.maxJumps && this.jumpsUsed >= 1) {
        // Double jump (in air, not wall sliding)
        this._doDoubleJump();
      } else {
        // Buffer the jump for when we land
        this.jumpBufferTimer = CFG.bufferMs;
      }
    }

    // Variable jump height — cut jump short if released early
    if (!jumpDown && this.jumpHeld && body.velocity.y < CFG.jumpMin) {
      body.setVelocityY(CFG.jumpMin);
      this.jumpHeld = false;
    }
    if (!jumpDown) {
      this.jumpHeld = false;
    }

    // ── Visuals ──
    this._animateRun(body.velocity.x, this.grounded);
    this._animateAir(body.velocity.y, this.grounded);
    this._smoothSquashStretch(step);
    this.setScale(this.facing * PLAYER_SCALE, PLAYER_SCALE);
    this._updateTrails();
  }

  // ═══════════════════════════════════════════
  //  JUMP ACTIONS
  // ═══════════════════════════════════════════

  _doJump() {
    this.body.setVelocityY(CFG.jumpVel);
    this.jumpsUsed = 1;
    this.jumpHeld = true;
    this.jumpCut = false;
    this.grounded = false;
    this.coyoteTimer = 0;
    this._animateSquash(0.7, 1.4);
    this._spawnJumpParticles();
  }

  _doDoubleJump() {
    this.body.setVelocityY(CFG.doubleJumpVel);
    this.jumpsUsed = 2;
    this.jumpHeld = true;
    this.jumpCut = false;
    this.wallSliding = false;
    this._animateSquash(0.75, 1.3);
    this._spawnJumpParticles();
  }

  _doWallJump() {
    const dir = this.walledLeft ? 1 : -1;
    this.body.setVelocity(dir * CFG.wallJumpX, CFG.wallJumpY);
    this.facing = dir;
    this.jumpsUsed = 1;
    this.jumpHeld = true;
    this.wallSliding = false;
    this.wallStickTimer = CFG.wallStickMs;
    this.wallJumpCooldown = 200;
    this._animateSquash(0.7, 1.4);
    this._spawnJumpParticles();
  }

  // ═══════════════════════════════════════════
  //  SPECIAL ACTIONS
  // ═══════════════════════════════════════════

  dash() {
    if (this.dashing || this.dashCooldownTimer > 0 || !this.alive) return;
    this.dashing = true;
    this.dashDir = this.facing;
    this.dashCooldownTimer = CFG.dashCooldown;
    this.body.setVelocity(0, 0);
    this.body.setAllowGravity(false);

    this.scene.time.delayedCall(CFG.dashTime, () => {
      this.dashing = false;
      this.body.setAllowGravity(true);
      this.body.setVelocity(this.dashDir * CFG.walkSpeed, 0);
    });
  }

  slide() {
    if (!this.grounded || this.sliding || this.dashing || !this.alive) return;
    if (Math.abs(this.body.velocity.x) < 50) return;
    this.sliding = true;
    this.slideTimer = CFG.slideTime;
    this.facing = this.body.velocity.x > 0 ? 1 : -1;
    this._setHitboxSlide();
  }

  // ═══════════════════════════════════════════
  //  VISUALS
  // ═══════════════════════════════════════════

  _drawBottle() {
    const g = this.sprite;
    g.clear();

    const sq = this.squash;
    const st = this.stretch;

    // Shadow
    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, -4 + (1 - sq) * 10, 28, 8);

    // Bottle body
    g.fillStyle(0xf8fcff, 0.95);
    g.fillRoundedRect(-14.5 * st, (-20.5 * sq) - (1 - sq) * 4, 28.5 * st, 42.5 * sq, 6);

    // Highlight
    g.fillStyle(0xffffff, 0.4);
    g.fillRect(-8.5 * st, (-18.5 * sq) - (1 - sq) * 3, 5 * st, 30.5 * sq);

    // Neck
    g.fillStyle(0xf0f4f8, 0.95);
    g.fillRect(-6.5 * st, (-28.5 * sq) - (1 - sq) * 6, 12.5 * st, 14.5 * sq);

    // Cap
    g.fillStyle(COLORS.vitaBlue, 1);
    g.fillRoundedRect(-8.5 * st, (-32.5 * sq) - (1 - sq) * 7, 16.5 * st, 10.5 * sq, 3);

    // VITA label
    g.fillStyle(COLORS.vitaBlue, 0.85);
    g.fillRect(-11.5 * st, (-6.5 * sq) + (1 - sq) * 2, 22.5 * st, 16.5 * sq);
  }

  _animateSquash(sq, st) {
    this.squash = sq;
    this.stretch = st;
    this.scene.time.delayedCall(120, () => {
      this.squash = Phaser.Math.Linear(this.squash, 1, 0.3);
      this.stretch = Phaser.Math.Linear(this.stretch, 1, 0.3);
    });
    this._drawBottle();
  }

  _smoothSquashStretch(dt) {
    const speed = dt * 0.006;
    this.squash = Phaser.Math.Linear(this.squash, 1, speed);
    this.stretch = Phaser.Math.Linear(this.stretch, 1, speed);
    this._drawBottle();
  }

  _animateRun(vx, grounded) {
    if (grounded && Math.abs(vx) > 30) {
      this.runCycle += this.scene.game.loop.delta * 0.012;
      const wobble = Math.sin(this.runCycle) * 0.06;
      this.setRotation(wobble);
      // Dust particles
      if (Math.random() < 0.35) {
        this._spawnDust(-2, 24);
        this._spawnDust(2, 24);
      }
    } else if (grounded) {
      this.setRotation(0);
    }
  }

  _animateAir(vy, grounded) {
    if (!grounded && !this.dashing && !this.wallSliding) {
      const tilt = Phaser.Math.Clamp(vy * 0.0008, -0.3, 0.3);
      this.setRotation(Phaser.Math.Linear(this.rotation, tilt, 0.12));
    }
  }

  // ═══════════════════════════════════════════
  //  PARTICLES
  // ═══════════════════════════════════════════

  _spawnDust(ox, oy) {
    const p = this.scene.add.circle(this.x + ox, this.y + oy, Phaser.Math.Between(1, 3), 0xDDCCAA, 0.6)
      .setDepth(DEPTH.player - 1);
    this.scene.tweens.add({
      targets: p,
      x: p.x + Phaser.Math.Between(-12, 12),
      y: p.y - Phaser.Math.Between(4, 12),
      alpha: 0,
      scale: 0.2,
      duration: Phaser.Math.Between(200, 400),
      onComplete: () => p.destroy(),
    });
  }

  _spawnSlideDust() {
    for (let i = 0; i < 2; i++) {
      this._spawnDust(Phaser.Math.Between(-8, 8), 24);
    }
  }

  _spawnJumpParticles() {
    for (let i = 0; i < 8; i++) {
      const px = this.x + Phaser.Math.Between(-10, 10);
      const py = this.y + Phaser.Math.Between(20, 28);
      const c = this.scene.add.circle(px, py, Phaser.Math.Between(1, 3), 0xCCDDFF, 0.7)
        .setDepth(DEPTH.player - 1);
      this.scene.tweens.add({
        targets: c,
        x: px + Phaser.Math.Between(-20, 20),
        y: py - Phaser.Math.Between(10, 40),
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(300, 500),
        onComplete: () => c.destroy(),
      });
    }
  }

  _spawnDashParticles() {
    // Trail streaks behind player
    for (let i = 0; i < 3; i++) {
      const ox = this.x - this.facing * Phaser.Math.Between(15, 30);
      const oy = this.y + Phaser.Math.Between(-20, 10);
      const p = this.scene.add.rectangle(ox, oy, Phaser.Math.Between(6, 14), Phaser.Math.Between(2, 4), COLORS.vitaBlue, 0.7)
        .setDepth(DEPTH.player - 1);
      this.scene.tweens.add({
        targets: p,
        x: ox - this.facing * Phaser.Math.Between(30, 60),
        alpha: 0,
        scaleX: 2,
        duration: Phaser.Math.Between(200, 400),
        onComplete: () => p.destroy(),
      });
    }
    // Sparkle ring
    if (Math.random() < 0.4) {
      const s = this.scene.add.circle(this.x, this.y, 4, 0xFFFFFF, 0.6).setDepth(DEPTH.player + 1);
      this.scene.tweens.add({
        targets: s,
        scale: 4,
        alpha: 0,
        duration: 250,
        onComplete: () => s.destroy(),
      });
    }
  }

  _updateTrails() {
    // Decay existing trail pieces
    for (let i = this.trailPieces.length - 1; i >= 0; i--) {
      const t = this.trailPieces[i];
      t.alpha -= 0.04;
      if (t.alpha <= 0) {
        t.destroy();
        this.trailPieces.splice(i, 1);
      }
    }
  }

  // ═══════════════════════════════════════════
  //  LANDING (called externally)
  // ═══════════════════════════════════════════

  onLand() {
    if (!this.alive) return;
    this.jumpsUsed = 0;
    this.jumpHeld = false;
    this.sliding = false;
    this._resetHitbox();
    this._animateSquash(0.75, 1.25);

    // Landing dust burst
    const speed = Math.abs(this.body.velocity.y);
    const count = Math.min(Math.floor(speed / 50), 12);
    for (let i = 0; i < count; i++) {
      const ox = this.x + Phaser.Math.Between(-14, 14);
      const oy = this.y + 28;
      const c = this.scene.add.circle(ox, oy, Phaser.Math.Between(1, 4), 0xCCBB99, 0.7)
        .setDepth(DEPTH.player - 1);
      this.scene.tweens.add({
        targets: c,
        x: ox + Phaser.Math.Between(-20, 20),
        y: oy - Phaser.Math.Between(5, 25),
        alpha: 0,
        scale: 0.3,
        duration: Phaser.Math.Between(250, 500),
        onComplete: () => c.destroy(),
      });
    }
  }

  // ═══════════════════════════════════════════
  //  COLLISION CALLBACKS
  // ═══════════════════════════════════════════

  collectMilk(amount) {
    this.milkCollected += amount;
    this.scene.tweens.add({
      targets: this,
      scaleX: this.facing * PLAYER_SCALE * 1.3,
      scaleY: PLAYER_SCALE * 1.3,
      duration: 100,
      yoyo: true,
    });
    return this.milkCollected;
  }

  die() {
    if (!this.alive || this.invincible) return;
    this.alive = false;
    this.dashing = false;
    this.sliding = false;
    this.body.setVelocity(0, -350);
    this.body.setAllowGravity(true);
    this.body.setAcceleration(0);
    this.setRotation(Math.PI * 0.7);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      delay: 500,
      duration: 400,
      onComplete: () => this.scene.events.emit("player-died"),
    });
  }

  // ═══════════════════════════════════════════
  //  HITBOX
  // ═══════════════════════════════════════════

  _setHitboxSlide() {
    this.body.setSize(32 * PLAYER_SCALE, 32 * PLAYER_SCALE);
    this.body.setOffset(-16 * PLAYER_SCALE, -10 * PLAYER_SCALE);
  }

  _resetHitbox() {
    if (!this.sliding) {
      this.body.setSize(24 * PLAYER_SCALE, 56 * PLAYER_SCALE);
      this.body.setOffset(-12 * PLAYER_SCALE, -29 * PLAYER_SCALE);
    }
  }
}
