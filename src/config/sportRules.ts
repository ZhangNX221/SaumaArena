export interface SportRuleSettings {
  durationPerPeriod: number; // minutes
  periodCount: number;
  breakDuration: number; // minutes
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
  foulLimit: number;
  timeoutPerPeriod: number;
  extraTimeDuration: number;
  penaltyKicksCount: number;
}

export const DEFAULT_SPORT_RULES: Record<string, SportRuleSettings> = {
  FUTSAL: {
    durationPerPeriod: 20,
    periodCount: 2,
    breakDuration: 5,
    winPoints: 3,
    drawPoints: 1,
    lossPoints: 0,
    foulLimit: 5,
    timeoutPerPeriod: 1,
    extraTimeDuration: 5,
    penaltyKicksCount: 5,
  },
  FOOTBALL: {
    durationPerPeriod: 45,
    periodCount: 2,
    breakDuration: 15,
    winPoints: 3,
    drawPoints: 1,
    lossPoints: 0,
    foulLimit: 10,
    timeoutPerPeriod: 0,
    extraTimeDuration: 15,
    penaltyKicksCount: 5,
  },
  VOLLEYBALL: {
    durationPerPeriod: 25,
    periodCount: 3,
    breakDuration: 3,
    winPoints: 2,
    drawPoints: 0,
    lossPoints: 0,
    foulLimit: 0,
    timeoutPerPeriod: 2,
    extraTimeDuration: 0,
    penaltyKicksCount: 0,
  },
  BADMINTON: {
    durationPerPeriod: 21,
    periodCount: 3,
    breakDuration: 2,
    winPoints: 2,
    drawPoints: 0,
    lossPoints: 0,
    foulLimit: 0,
    timeoutPerPeriod: 1,
    extraTimeDuration: 0,
    penaltyKicksCount: 0,
  },
};

