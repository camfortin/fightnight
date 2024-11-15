export type Fighter = 'tyson' | 'paul';
export type WinMethod = 'KO' | 'TKO' | 'UD' | 'SD' | 'MD' | 'Draw' | 'DQ' | 'NC';

export interface VoteData {
  fighter: Fighter;
  round?: number;
  how?: WinMethod;
}

export interface VoteCounts {
  tyson: number;
  paul: number;
}

export interface VoteStatsData {
  byFighter: VoteCounts;
  byRound: Record<number, number>;
  byMethod: Record<WinMethod, number>;
}