import Vue from "vue";
import Vuex from "vuex";

import { Competition, COMPETITIONS } from "@/types/types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedPlayer: "",
    competitions: {} as Record<string, Competition>,
    competition_names: COMPETITIONS,
    selectedCompetition: COMPETITIONS[0],
    filteredGames: [] as string[],
    selectedTeam: "",
    loadedCompetitions: [] as string[],
  },
  getters: {},
  mutations: {
    loadCompetition(state, competition: string) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const data = require(`@/data/demo/${competition}`);
      Vue.set(state.competitions, competition, data);
      state.loadedCompetitions.push(competition);
    },
  },
  actions: {},
  modules: {},
});
