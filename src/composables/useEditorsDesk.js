import { defaultTeaching } from "../data/gitTeaching.js";

export function resolveEditorsDesk(challenge, lastAction, teachingLibrary) {
  if (!lastAction) return { ...challenge.editorial.intro, tone: "intro" };
  const override = challenge.editorial.actions?.[lastAction.teachingKey];
  const content = override || teachingLibrary[lastAction.teachingKey] || defaultTeaching;
  return { ...content, tone: lastAction.success ? "active" : "warning" };
}
