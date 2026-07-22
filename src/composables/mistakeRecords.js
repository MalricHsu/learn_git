export function upsertMistake(records, attempt) {
  const index = records.findIndex((record) => record.id === attempt.id);
  if (index === -1) return [{ ...attempt, count: 1 }, ...records];

  return records.map((record, recordIndex) => (
    recordIndex === index
      ? { ...record, ...attempt, count: (record.count || 1) + 1 }
      : record
  ));
}

export function removeMistake(records, id) {
  return records.filter((record) => record.id !== id);
}
