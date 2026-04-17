import { crowdRank, unique } from './helpers.js';
import { isHappeningNow, minutesUntil, nowInMinutes, toMinutes } from './time.js';

function getFavoriteCategories(events, favoriteIds) {
  return unique(
    events
      .filter((event) => favoriteIds.includes(event.id))
      .map((event) => event.categoryId),
  );
}

function baseEventScore(event, currentMinutes, favoriteCategories) {
  let score = 0;
  const wait = minutesUntil(event.startTime, currentMinutes);

  if (isHappeningNow(event, currentMinutes)) {
    score += 70;
  } else if (wait >= 0 && wait <= 20) {
    score += 50;
  } else if (wait > 20 && wait <= 60) {
    score += 30;
  } else if (wait < 0) {
    score -= 50;
  }

  score += (100 - (crowdRank(event.crowdLevel) * 12));
  score += Math.round(event.popularityScore / 6);

  if (favoriteCategories.includes(event.categoryId)) {
    score += 24;
  }

  if (event.staffPick) {
    score += 8;
  }

  if (event.rainFriendly) {
    score += 3;
  }

  return score;
}

export function getRecommendedEvents(events, favoriteIds = [], limit = 4, currentMinutes = nowInMinutes()) {
  const favoriteCategories = getFavoriteCategories(events, favoriteIds);

  return [...events]
    .filter((event) => toMinutes(event.endTime) >= currentMinutes - 5)
    .sort((a, b) => baseEventScore(b, currentMinutes, favoriteCategories) - baseEventScore(a, currentMinutes, favoriteCategories))
    .slice(0, limit);
}

export function getPopularRightNow(events, limit = 4, currentMinutes = nowInMinutes()) {
  const activeEvents = events.filter((event) => isHappeningNow(event, currentMinutes));
  const pool = activeEvents.length > 0
    ? activeEvents
    : events.filter((event) => minutesUntil(event.startTime, currentMinutes) >= 0);

  return [...pool]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);
}

export function getLessCrowdedPicks(events, limit = 3, currentMinutes = nowInMinutes()) {
  return [...events]
    .filter((event) => toMinutes(event.endTime) >= currentMinutes - 10)
    .sort((a, b) => {
      const crowdDiff = crowdRank(a.crowdLevel) - crowdRank(b.crowdLevel);
      if (crowdDiff !== 0) {
        return crowdDiff;
      }
      return minutesUntil(a.startTime, currentMinutes) - minutesUntil(b.startTime, currentMinutes);
    })
    .slice(0, limit);
}

export function getIndoorRecommendations(events, limit = 3) {
  return [...events]
    .filter((event) => event.areaType === 'indoor')
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);
}

export function getStaffPicks(events, limit = 3) {
  return events.filter((event) => event.staffPick).slice(0, limit);
}

export function getRelatedEvents(currentEvent, events, limit = 3) {
  return [...events]
    .filter((event) => event.id !== currentEvent.id)
    .sort((a, b) => {
      const aScore = Number(a.categoryId === currentEvent.categoryId) * 4
        + Number(a.locationId === currentEvent.locationId) * 2
        + Math.round(a.popularityScore / 20);
      const bScore = Number(b.categoryId === currentEvent.categoryId) * 4
        + Number(b.locationId === currentEvent.locationId) * 2
        + Math.round(b.popularityScore / 20);
      return bScore - aScore;
    })
    .slice(0, limit);
}
