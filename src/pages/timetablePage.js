import { renderCompactEventRow } from '../components/cards.js';
import { renderEmptyState, renderSectionHeader } from '../components/ui.js';
import { groupEventsByStartTime } from '../utils/time.js';

const pageState = {
  categoryId: 'all',
  locationId: 'all',
};

function getFilteredEvents(context) {
  return context.data.events.filter((event) => {
    return (pageState.categoryId === 'all' || event.categoryId === pageState.categoryId)
      && (pageState.locationId === 'all' || event.locationId === pageState.locationId);
  });
}

export const timetablePage = {
  render(context) {
    const filteredEvents = getFilteredEvents(context);
    const grouped = groupEventsByStartTime(filteredEvents);
    const times = Object.keys(grouped).sort();

    return `
      <section class="section-block">
        ${renderSectionHeader('タイムテーブル', '時間ごとにイベントを見比べて、次に行く場所を決められます')}

        <div class="filter-grid">
          <label class="field">
            <span class="field__label">カテゴリ</span>
            <select class="field__select" id="timetable-category">
              <option value="all" ${pageState.categoryId === 'all' ? 'selected' : ''}>すべて</option>
              ${context.data.categories
                .map(
                  (category) => `<option value="${category.id}" ${pageState.categoryId === category.id ? 'selected' : ''}>${category.jpLabel}</option>`,
                )
                .join('')}
            </select>
          </label>

          <label class="field">
            <span class="field__label">場所</span>
            <select class="field__select" id="timetable-location">
              <option value="all" ${pageState.locationId === 'all' ? 'selected' : ''}>すべて</option>
              ${context.data.locations
                .map(
                  (location) => `<option value="${location.id}" ${pageState.locationId === location.id ? 'selected' : ''}>${location.name}</option>`,
                )
                .join('')}
            </select>
          </label>
        </div>
      </section>

      <section class="section-block section-block--tight-top">
        ${times.length === 0
          ? renderEmptyState('表示できるイベントがありません', 'フィルター条件を変更すると別の候補が見つかります。')
          : `
            <div class="timeline-list">
              ${times
                .map(
                  (time) => `
                    <section class="timeline-group">
                      <div class="timeline-group__time">${time}</div>
                      <div class="timeline-group__content stack">
                        ${grouped[time]
                          .map((event) => renderCompactEventRow(event, context.getEventRelations(event), context.isFavorite(event.id)))
                          .join('')}
                      </div>
                    </section>
                  `,
                )
                .join('')}
            </div>
          `}
      </section>
    `;
  },

  bind(root, context) {
    root.querySelector('#timetable-category')?.addEventListener('change', (event) => {
      pageState.categoryId = event.target.value;
      context.render();
    });

    root.querySelector('#timetable-location')?.addEventListener('change', (event) => {
      pageState.locationId = event.target.value;
      context.render();
    });
  },
};
