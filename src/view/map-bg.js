import { View, TileMapPreRenderer } from '@picabia/picabia';

class MapBgView extends View {
  _constructor (tileMap) {
    this._tileMap = tileMap;
    this._mapPreRender = new TileMapPreRenderer(this._tileMap);

    this._viewport.on('change', this._viewportChange, this);
    this._viewportChange();
  }

  _viewportChange () {
    this._mapPreRender.resize(this._viewport.pos, this._viewport.getShape());
  }

  // -- view

  setViewport (viewport) {
    super.setViewport(viewport);
    if (this._viewport) {
      this._viewport.off('change', this._viewportChange);
    }
    this._viewport.on('change', this._viewportChange, this);
    this._viewportChange();
  }

  _preRender (delta, timestamp) {
    this._mapPreRender.render();
  }

  _render (delta, timestamp) {
    const renderer = this._renderer;

    const source = this._mapPreRender.source;
    const offset = this._mapPreRender.offset;
    const pos = this._mapPreRender.pos;
    const size = this._mapPreRender.size;
    renderer.drawImage(source, offset.x, offset.y, size.w, size.h, pos.x - size.w / 2, pos.y - size.h / 2, size.w, size.h);
  }
}

export {
  MapBgView
};
