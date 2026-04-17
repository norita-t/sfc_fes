const crowdMeta = {
  low: { label: 'Low', jpLabel: '空き気味', rank: 1, tone: 'low' },
  medium: { label: 'Medium', jpLabel: 'ふつう', rank: 2, tone: 'medium' },
  high: { label: 'High', jpLabel: '混雑', rank: 3, tone: 'high' },
};

export function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function crowdToMeta(crowdLevel) {
  return crowdMeta[crowdLevel] ?? crowdMeta.medium;
}

export function crowdRank(crowdLevel) {
  return crowdToMeta(crowdLevel).rank;
}

export function venueLabel(areaType) {
  return areaType === 'indoor' ? '屋内' : '屋外';
}

export function unique(values) {
  return [...new Set(values)];
}

export function getById(collection, id) {
  return collection.find((item) => item.id === id);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function sortByText(items, extractor) {
  return [...items].sort((a, b) => extractor(a).localeCompare(extractor(b), 'ja'));
}
