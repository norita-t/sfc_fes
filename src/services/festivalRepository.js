/**
 * 将来的に Firebase Firestore へ接続することを想定した、
 * 学園祭データ取得レイヤーのインターフェース定義です。
 *
 * Firestore collections の想定:
 * - events/{eventId}
 * - locations/{locationId}
 * - categories/{categoryId}
 * - foodBooths/{boothId}
 *
 * events document example:
 * {
 *   name: string,
 *   categoryId: string,
 *   locationId: string,
 *   startTime: string,
 *   endTime: string,
 *   shortDescription: string,
 *   description: string,
 *   crowdLevel: 'low' | 'medium' | 'high',
 *   popularityScore: number,
 *   areaType: 'indoor' | 'outdoor',
 *   staffPick: boolean,
 *   rainFriendly: boolean
 * }
 *
 * 現状は mockFestivalRepository.js を使い、
 * 将来 firebaseFestivalRepository.js へ差し替える構成です。
 */
export const festivalRepositoryContract = {
  getBootstrapData: 'Returns all collections required to render the app.',
  getEvents: 'Returns event documents.',
  getLocations: 'Returns location documents.',
  getCategories: 'Returns category documents.',
  getFoodBooths: 'Returns food booth documents.',
};
