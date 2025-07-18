export const calculateRideDurationHours = (from: string, to: string): number => {
  return Math.abs(parseInt(to) - parseInt(from)) % 24;
};
