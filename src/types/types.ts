export type Competition = [
  {
    teams: {
      [key: string]: {
        goals: number;
        threat: {
          created: number;
          lost: number;
          prevented: number;
          conceded: number;
        };
        xg: number;
      };
    };
    events: {
      type: string;
      player: string | null;
      possession: number;
      possession_team: string;
      time: string;
      team: string;
      location?: [number, number];
      play_pattern: string;
      threat: {
        created: number;
        lost: number;
        prevented: number;
        conceded: number;
      };
    };
    id: string;
  }
];

export const COMPETITIONS = ["FIFA~World~Cup_2022.json"];
