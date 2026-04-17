import { renderCrowdBadge, renderTag, renderVenueTag } from './ui.js';
import { escapeHTML } from '../utils/helpers.js';
import { formatTimeRange } from '../utils/time.js';

export function renderEventCard(event, relations, isFavorite) {
  const location = relations.location;
  const category = relations.category;

  return `
    <article class="event-card" data-event-card="${escapeHTML(event.id)}" tabindex="0" role="button" aria-label="${escapeHTML(event.name)} の詳細を見る">
      <div class="event-card__top">
        <div class="stack stack--xs">
          <div class="inline-tags">
            ${renderTag(category?.jpLabel ?? 'カテゴリ未設定', 'accent')}
            ${renderVenueTag(event.areaType)}
          </div>
          <h3>${escapeHTML(event.name)}</h3>
        </div>
        <button
          class="favorite-button ${isFavorite ? 'is-active' : ''}"
          data-favorite-id="${escapeHTML(event.id)}"
          aria-label="${isFavorite ? 'お気に入り解除' : 'お気に入り追加'}"
          aria-pressed="${String(isFavorite)}"
        >★</button>
      </div>
      <div class="event-card__meta">
        <span>📍 ${escapeHTML(location?.name ?? '会場未設定')}</span>
        <span>🕒 ${escapeHTML(formatTimeRange(event.startTime, event.endTime))}</span>
      </div>
      <p class="event-card__description">${escapeHTML(event.shortDescription)}</p>
      <div class="event-card__footer">
        <div class="inline-tags">
          ${renderCrowdBadge(event.crowdLevel)}
        </div>
        <button class="text-button" data-map-location="${escapeHTML(event.locationId)}">地図で見る</button>
      </div>
    </article>
  `;
}

export function renderCompactEventRow(event, relations, isFavorite = false) {
  return `
    <article class="compact-card" data-event-card="${escapeHTML(event.id)}" tabindex="0" role="button">
      <div class="compact-card__content">
        <div class="stack stack--xs">
          <span class="compact-card__time">${escapeHTML(formatTimeRange(event.startTime, event.endTime))}</span>
          <h3>${escapeHTML(event.name)}</h3>
          <p>${escapeHTML(relations.location?.name ?? '')} ・ ${escapeHTML(relations.category?.jpLabel ?? '')}</p>
        </div>
        <div class="compact-card__actions">
          ${renderCrowdBadge(event.crowdLevel)}
          <button
            class="favorite-button favorite-button--small ${isFavorite ? 'is-active' : ''}"
            data-favorite-id="${escapeHTML(event.id)}"
            aria-label="${isFavorite ? 'お気に入り解除' : 'お気に入り追加'}"
            aria-pressed="${String(isFavorite)}"
          >★</button>
        </div>
      </div>
    </article>
  `;
}

export function renderFoodCard(booth, relations) {
  return `
    <article class="food-card">
      <div class="food-card__top">
        <div>
          <div class="inline-tags">
            ${renderTag(relations.foodTypeLabel, 'accent')}
            ${renderCrowdBadge(booth.crowdLevel)}
          </div>
          <h3>${escapeHTML(booth.name)}</h3>
        </div>
      </div>
      <p class="food-card__menu">${escapeHTML(booth.menuSummary)}</p>
      <div class="food-card__meta">
        <span>📍 ${escapeHTML(relations.location?.name ?? '')}</span>
        <span>🕒 ${escapeHTML(`${booth.openTime} - ${booth.closeTime}`)}</span>
      </div>
      <p class="food-card__description">${escapeHTML(booth.shortDescription)}</p>
    </article>
  `;
}
