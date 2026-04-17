import { renderCompactEventRow } from '../components/cards.js';
import {
  renderEmptyState,
  renderQuickLink,
  renderSectionHeader,
  renderStatCard,
} from '../components/ui.js';
import {
  getIndoorRecommendations,
  getLessCrowdedPicks,
  getPopularRightNow,
  getRecommendedEvents,
  getStaffPicks,
} from '../utils/recommendations.js';
import { getFestivalStatus, isHappeningNow, nowInMinutes } from '../utils/time.js';

export const homePage = {
  render(context) {
    const { events, locations } = context.data;
    const currentMinutes = nowInMinutes();
    const favorites = context.favorites;
    const recommended = getRecommendedEvents(events, favorites, 4, currentMinutes);
    const popular = getPopularRightNow(events, 4, currentMinutes);
    const lessCrowded = getLessCrowdedPicks(events, 3, currentMinutes);
    const indoor = getIndoorRecommendations(events, 3);
    const staffPicks = getStaffPicks(events, 3);
    const festivalStatus = getFestivalStatus(events, currentMinutes);
    const activeNow = events.filter((event) => isHappeningNow(event, currentMinutes));

    const lowAreas = locations.filter((location) => location.currentCrowdLevel === 'low').length;
    const mediumAreas = locations.filter((location) => location.currentCrowdLevel === 'medium').length;
    const highAreas = locations.filter((location) => location.currentCrowdLevel === 'high').length;

    return `
      <section class="hero-card">
        <div class="hero-card__content">
          <span class="eyebrow">ようこそ</span>
          <h2>迷わず回れて、今行くべき場所がすぐ分かる学園祭ガイド</h2>
          <p>
            はじめての来場者でも使いやすい、慶應SFC向けのデジタルパンフレットです。
            イベント、フード、混雑、場所をひとつにまとめて確認できます。
          </p>
        </div>
        <div class="hero-status hero-status--${festivalStatus.mode}">
          <strong>${activeNow.length > 0 ? `${activeNow.length}件 開催中` : '次の企画を案内中'}</strong>
          <span>${festivalStatus.message}</span>
        </div>
      </section>

      <section class="quick-links-grid">
        ${renderQuickLink('マップ', '/map', '場所から探す')}
        ${renderQuickLink('イベント', '/events', '一覧で見る')}
        ${renderQuickLink('タイムテーブル', '/timetable', '時間で探す')}
        ${renderQuickLink('フード', '/food', '食べ物を探す')}
        ${renderQuickLink('お気に入り', '/favorites', '保存した企画')}
      </section>

      <section class="section-block">
        ${renderSectionHeader('キャンパス混雑サマリー', '今の混雑感をざっくり把握できます')}
        <div class="stats-grid">
          ${renderStatCard('開催中イベント', `${activeNow.length}件`, activeNow.length > 0 ? '今すぐ参加できる企画' : 'まもなく始まる企画を表示')}
          ${renderStatCard('空き気味エリア', `${lowAreas}エリア`, '落ち着いて回りやすい')}
          ${renderStatCard('やや混雑', `${mediumAreas}エリア`, '待ち時間はほどほど')}
          ${renderStatCard('混雑エリア', `${highAreas}エリア`, '人気企画が集中中')}
        </div>
      </section>

      <section class="section-block">
        ${renderSectionHeader('おすすめ / Recommended Now', '開催中・もうすぐ開始・お気に入り傾向をもとに提案')}
        <div class="stack">
          ${recommended.length > 0
            ? recommended
              .map((event) => renderCompactEventRow(event, context.getEventRelations(event), context.isFavorite(event.id)))
              .join('')
            : renderEmptyState('おすすめがまだありません', '後でもう一度開くと、開催時間に応じた提案が表示されます。')}
        </div>
      </section>

      <section class="section-block">
        ${renderSectionHeader('人気 / Popular Right Now', '人気度の高い企画を優先表示')}
        <div class="stack">
          ${popular.map((event) => renderCompactEventRow(event, context.getEventRelations(event), context.isFavorite(event.id))).join('')}
        </div>
      </section>

      <section class="section-block">
        ${renderSectionHeader('空いているおすすめ', '比較的入りやすい企画を優先')}
        <div class="stack">
          ${lessCrowded.map((event) => renderCompactEventRow(event, context.getEventRelations(event), context.isFavorite(event.id))).join('')}
        </div>
      </section>

      <section class="section-block">
        ${renderSectionHeader('雨の日向け屋内おすすめ', '屋内で回りやすい企画をピックアップ')}
        <div class="stack">
          ${indoor.map((event) => renderCompactEventRow(event, context.getEventRelations(event), context.isFavorite(event.id))).join('')}
        </div>
      </section>

      <section class="section-block">
        ${renderSectionHeader('Staff Picks', '運営目線で案内しやすい企画')}
        <div class="stack">
          ${staffPicks.map((event) => renderCompactEventRow(event, context.getEventRelations(event), context.isFavorite(event.id))).join('')}
        </div>
      </section>

      <section class="section-block qr-card">
        <div class="qr-card__content">
          <div>
            <span class="eyebrow">入口導線プレースホルダー</span>
            <h2>QRコード掲示エリア</h2>
            <p>受付・校門・案内看板からこのアプリへ誘導する想定の枠です。実運用時は本番URLのQRに差し替えます。</p>
          </div>
          <div class="qr-placeholder" aria-hidden="true">
            <span>QR</span>
          </div>
        </div>
      </section>
    `;
  },

  bind() {},
};
