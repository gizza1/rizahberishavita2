const KEY = "vita-milk-adventure-progress";

export const loadProgress = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { unlocked: 0, results: {} }; }
  catch { return { unlocked: 0, results: {} }; }
};

export const saveCompletion = (levelId, result, levelIndex) => {
  const progress = loadProgress();
  progress.unlocked = Math.max(progress.unlocked, Math.min(levelIndex + 1, 2));
  progress.results[levelId] = { ...progress.results[levelId], ...result };
  localStorage.setItem(KEY, JSON.stringify(progress));
  return progress;
};
