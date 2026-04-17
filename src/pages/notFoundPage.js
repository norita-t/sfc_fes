import { renderEmptyState } from '../components/ui.js';

export const notFoundPage = {
  render() {
    return renderEmptyState('ページが見つかりません', 'ホームに戻って、もう一度メニューから選んでください。', '/', 'ホームへ戻る');
  },

  bind() {},
};
