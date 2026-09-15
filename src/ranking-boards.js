// How ROOFRUNNER appears in ssalmuk_ranking. Must match supabase/ranking-boards.sql (checked by tests/ranking.test.js).
export const RANKING_GAME = 'roofrunner';
// One board per city layout revision, mirroring the local record key (roofrunner-records-v5-<city>):
// a layout change bumps the version, so old and new times never share a board.
export const boardIdFor = map => `${map.id}-${map.storageKey.match(/-(v\d+)-/)[1]}`;
// Finish time in milliseconds; lower wins. min = shortest possible tour of the start roof and all eight
// targets (minimum spanning tree length) at the top slide speed of 25 m/s. max = one hour.
export const BOARDS = [
  { id: 'sunset-v5', name: '선셋 디스트릭트', higherIsBetter: false, min: 13726, max: 3_600_000 },
  { id: 'harbor-v5', name: '하버 라인', higherIsBetter: false, min: 15581, max: 3_600_000 },
  { id: 'neon-v5', name: '네온 하이츠', higherIsBetter: false, min: 10120, max: 3_600_000 },
  { id: 'dawn-v5', name: '새벽 언덕', higherIsBetter: false, min: 12851, max: 3_600_000 },
];
