export const parseWhole = (num?: any) => {
  if (!num) return 0;
  if (typeof num === 'number' || typeof num === 'bigint') return Math.round(Number(num));
  if (typeof num === 'string') return Math.round(parseInt(num));
  if (typeof num === 'boolean') return num ? 1 : 0;
  return 0;
}

export const parseWinLoss = (num1?: any, num2?: any) => {
  return (parseWhole(num1) / parseWhole(num2));
}