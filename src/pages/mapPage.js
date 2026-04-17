import { renderCompactEventRow } from '../components/cards.js';
import { renderCrowdBadge, renderEmptyState, renderSectionHeader, renderTag } from '../components/ui.js';
import { routeGraph } from '../data/mockData.js';
import { findShortestRoute } from '../utils/route.js';
import { venueLabel } from '../utils/helpers.js';
import { isHappeningNow, nowInMinutes } from '../utils/time.js';

const pageState = {
  selectedLocationId: 'main-stage',
  startLocationId: 'courtyard',
  endLocationId: 'main-stage',
};

const mapLayout = {
  'main-stage': { x: 132, y: 26, width: 106, height: 52 },
  gym: { x: 254, y: 86, width: 80, height: 68 },
  courtyard: { x: 110, y: 120, width: 110, height: 78 },
  'classroom-a': { x: 26, y: 74, width: 76, height: 78 },
  'classroom-b': { x: 194, y: 196, width: 104, height: 44 },
};

function getSelectedLocation(context, route) {
  if (route.query.location && context.data.locations.some((location) => location.id === route.query.location)) {
    pageState.selectedLocationId = route.query.location;
  }
  return context.data.locations.find((location) => location.id === pageState.selectedLocationId) ?? context.data.locations[0];
}

function getEventsAtLocation(context, locationId) {
  const currentMinutes = nowInMinutes();
  return [...context.data.events]
    .filter((event) => event.locationId === locationId)
    .sort((a, b) => {
      const aNow = Number(isHappeningNow(a, currentMinutes));
      const bNow = Number(isHappeningNow(b, currentMinutes));
      if (aNow !== bNow) {
        return bNow - aNow;
      }
      return a.startTime.localeCompare(b.startTime);
    });
}

function renderMapSVG(context, selectedLocationId) {
  return `
    <svg class="campus-map" viewBox="0 0 360 260" role="img" aria-label="SFC campus map mockup">
      <path d="M78 140 L156 160 L184 58 L292 120 L244 216" class="campus-map__route-line" />
      ${context.data.locations
        .map((location) => {
          const area = mapLayout[location.id];
          return `
            <g tabindex="0" role="button" aria-label="${location.name}" data-location-select="${location.id}">
              <rect
                x="${area.x}"
                y="${area.y}"
                width="${area.width}"
                height="${area.height}"
                rx="18"
                class="campus-map__area ${selectedLocationId === location.id ? 'is-selected' : ''} crowd-${location.currentCrowdLevel}"
              />
              <text x="${area.x + 12}" y="${area.y + 26}" class="campus-map__label">${location.name}</text>
              <text x="${area.x + 12}" y="${area.y + 44}" class="campus-map__sublabel">${location.zone}</text>
            </g>
          `;
        })
        .join('')}
    </svg>
  `;
}

export const mapPage = {
  render(context, route) {
    const selectedLocation = getSelectedLocation(context, route);
    const locationEvents = getEventsAtLocation(context, selectedLocation.id);
    const routeResult = findShortestRoute(routeGraph, pageState.startLocationId, pageState.endLocationId);
    const pathLabels = routeResult.path
      .map((locationId) => context.data.locations.find((item) => item.id === locationId)?.name ?? locationId)
      .join(' → ');

    return `
      <section class="section-block">
        ${renderSectionHeader('キャンパスマップ', '場所からイベントを探し、エリアごとの混雑を確認できます')}
        <article class="map-card">
          ${renderMapSVG(context, selectedLocation.id)}
        </article>
      </section>

      <section class="section-block section-block--tight-top">
        <div class="map-legend">
          <div class="legend-item"><span class="legend-dot legend-dot--low"></span> 空き気味</div>
          <div class="legend-item"><span class="legend-dot legend-dot--medium"></span> ふつう</div>
          <div class="legend-item"><span class="legend-dot legend-dot--high"></span> 混雑</div>
          <div class="legend-item"><span class="legend-box"></span> クリックでエリア選択</div>
        </div>
      </section>

      <section class="section-block section-block--tight-top">
        ${renderSectionHeader('エリア別の現在混雑', 'マップの下から直接選択することもできます')}
        <div class="area-chip-list">
          ${context.data.locations
            .map(
              (location) => `
                <button class="area-chip ${selectedLocation.id === location.id ? 'is-active' : ''}" data-location-select="${location.id}">
                  <span>${location.name}</span>
                  ${renderCrowdBadge(location.currentCrowdLevel)}
                </button>
              `,
            )
            .join('')}
        </div>
      </section>

      <section class="section-block">
        <article class="location-focus-card">
          <div class="stack stack--sm">
            <div class="inline-tags">
              ${renderTag(selectedLocation.zone, 'neutral')}
              ${renderTag(venueLabel(selectedLocation.areaType), selectedLocation.areaType === 'indoor' ? 'indoor' : 'outdoor')}
              ${renderCrowdBadge(selectedLocation.currentCrowdLevel)}
            </div>
            <h2>${selectedLocation.name}</h2>
            <p>${selectedLocation.description}</p>
          </div>

          <div class="stack stack--sm">
            <div class="results-meta">
              <strong>${locationEvents.length}件のイベント</strong>
              <span>この場所で開催・展示される企画</span>
            </div>
            ${locationEvents.length > 0
              ? locationEvents.map((event) => renderCompactEventRow(event, context.getEventRelations(event), context.isFavorite(event.id))).join('')
              : renderEmptyState('このエリアの企画はありません', '別の場所を選ぶと開催情報が見られます。')}
          </div>
        </article>
      </section>

      <section class="section-block">
        ${renderSectionHeader('簡易ルート案内（モック）', '実運用時は現在地やバリアフリー導線に置き換え可能です')}
        <div class="route-card">
          <div class="filter-grid">
            <label class="field">
              <span class="field__label">現在地</span>
              <select class="field__select" id="route-start">
                ${context.data.locations
                  .map(
                    (location) => `<option value="${location.id}" ${pageState.startLocationId === location.id ? 'selected' : ''}>${location.name}</option>`,
                  )
                  .join('')}
              </select>
            </label>
            <label class="field">
              <span class="field__label">行き先</span>
              <select class="field__select" id="route-end">
                ${context.data.locations
                  .map(
                    (location) => `<option value="${location.id}" ${pageState.endLocationId === location.id ? 'selected' : ''}>${location.name}</option>`,
                  )
                  .join('')}
              </select>
            </label>
          </div>

          <div class="route-result">
            <strong>${routeResult.totalMinutes}分ルート</strong>
            <p>${pathLabels || '同じ場所です。'}</p>
            <span>混雑を避けたい場合は、空き気味の教室棟Aや教室棟Bを経由候補として案内できます。</span>
          </div>
        </div>
      </section>
    `;
  },

  bind(root, context) {
    root.querySelectorAll('[data-location-select]').forEach((node) => {
      node.addEventListener('click', () => {
        pageState.selectedLocationId = node.dataset.locationSelect;
        context.render();
      });

      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          pageState.selectedLocationId = node.dataset.locationSelect;
          context.render();
        }
      });
    });

    root.querySelector('#route-start')?.addEventListener('change', (event) => {
      pageState.startLocationId = event.target.value;
      context.render();
    });

    root.querySelector('#route-end')?.addEventListener('change', (event) => {
      pageState.endLocationId = event.target.value;
      context.render();
    });
  },
};
