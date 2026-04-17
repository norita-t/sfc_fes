export function toMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours * 60) + minutes;
}

export function nowInMinutes(now = new Date()) {
  return (now.getHours() * 60) + now.getMinutes();
}

export function formatTimeRange(startTime, endTime) {
  return `${startTime} - ${endTime}`;
}

export function isHappeningNow(item, currentMinutes = nowInMinutes()) {
  return toMinutes(item.startTime) <= currentMinutes && currentMinutes <= toMinutes(item.endTime);
}

export function minutesUntil(timeString, currentMinutes = nowInMinutes()) {
  return toMinutes(timeString) - currentMinutes;
}

export function getFestivalBounds(items) {
  const starts = items.map((item) => toMinutes(item.startTime || item.openTime));
  const ends = items.map((item) => toMinutes(item.endTime || item.closeTime));
  return {
    open: Math.min(...starts),
    close: Math.max(...ends),
  };
}

export function minutesToClock(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function getFestivalStatus(items, currentMinutes = nowInMinutes()) {
  const { open, close } = getFestivalBounds(items);
  if (currentMinutes < open) {
    return {
      mode: 'before-open',
      message: `開場前です。${minutesToClock(open)} からスタートします。`,
    };
  }
  if (currentMinutes > close) {
    return {
      mode: 'after-close',
      message: `本日のプログラムは終了しました。${minutesToClock(open)} から翌日の想定データを再確認できます。`,
    };
  }
  return {
    mode: 'open',
    message: '現在開催中です。開催中またはまもなく始まる企画を優先表示しています。',
  };
}

export function sortEventsByStart(events) {
  return [...events].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

export function groupEventsByStartTime(events) {
  return sortEventsByStart(events).reduce((groups, event) => {
    const key = event.startTime;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
    return groups;
  }, {});
}
