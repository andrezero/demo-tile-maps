import { View, Geometry } from '@picabia/picabia';

class PlayerView extends View {
  constructor (v, target, player, cache) {
    super(v, target);

    this._player = player;
    this._cache = cache;

    this._player.setPos(0, 0);
  }

  // -- view

  render (renderer) {
    const red = 100;
    const green = 10;
    const blue = 10;
    const alpha = 1;
    const rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    const polygon = this._player._shape
      .map((vector) => ({ x: vector.x + this._player._pos.x, y: vector.y + this._player._pos.y }))
      .map(vector => Geometry.rotateVector(vector, -this._player._facing - Math.PI / 2, this._player._pos));

    renderer.setFillStyle(rgba);
    renderer.beginPath();
    polygon.forEach(vector => renderer.lineTo(vector.x, vector.y));
    renderer.lineTo(polygon[0].x, polygon[0].y);
    renderer.fill();
  }
}

export {
  PlayerView
};
