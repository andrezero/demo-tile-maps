import { Model, Emitter, Time, Geometry } from '@picabia/picabia';

const MOVE_INCREMENT = 0.001;
const STOP_INCREMENT = 0.002;
const DASH_INCREMENT = 0.003;
const SLOW_INCREMENT = 0.001;
const MAX_MOVE_SPEED = 0.5;
const MAX_DASH_SPEED = 0.5;

class PlayerModel extends Model {
  constructor () {
    super();
    this._pos = { x: 100, y: 100 };
    this._dir = 0;
    this._facing = 0;
    this._speed = 0;

    this._shape = [{ x: -50, y: -50 }, { x: 0, y: -75 }, { x: 50, y: -50 }, { x: 50, y: 50 }, { x: -50, y: 50 }];

    this._moveSpeed = 0;
    this._dashSpeed = 0;

    this._moving = false;
    this._stopping = false;
    this._dashing = false;
    this._slowing = false;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  // -- model

  _init (timestamp) {
    this._log = Time.throttleAF(() => {
      console.log('player view render', this._pos);
    }, 5000);
  }

  _update (delta, timestamp) {
    const dir = Geometry.radiansToVector(this._dir);

    // if (!this._generateN) {
    //   this._generateN = Time.waveCosine(timestamp, 1, 0.2, 5000);
    // }
    // const n = this._generateN(timestamp);
    // this._shape = [{ x: -50 * n, y: -50 * n }, { x: 50 * n, y: -50 * n }, { x: 50 * n, y: 50 * n }, { x: -50 * n, y: 50 * n }];

    if (this._moving) {
      this._moveSpeed += delta * MOVE_INCREMENT;
      if (this._moveSpeed >= MAX_MOVE_SPEED) {
        this._moveSpeed = MAX_MOVE_SPEED;
        this._moving = false;
      }
    }

    if (this._dashing && this._moveSpeed >= MAX_MOVE_SPEED) {
      this._dashSpeed += delta * DASH_INCREMENT;
      if (this._dashSpeed >= MAX_DASH_SPEED) {
        this._dashSpeed = MAX_DASH_SPEED;
        this._dashing = false;
      }
    }

    if (this._stopping) {
      this._moveSpeed -= delta * STOP_INCREMENT;
      if (this._moveSpeed <= 0) {
        this._moveSpeed = 0;
        if (this._dashSpeed <= 0) {
          this._stopping = false;
        }
      }
    }

    if (this._slowing || this._stopping) {
      this._dashSpeed -= delta * SLOW_INCREMENT;
      if (this._dashSpeed <= 0) {
        this._dashSpeed = 0;
        this._slowing = false;
      }
    }

    this._speed = this._moveSpeed + this._dashSpeed;

    if (this._speed && dir.x) {
      this._pos.x += dir.x * this._speed * delta;
    }
    if (this._speed && dir.y) {
      this._pos.y += dir.y * this._speed * delta;
    }

    if (this._speed && (dir.x || dir.y)) {
      this._emitter.emit('move', this);
    }

    if (this._speed && this._facing !== this._dir) {
      let diff = this._dir - this._facing;
      if (Math.abs(diff) > Math.PI) {
        this._facing += Math.sign(diff) * Math.PI * 2;
        diff = this._dir - this._facing;
      }
      if (Math.abs(diff) < 0.2) {
        this._facing = this._dir;
      } else {
        this._facing += (diff) * 0.1;
      }
    }

    this._log(delta, timestamp, this._facing);
  }

  _destroy () {
    this._emitter.destroy();
  }

  // -- api

  setPos (x, y) {
    this._pos = {
      x,
      y
    };
  }

  setDirection (x, y) {
    this._moving = null;
    if (x || y) {
      this._moving = true;
      this._stopping = null;
    }
    const oldDir = this._dir;
    this._dir = Math.atan2(y, x);

    const diff = Geometry.radiansDelta(this._dir, oldDir);

    if (Math.abs(diff) > Math.PI / 2) {
      this._moveSpeed = 0;
    }
  }

  stop () {
    this._moving = false;
    this._stopping = true;
  }

  startDash () {
    this._dashing = true;
    this._slowing = false;
  }

  stopDash () {
    this._dashing = false;
    this._slowing = true;
  }
}

export {
  PlayerModel
};
