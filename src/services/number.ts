export const parseWhole = (num?: any) => {
  if (num === null || num === undefined) return 0;
  if (typeof num === "number" || typeof num === "bigint")
    return Math.round(Number(num));
  if (typeof num === "string") return Math.round(parseInt(num));
  if (typeof num === "boolean") return num ? 1 : 0;
  return 0;
};

export const parseWinLoss = (num1?: any, num2?: any) => {
  const num = parseWhole(num1) / parseWhole(num2);
  return isNaN(num) ? 0 : num;
};

export const parsePercentage = (value: any, max: number) => {
  return ((100 * parseWhole(value)) / max) ?? 0;
}