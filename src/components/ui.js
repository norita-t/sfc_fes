import { crowdToMeta, escapeHTML, venueLabel } from '../utils/helpers.js';

export function renderCrowdBadge(crowdLevel) {
  const meta = crowdToMeta(crowdLevel);
  return `<span class="crowd-badge crowd-badge--${meta.tone}">${escapeHTML(meta.jpLabel)}</span>`;
}

export function renderTag(text, tone = 'neutral') {
  return `<span class="tag tag--${tone}">${escapeHTML(text)}</span>`;
}

export function renderSectionHeader(title, subtitle = '') {
  return `
    <div class="section-header">
      <div>
        <h2>${escapeHTML(title)}</h2>
        ${subtitle ? `<p>${escapeHTML(subtitle)}</p>` : ''}
      </div>
    </div>
  `;
}

export function renderStatCard(label, value, note = '') {
  return `
    <article class="stat-card">
      <span class="stat-card__label">${escapeHTML(label)}</span>
      <strong class="stat-card__value">${escapeHTML(value)}</strong>
      ${note ? `<span class="stat-card__note">${escapeHTML(note)}</span>` : ''}
    </article>
  `;
}

export function renderQuickLink(label, route, hint) {
  return `
    <button class="quick-link" data-route="${escapeHTML(route)}">
      <span class="quick-link__label">${escapeHTML(label)}</span>
      <span class="quick-link__hint">${escapeHTML(hint)}</span>
    </button>
  `;
}

export function renderMetaRow(label, value) {
  return `
    <div class="meta-row">
      <span class="meta-row__label">${escapeHTML(label)}</span>
      <span class="meta-row__value">${escapeHTML(value)}</span>
    </div>
  `;
}

export function renderVenueTag(areaType) {
  return renderTag(venueLabel(areaType), areaType === 'indoor' ? 'indoor' : 'outdoor');
}

export function renderEmptyState(title, description, route = '/events', buttonLabel = 'イベントを見る') {
  return `
    <section class="empty-state">
      <div class="empty-state__icon">◎</div>
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
      <button class="primary-button" data-route="${escapeHTML(route)}">${escapeHTML(buttonLabel)}</button>
    </section>
  `;
}

export function renderImagePlaceholder(label) {
  return `
    <div class="image-placeholder" aria-hidden="true">
      <span>${escapeHTML(label)}</span>
    </div>
  `;
}
