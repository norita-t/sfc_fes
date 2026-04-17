const items = [
  { route: '/', label: 'ホーム', match: ['home'] },
  { route: '/events', label: 'イベント', match: ['events', 'event-detail'] },
  { route: '/map', label: 'マップ', match: ['map'] },
  { route: '/timetable', label: 'タイムテーブル', match: ['timetable'] },
  { route: '/favorites', label: 'お気に入り', match: ['favorites'] },
];

export function renderBottomNav(activeRouteName) {
  return `
    <nav class="bottom-nav" aria-label="主要ナビゲーション">
      ${items
        .map(
          (item) => `
            <button
              class="bottom-nav__item ${item.match.includes(activeRouteName) ? 'is-active' : ''}"
              data-route="${item.route}"
            >
              <span>${item.label}</span>
            </button>
          `,
        )
        .join('')}
    </nav>
  `;
}
