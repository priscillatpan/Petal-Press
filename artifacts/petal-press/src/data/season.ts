export type Season = 'spring' | 'summer' | 'fall' | 'winter';

const MONTH_SEASONS: Record<string, Season> = {
  january: 'winter',
  february: 'winter',
  march: 'spring',
  april: 'spring',
  may: 'spring',
  june: 'summer',
  july: 'summer',
  august: 'summer',
  september: 'fall',
  october: 'fall',
  november: 'fall',
  december: 'winter',
};

export function getSeasonFromDate(dateStr: string): Season {
  const monthName = (dateStr || '').split(' ')[0].toLowerCase();
  return MONTH_SEASONS[monthName] ?? 'spring';
}

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

// 0-indexed month numbers (Jan=0 ... Dec=11) that belong to each season
export const SEASON_MONTH_INDICES: Record<Season, number[]> = {
  spring: [2, 3, 4],
  summer: [5, 6, 7],
  fall: [8, 9, 10],
  winter: [11, 0, 1],
};

export const ALL_MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
