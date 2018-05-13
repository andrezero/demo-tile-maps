import { Container, Frame, ViewManager, Viewport, CanvasLayer2d, CanvasRenderer2d, KeyboardInput } from '@picabia/picabia';

import { GameModel } from './model/game';
import { GameView } from './view/game';

class Application {
  constructor (dom, cache) {
    this._dom = dom;
    this._cache = cache;

    // -- model

    this._game = new GameModel();

    // -- view

    const containerOptions = {
      mode: 'cover',
      ratio: 4 / 3,
      maxPixels: 1500 * 1500
    };
    this._container = new Container('main', this._dom, containerOptions);

    this._vm = new ViewManager();
    this._vm.addContainer(this._container);

    const viewportOptions = {
      pos: { x: 0, y: 0 }
    };
    this._viewport = new Viewport('camera', viewportOptions);
    this._vm.addViewport(this._viewport);

    this._container.on('resize', (size) => {
      this._viewport.setSize(size);
      if (this._container._ratio < 1) {
        this._viewport.setScale(size.h / 1000);
      } else {
        this._viewport.setScale(size.w / 1000);
      }
    });

    this._vm.addRenderer(new CanvasRenderer2d('2d'));
    this._vm.addLayer('main', new CanvasLayer2d('layer-bg', { zIndex: -1 }));
    this._vm.addLayer('main', new CanvasLayer2d('layer-1', { zIndex: 1 }));

    // -- input

    this._keyboard = new KeyboardInput();
    this._keyboard.addGroup('move', {
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
      'a+w': 'up+left',
      'd+w': 'up+right',
      'a+s': 'down+left',
      'd+s': 'down+right'
    }, 'center');
    this._keyboard.addGroup('dash', {
      'shift': 'start'
    }, 'stop');

    this._keyboard.on('control', (control) => this._game.input(control));

    const rootView = new GameView(this._vm, [this._game, this._cache]);

    // -- start

    this.resize();

    const frameOptions = {
      freeze: true,
      maxDelta: 20,
      interval: false,
      intervalMs: 1000 / 50
    };
    this._frame = new Frame(frameOptions);
    this._frame.on('update', (delta, timestamp) => this._game.update(delta, timestamp));
    this._frame.on('render', (delta, timestamp) => this._vm.render(rootView, delta, timestamp));
    this._frame.start();
  }

  resize () {
    this._container.resize();
  }
}

export {
  Application
};
