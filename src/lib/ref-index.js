export function makeRefIndex(refs) {
  const map = {};
  let counter = 0;
  const refMap = Object.fromEntries(refs.map(r => [r.id, r]));
  return {
    getOrAdd(id) {
      if (!id) return null;
      if (!refMap[id]) return null;
      if (!map[id]) map[id] = ++counter;
      return map[id];
    },
    getMap() { return map; },
    getAll() { return refs; },
  };
}
