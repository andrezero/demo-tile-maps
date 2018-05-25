import { View, Wave, TileSet, TileMap, TileRegion } from '@picabia/picabia';

import { PlayerView } from './player';
import { MapBgView } from './map-bg';
import { GridView } from './grid';

class GameView extends View {
  constructor (v, target, game, cache) {
    super(v, target);

    this._game = game;
    this._cache = cache;

    this._viewport = this._v.get('viewport:camera');

    const tileImg = cache.get('./assets/tile-set.png');
    const tileData = cache.get('./assets/tile-set.json');
    const tileSet = new TileSet(tileImg, tileData.size, tileData.tiles, tileData.props);
    this._tileMap = new TileMap(tileSet);

    const regionData = cache.get('./assets/region-1.json');
    const region = TileRegion.fromSets(regionData.pos, regionData.size, regionData.sets);
    this._tileMap.addRegion(region);

    this._createChild(MapBgView, { layer: 'bg', zIndex: 0 }, this._tileMap);

    this._game.on('new-player', (player) => {
      this._player = player;
      this._createChild(PlayerView, { viewport: 'camera', layer: 'stage' }, player, cache);

      this._player.on('move', () => {
        this._viewport.setPos({ x: this._player._pos.x, y: this._player._pos.y });
        this._viewport.setZoom(1 - this._player._speed / 3);
      });
    });

    this._game.on('new-grid', (grid) => {
      this._createChild(GridView, { layer: 'bg', zIndex: 1 }, grid);
    });
  }

  _preUpdate () {
    if (!this._wave) {
      this._wave = Wave.sine(this._time.t, 0, Math.PI / 30, 5000);
    }

    const oscillatingNumber = this._wave(this._time);
    this._viewport.setScale(oscillatingNumber + 2);
    this._viewport.setRotation(oscillatingNumber);
  }
}

export {
  GameView
};
