import { Model, Emitter } from '@picabia/picabia';

import { PlayerModel } from './player.js';
import { GridModel } from './grid.js';

class GameModel extends Model {
  constructor () {
    super();

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._controls = {
      'move:up': () => this._player.setDirection(0, -1),
      'move:down': () => this._player.setDirection(0, 1),
      'move:left': () => this._player.setDirection(-1, 0),
      'move:right': () => this._player.setDirection(1, 0),
      'move:up+left': () => this._player.setDirection(-1, -1),
      'move:up+right': () => this._player.setDirection(1, -1),
      'move:down+left': () => this._player.setDirection(-1, 1),
      'move:down+right': () => this._player.setDirection(1, 1),
      'move:center': () => this._player.stop(),
      'dash:start': () => this._player.startDash(),
      'dash:stop': () => this._player.stopDash()
    };
  }

  // -- model

  _init () {
    this._player = new PlayerModel();
    this._addChild(this._player);
    this._emitter.emit('new-player', this._player);

    this._grid = new GridModel();
    this._addChild(this._grid);
    this._emitter.emit('new-grid', this._grid);
  }

  _destroy () {
    this._emitter.destroy();
  }

  // -- api

  input (control) {
    const args = [...arguments];
    args.unshift();
    this._controls[control](...args);
  }
}

export {
  GameModel
};
