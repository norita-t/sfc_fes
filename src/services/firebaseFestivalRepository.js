/**
 * Firestore 導入時の差し替え用プレースホルダーです。
 *
 * 使い方の想定:
 * 1. Firebase SDK を追加
 * 2. Firestore instance を constructor で受け取る
 * 3. mockFestivalRepository の代わりに app.js で inject する
 */
export class FirebaseFestivalRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  async getBootstrapData() {
    throw new Error('FirebaseFestivalRepository は未実装です。Firestore 接続時にここを実装してください。');
  }

  async getEvents() {
    throw new Error('getEvents is not implemented yet.');
  }

  async getLocations() {
    throw new Error('getLocations is not implemented yet.');
  }

  async getCategories() {
    throw new Error('getCategories is not implemented yet.');
  }

  async getFoodBooths() {
    throw new Error('getFoodBooths is not implemented yet.');
  }
}
