import { renderCompactEventRow } from '../components/cards.js';
import { renderEmptyState, renderImagePlaceholder, renderMetaRow, renderSectionHeader } from '../components/ui.js';
import { getRelatedEvents } from '../utils/recommendations.js';
import { formatTimeRange } from '../utils/time.js';
import { venueLabel } from '../utils/helpers.js';

export const eventDetailPage = {
  render(context, route) {
    const event = context.data.events.find((item) => item.id === route.params.eventId);

    if (!event) {
      return renderEmptyState('イベントが見つかりません', '一覧ページから別のイベントを選んでください。', '/events');
    }

    const relations = context.getEventRelations(event);
    const related = getRelatedEvents(event, context.data.events, 3);
    const favorite = context.isFavorite(event.id);

    return `
      <section class="detail-hero">
        <div class="detail-hero__media">
          ${renderImagePlaceholder(event.imageAlt)}
        </div>
        <div class="detail-hero__body">
          <div class="detail-hero__topline">
            <button class="back-link" data-route="/events">← 一覧に戻る</button>
          </div>
          <h2>${event.name}</h2>
          <p class="detail-hero__description">${event.description}</p>

          <div class="detail-actions">
            <button class="primary-button" data-favorite-id="${event.id}" aria-pressed="${String(favorite)}">
              ${favorite ? 'お気に入り解除' : 'お気に入りに追加'}
            </button>
            <button class="secondary-button" data-map-location="${event.locationId}">地図で見る</button>
          </div>
        </div>
      </section>

      <section class="section-block">
        ${renderSectionHeader('詳細情報', '来場者が判断しやすい基本情報をまとめています')}
        <div class="detail-meta-card">
          ${renderMetaRow('時間', formatTimeRange(event.startTime, event.endTime))}
          ${renderMetaRow('場所', relations.location?.name ?? '未設定')}
          ${renderMetaRow('カテゴリ', relations.category?.jpLabel ?? '未設定')}
          ${renderMetaRow('混雑度', event.crowdLevel === 'low' ? 'Low / 空き気味' : event.crowdLevel === 'medium' ? 'Medium / ふつう' : 'High / 混雑')}
          ${renderMetaRow('会場タイプ', venueLabel(event.areaType))}
        </div>
      </section>

      <section class="section-block">
        ${renderSectionHeader('You may also like', '近いカテゴリや場所からおすすめを表示')}
        <div class="stack">
          ${related.map((item) => renderCompactEventRow(item, context.getEventRelations(item), context.isFavorite(item.id))).join('')}
        </div>
      </section>
    `;
  },

  bind() {},
};
