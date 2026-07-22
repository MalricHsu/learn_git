export const DEFAULT_PROGRESS = Object.freeze({
  xp: 0,
  completedMissions: Object.freeze([]),
  favorites: Object.freeze([]),
  recent: Object.freeze([]),
  unlockedAchievements: Object.freeze([]),
});

const legacyChallengeOrder = [
  "c01", "c02", "c03", "c04", "c06", "c07", "c08", "c09", "c11", "c12",
  "c13", "c14", "c16", "c17", "c18", "c19", "c21", "c22", "c23",
];

export function migrateChallengeProgress(ids = []) {
  const migrated = ids.map((id) => {
    const legacy = /^m(\d+)$/.exec(id);
    if (legacy) return legacyChallengeOrder[Number(legacy[1]) - 1];
    return /^c(?:0[1-9]|[12]\d|3[0-2])$/.test(id) ? id : null;
  }).filter(Boolean);
  return [...new Set(migrated)];
}

export function shouldUnlockAchievement(completedIds, chapterChallengeIds) {
  return chapterChallengeIds.every((id) => completedIds.includes(id));
}

export function isMissionPreviouslyCompleted(completedIds, missionId) {
  return completedIds.includes(missionId);
}

export function shouldAwardMissionXp(completedIds, missionId) {
  return !isMissionPreviouslyCompleted(completedIds, missionId);
}
