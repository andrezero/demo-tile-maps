import { View, Wave, TileSet, TileMap, TileRegion } from '@picabia/picabia';

import { PlayerView } from './player';
import { MapBgView } from './map-bg';
import { GridView } from './grid';

class GameView extends View {
  _constructor (game, cache) {
    this._game = game;
    this._cache = cache;
    this._camera = this._vm.getViewport('camera');

    const tileImg = cache.get('./assets/tile-set.png');
    const tileData = cache.get('./assets/tile-set.json');
    const tileSet = new TileSet(tileImg, tileData.size, tileData.tiles, tileData.props);
    this._tileMap = new TileMap(tileSet);

    const regionData = cache.get('./assets/region-1.json');
    const region = TileRegion.fromSets(regionData.pos, regionData.size, regionData.sets);
    this._tileMap.addRegion(region);

    this._createChild(MapBgView, [this._tileMap], '2d', 'camera', 'layer-bg', 0);

    this._game.on('new-player', (player) => {
      this._player = player;
      this._createChild(PlayerView, [player, cache], '2d', 'camera', 'layer-1', 0);

      this._player.on('move', () => {
        this._camera.setPos({ x: this._player._pos.x, y: this._player._pos.y });
        this._camera.setZoom(1 - this._player._speed / 3);
      });
    });

    this._game.on('new-grid', (grid) => {
      this._createChild(GridView, [grid], '2d', 'camera', 'layer-bg', 1);
    });
  }

  _preRender (delta, timestamp) {
    if (!this._wave) {
      this._wave = Wave.sine(timestamp, 0, Math.PI / 30, 5000);
    }

    const oscillatingNumber = this._wave(timestamp);
    this._camera.setScale(oscillatingNumber + 2);
    this._camera.setRotation(oscillatingNumber);
  }
}

export {
  GameView
};
