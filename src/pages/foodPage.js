import { renderFoodCard } from '../components/cards.js';
import { foodTypes } from '../data/mockData.js';
import { renderEmptyState, renderSectionHeader } from '../components/ui.js';

const pageState = {
  type: 'all',
};

function getFilteredBooths(context) {
  return context.data.foodBooths.filter((booth) => pageState.type === 'all' || booth.type === pageState.type);
}

export const foodPage = {
  render(context) {
    const booths = getFilteredBooths(context);

    return `
      <section class="section-block">
        ${renderSectionHeader('フード', '食事・軽食・ドリンク・デザートをまとめて確認できます')}
        <div class="pill-scroll" aria-label="フードカテゴリ">
          ${foodTypes
            .map(
              (type) => `
                <button class="pill-button ${pageState.type === type.id ? 'is-active' : ''}" data-food-type="${type.id}">
                  ${type.label}
                </button>
              `,
            )
            .join('')}
        </div>
      </section>

      <section class="section-block section-block--tight-top">
        <div class="results-meta">
          <strong>${booths.length}件のフードブース</strong>
          <span>混雑度つきで、食べる場所を決めやすくしています</span>
        </div>

        <div class="stack">
          ${booths.length > 0
            ? booths
              .map((booth) => renderFoodCard(booth, context.getFoodRelations(booth)))
              .join('')
            : renderEmptyState('該当するフードがありません', '別のカテゴリを選ぶと候補が表示されます。', '/food', 'フード一覧に戻る')}
        </div>
      </section>
    `;
  },

  bind(root, context) {
    root.querySelectorAll('[data-food-type]').forEach((button) => {
      button.addEventListener('click', () => {
        pageState.type = button.dataset.foodType;
        context.render();
      });
    });
  },
};
