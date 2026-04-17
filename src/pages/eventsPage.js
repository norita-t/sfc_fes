import { renderEventCard } from '../components/cards.js';
import { renderEmptyState, renderSectionHeader } from '../components/ui.js';
import { crowdRank, escapeHTML } from '../utils/helpers.js';
import { isHappeningNow, minutesUntil, nowInMinutes, toMinutes } from '../utils/time.js';

const pageState = {
  search: '',
  categoryId: 'all',
  timeFilter: 'all',
  crowdLevel: 'all',
  venueType: 'all',
  sortBy: 'soon',
};

function matchesTimeFilter(event, timeFilter, currentMinutes) {
  if (timeFilter === 'all') {
    return true;
  }
  if (timeFilter === 'now') {
    return isHappeningNow(event, currentMinutes);
  }
  if (timeFilter === 'soon') {
    const delta = minutesUntil(event.startTime, currentMinutes);
    return isHappeningNow(event, currentMinutes) || (delta >= 0 && delta <= 60);
  }
  if (timeFilter === 'morning') {
    return toMinutes(event.startTime) < 12 * 60;
  }
  if (timeFilter === 'afternoon') {
    return toMinutes(event.startTime) >= 12 * 60;
  }
  return true;
}

function sortEvents(events, sortBy, currentMinutes) {
  return [...events].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.popularityScore - a.popularityScore;
    }

    if (sortBy === 'uncrowded') {
      const crowdDiff = crowdRank(a.crowdLevel) - crowdRank(b.crowdLevel);
      if (crowdDiff !== 0) {
        return crowdDiff;
      }
      return a.popularityScore - b.popularityScore;
    }

    const aNow = isHappeningNow(a, currentMinutes) ? -999 : Math.abs(minutesUntil(a.startTime, currentMinutes));
    const bNow = isHappeningNow(b, currentMinutes) ? -999 : Math.abs(minutesUntil(b.startTime, currentMinutes));
    return aNow - bNow;
  });
}

function getFilteredEvents(context) {
  const currentMinutes = nowInMinutes();
  const searchText = pageState.search.trim().toLowerCase();

  return sortEvents(
    context.data.events.filter((event) => {
      const relations = context.getEventRelations(event);
      const haystack = [
        event.name,
        event.shortDescription,
        event.description,
        relations.location?.name,
        relations.category?.jpLabel,
      ]
        .join(' ')
        .toLowerCase();

      return (!searchText || haystack.includes(searchText))
        && (pageState.categoryId === 'all' || event.categoryId === pageState.categoryId)
        && (pageState.crowdLevel === 'all' || event.crowdLevel === pageState.crowdLevel)
        && (pageState.venueType === 'all' || event.areaType === pageState.venueType)
        && matchesTimeFilter(event, pageState.timeFilter, currentMinutes);
    }),
    pageState.sortBy,
    currentMinutes,
  );
}

function renderCategoryButtons(context) {
  return `
    <div class="pill-scroll" role="tablist" aria-label="カテゴリ絞り込み">
      <button class="pill-button ${pageState.categoryId === 'all' ? 'is-active' : ''}" data-category-filter="all">すべて</button>
      ${context.data.categories
        .map(
          (category) => `
            <button
              class="pill-button ${pageState.categoryId === category.id ? 'is-active' : ''}"
              data-category-filter="${category.id}"
            >${category.jpLabel}</button>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderSortButtons() {
  return `
    <div class="segmented-control" aria-label="並び替え">
      <button class="segmented-control__item ${pageState.sortBy === 'soon' ? 'is-active' : ''}" data-sort="soon">開始順</button>
      <button class="segmented-control__item ${pageState.sortBy === 'popular' ? 'is-active' : ''}" data-sort="popular">人気順</button>
      <button class="segmented-control__item ${pageState.sortBy === 'uncrowded' ? 'is-active' : ''}" data-sort="uncrowded">空いている順</button>
    </div>
  `;
}

export const eventsPage = {
  render(context) {
    const filteredEvents = getFilteredEvents(context);

    return `
      <section class="section-block">
        ${renderSectionHeader('イベント', 'カテゴリ・時間・混雑度で比較しながら探せます')}

        <div class="filter-panel">
          <label class="field">
            <span class="field__label">検索</span>
            <input id="events-search" class="field__input" type="search" value="${escapeHTML(pageState.search)}" placeholder="イベント名・場所・説明で検索" />
          </label>

          ${renderCategoryButtons(context)}

          <div class="filter-grid">
            <label class="field">
              <span class="field__label">時間</span>
              <select class="field__select" id="events-time-filter">
                <option value="all" ${pageState.timeFilter === 'all' ? 'selected' : ''}>すべて</option>
                <option value="now" ${pageState.timeFilter === 'now' ? 'selected' : ''}>開催中</option>
                <option value="soon" ${pageState.timeFilter === 'soon' ? 'selected' : ''}>1時間以内</option>
                <option value="morning" ${pageState.timeFilter === 'morning' ? 'selected' : ''}>午前</option>
                <option value="afternoon" ${pageState.timeFilter === 'afternoon' ? 'selected' : ''}>午後</option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">混雑度</span>
              <select class="field__select" id="events-crowd-filter">
                <option value="all" ${pageState.crowdLevel === 'all' ? 'selected' : ''}>すべて</option>
                <option value="low" ${pageState.crowdLevel === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" ${pageState.crowdLevel === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${pageState.crowdLevel === 'high' ? 'selected' : ''}>High</option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">屋内 / 屋外</span>
              <select class="field__select" id="events-venue-filter">
                <option value="all" ${pageState.venueType === 'all' ? 'selected' : ''}>すべて</option>
                <option value="indoor" ${pageState.venueType === 'indoor' ? 'selected' : ''}>屋内</option>
                <option value="outdoor" ${pageState.venueType === 'outdoor' ? 'selected' : ''}>屋外</option>
              </select>
            </label>
          </div>

          ${renderSortButtons()}
        </div>
      </section>

      <section class="section-block section-block--tight-top">
        <div class="results-meta">
          <strong>${filteredEvents.length}件のイベント</strong>
          <span>初来場者でも比較しやすいカード表示</span>
        </div>

        <div class="stack">
          ${filteredEvents.length > 0
            ? filteredEvents
              .map((event) => renderEventCard(event, context.getEventRelations(event), context.isFavorite(event.id)))
              .join('')
            : renderEmptyState('条件に合うイベントが見つかりません', 'フィルターを少しゆるめると候補が増えます。')}
        </div>
      </section>
    `;
  },

  bind(root, context) {
    const searchInput = root.querySelector('#events-search');
    const timeFilter = root.querySelector('#events-time-filter');
    const crowdFilter = root.querySelector('#events-crowd-filter');
    const venueFilter = root.querySelector('#events-venue-filter');

    searchInput?.addEventListener('input', (event) => {
      pageState.search = event.target.value;
      context.render({ focusSelector: '#events-search' });
    });

    timeFilter?.addEventListener('change', (event) => {
      pageState.timeFilter = event.target.value;
      context.render();
    });

    crowdFilter?.addEventListener('change', (event) => {
      pageState.crowdLevel = event.target.value;
      context.render();
    });

    venueFilter?.addEventListener('change', (event) => {
      pageState.venueType = event.target.value;
      context.render();
    });

    root.querySelectorAll('[data-category-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        pageState.categoryId = button.dataset.categoryFilter;
        context.render();
      });
    });

    root.querySelectorAll('[data-sort]').forEach((button) => {
      button.addEventListener('click', () => {
        pageState.sortBy = button.dataset.sort;
        context.render();
      });
    });
  },
};
