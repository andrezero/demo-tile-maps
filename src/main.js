import { Loader, Cache } from '@picabia/picabia';
import { style } from './styles/style.css'; // eslint-disable-line no-unused-vars
import { Application } from './application';

const init = () => {
  const loaderElement = document.getElementById('loading');
  const parentElement = document.getElementById('app-container');
  const loader = new Loader();

  const resources = [
    { url: './assets/tile-set.png', '@2x': false },
    './assets/tile-set.json',
    './assets/region-1.json'
    // './assets/region-2.json'
  ];

  loader.load(resources)
    .then((resources) => {
      const cache = new Cache();
      resources.forEach(resource => cache.add(resource.url, resource.res));
      const app = new Application(parentElement, cache);
      loaderElement.remove();
      window.addEventListener('resize', () => app.resize());
    });
};

document.addEventListener('DOMContentLoaded', init);
