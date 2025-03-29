import { renderLogin } from './views/login.js';
import { renderAdmin } from './views/admin.js';
import { renderTeam } from './views/team.js';

export function initRouter() {
  window.addEventListener('hashchange', route);
  route();
}

function route() {
  const hash = window.location.hash || '#/login';
  const app = document.getElementById('app');

  if (hash.startsWith('#/admin')) {
    renderAdmin(app);
  } else if (hash.startsWith('#/team/')) {
    const teamName = hash.split('/')[2];
    renderTeam(app, teamName);
  } else {
    renderLogin(app);
  }
}
