/**
 * Converts britness value (0 - 255) into a percentage (0 - 100)
 *
 * @param bri number
 * @returns number
 */
export const briToPercents = (bri: number): number => {
  return Math.round(bri / 255 * 100);
};

/**
 * Converts a percent value (0 - 100) into a britness one (0 - 255)
 *
 * @param percent number
 * @returns number
 */
export const percentsToBri = (percent: number): number => {
  return Math.round(percent / 100 * 255);
};
