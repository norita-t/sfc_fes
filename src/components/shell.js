import { renderBottomNav } from './bottomNav.js';

export function renderShell({ routeName, pageClass = '', content }) {
  return `
    <div class="app-shell">
      <header class="app-header">
        <div>
          <p class="app-header__eyebrow">Keio SFC Festival</p>
          <h1 class="app-header__title">SFC Festival Guide</h1>
        </div>
        <span class="app-header__status">デジタル案内</span>
      </header>
      <main class="page ${pageClass}">
        ${content}
      </main>
      ${renderBottomNav(routeName)}
    </div>
  `;
}
