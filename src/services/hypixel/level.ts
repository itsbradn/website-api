export const calculateLevelFromExp = (exp: number) => {
  const pre = -(10000 - 0.5 * 2500) / 2500;
  const pre2 = pre * pre;
  const growthDivides = 2 / 2500;
  const num = 1 + pre + Math.sqrt(pre2 + growthDivides * exp);
  return Math.round(num * 100) / 100;
};

export const calculateExpToNextLevel = (exp: number) => {
  return exp < 10000 ? 10000 : (2500 * Math.floor(calculateLevelFromExp(exp)) + 5000);
}

export const calculateLevelExpFloor = (level: number) => {
  const last = Math.floor(level) - 1;
  return 1250 * last ** 2 + 8750 * last;
}

export const calculateLevelProgress = (exp: number, expFloor: number, expToNext: number) => {
  return Math.round(
    ((exp - expFloor) / expToNext) * 100 * 100
  ) / 100;
}

export const calculateLevelData = (exp: number) => {
  const level = calculateLevelFromExp(exp)
  const expToNextLevel = calculateExpToNextLevel(exp)
  const levelExpFloor = calculateLevelExpFloor(level);
  const levelProgress = calculateLevelProgress(exp, levelExpFloor, expToNextLevel);
  return {
    level,
    expToNextLevel,
    levelExpFloor,
    levelProgress
  }
}