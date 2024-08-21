<template>
  <div>
    <div class="row px-0 mx-0">
      <div class="col">
        <b-table
          striped
          hover
          :items="teamItems"
          :fields="teamFields"
          :current-page="teamPage"
          per-page="10"
        >
          <template v-slot:cell(team)="data">
            <div
              @click="$store.state.selectedTeam = data.item.team"
              style="cursor: pointer"
            >
              {{ data.item.team }}
            </div>
          </template>
        </b-table>
        <b-pagination
          v-model="teamPage"
          :total-rows="teamItems.length"
          per-page="10"
        />
      </div>
      <div class="col">
        <div class="row px-0 mx-0 align-items-center">
          <b-button
            class="col flex-shrink-1 flex-grow-0 px-0"
            @click="$store.state.selectedTeam = ''"
            >Clear</b-button
          >
          <div class="col">
            {{ $store.state.selectedTeam || "No team selected" }}
          </div>
          <b-dropdown
            class="col flex-shrink-1 flex-grow-0"
            :text="teamThreat"
            variant="secondary"
          >
            <b-dropdown-item
              v-for="threat in THREAT_TYPES"
              :key="threat"
              @click="teamThreat = threat"
              >{{ threat }}</b-dropdown-item
            >
          </b-dropdown>
          <b-dropdown
            class="col flex-shrink-1 flex-grow-0 px-0"
            :text="teamPlayPattern"
            variant="secondary"
          >
            <b-dropdown-item
              v-for="play_pattern in PLAY_PATTERNS"
              :key="play_pattern"
              @click="teamPlayPattern = play_pattern"
              >{{ play_pattern }}</b-dropdown-item
            >
          </b-dropdown>
        </div>
        <Heatmap
          v-if="teamHeatmaps[$store.state.selectedTeam]"
          :data="
            teamHeatmaps[$store.state.selectedTeam][teamPlayPattern][teamThreat]
          "
        />
      </div>
    </div>
    <hr />
    <div class="row px-0 mx-0">
      <div class="col">
        <b-table
          striped
          hover
          :items="playerItems"
          :fields="playerFields"
          :current-page="playerPage"
          per-page="10"
        >
          <template v-slot:cell(player)="data">
            <div
              @click="$store.state.selectedPlayer = data.item.player"
              style="cursor: pointer"
            >
              {{ data.item.player }}
            </div>
          </template>
        </b-table>
        <b-pagination
          v-model="playerPage"
          :total-rows="playerItems.length"
          per-page="10"
        />
      </div>
      <div class="col">
        <div class="row px-0 mx-0 align-items-center">
          <b-button
            class="col flex-shrink-1 flex-grow-0"
            @click="$store.state.selectedPlayer = ''"
            >Clear</b-button
          >
          <div class="col">
            {{ $store.state.selectedPlayer || "No player selected" }}
          </div>
          <b-dropdown
            class="col flex-shrink-1 flex-grow-0 px-0"
            :text="playerThreat"
            variant="secondary"
          >
            <b-dropdown-item
              v-for="threat in THREAT_TYPES"
              :key="threat"
              @click="playerThreat = threat"
              >{{ threat }}</b-dropdown-item
            > </b-dropdown
          ><b-dropdown
            class="col flex-shrink-1 flex-grow-0 px-0"
            :text="playerPlayPattern"
            variant="secondary"
          >
            <b-dropdown-item
              v-for="play_pattern in PLAY_PATTERNS"
              :key="play_pattern"
              @click="playerPlayPattern = play_pattern"
              >{{ play_pattern }}</b-dropdown-item
            >
          </b-dropdown>
        </div>
        <Heatmap
          v-if="playerHeatmaps[$store.state.selectedPlayer]"
          :data="
            playerHeatmaps[$store.state.selectedPlayer][playerPlayPattern][
              playerThreat
            ]
          "
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Competition } from "@/types/types";
import { Component, Vue, Watch } from "vue-property-decorator";
import Heatmap from "./Heatmap.vue";

@Component({
  components: {
    Heatmap,
  },
})
export default class TeamDisplay extends Vue {
  teamPage = 1;
  teamThreat = "created";

  playerPage = 1;
  playerThreat = "created";

  THREAT_TYPES = [
    "created",
    "lost",
    "prevented",
    "conceded",
    "offensive",
    "defensive",
    "total",
  ];
  PLAY_PATTERNS = [
    "regular_play",
    "corner",
    "free_kick",
    "throw_in",
    "counter",
    "other",
    "kick_off",
  ];

  playerPlayPattern = "regular_play";
  teamPlayPattern = "regular_play";

  playerHeatmaps: Record<string, Record<string, Record<string, number[][]>>> =
    {};
  teamHeatmaps: Record<string, Record<string, Record<string, number[][]>>> = {};

  players: string[] = [];
  teams: string[] = [];

  playerTeams: Record<string, string> = {};

  get selectedData() {
    return (
      this.$store.state.selectedCompetition +
      this.$store.state.filteredGames.join("")
    );
  }

  _playerItems: Record<string, string | number>[] = [];
  teamItems: Record<string, string | number>[] = [];

  mounted() {
    this.update();
  }

  @Watch("selectedData")
  update() {
    if (!this._playerItems) {
      this._playerItems = [];
    }
    while (this._playerItems.length > 0) {
      this._playerItems.pop();
    }
    this.teamItems = [];

    let competition: Competition =
      this.$store.state.competitions[this.$store.state.selectedCompetition];
    let validGames = competition.filter(
      (game) =>
        this.$store.state.filteredGames.length === 0 ||
        this.$store.state.filteredGames.includes(
          Object.keys(game.teams).join(" vs ")
        )
    );
    let events = validGames.flatMap((game) => game.events);
    this.players = Array.from(
      new Set(
        events.filter((e) => e.player).map((event) => event.player as string)
      )
    );
    this.teams = Array.from(new Set(events.map((event) => event.team)));

    let teamThreats: Record<string, Record<string, number>> = {};
    let playerThreats: Record<string, Record<string, number>> = {};

    for (let team of this.teams) {
      Vue.set(this.teamHeatmaps, team, {});
      teamThreats[team] = {};

      for (let threat of this.THREAT_TYPES) {
        teamThreats[team][threat] = 0;
      }

      for (let play_pattern of this.PLAY_PATTERNS) {
        Vue.set(this.teamHeatmaps[team], play_pattern, {});
        for (let threat of this.THREAT_TYPES) {
          Vue.set(this.teamHeatmaps[team][play_pattern], threat, []);
          for (let y = 0; y < 8; y++) {
            this.teamHeatmaps[team][play_pattern][threat].push([]);
            for (let x = 0; x < 12; x++) {
              this.teamHeatmaps[team][play_pattern][threat][y].push(0);
            }
          }
        }
      }
    }

    for (let player of this.players) {
      Vue.set(this.playerHeatmaps, player, {});
      playerThreats[player] = {};

      for (let threat of this.THREAT_TYPES) {
        playerThreats[player][threat] = 0;
      }

      for (let play_pattern of this.PLAY_PATTERNS) {
        Vue.set(this.playerHeatmaps[player], play_pattern, {});
        for (let threat of this.THREAT_TYPES) {
          Vue.set(this.playerHeatmaps[player][play_pattern], threat, []);
          for (let y = 0; y < 8; y++) {
            this.playerHeatmaps[player][play_pattern][threat].push([]);
            for (let x = 0; x < 12; x++) {
              this.playerHeatmaps[player][play_pattern][threat][y].push(0);
            }
          }
        }
      }
    }

    for (let event of events) {
      if (!event.threat) {
        continue;
      }

      this.playerTeams[event.player as string] = event.team;

      let threat = event.threat as Record<string, number>;
      let team = event.team;
      let player = event.player as string;
      let play_pattern = event.play_pattern;

      for (let threatType of this.THREAT_TYPES) {
        if (threat[threatType]) {
          teamThreats[team][threatType] += threat[threatType];
          if (player) {
            playerThreats[player][threatType] += threat[threatType];
          }

          if (event.location) {
            let [x, y] = event.location;
            x = Math.min(11, Math.floor(x / 10));
            y = Math.min(7, Math.floor(y / 10));

            if (player) {
              this.playerHeatmaps[player][play_pattern][threatType][y][x] +=
                threat[threatType];
            }
            this.teamHeatmaps[team][play_pattern][threatType][y][x] +=
              threat[threatType];
          }
        }
      }
    }

    for (let player of this.players) {
      playerThreats[player]["offensive"] =
        playerThreats[player]["created"] - playerThreats[player]["lost"];
      playerThreats[player]["defensive"] =
        playerThreats[player]["prevented"] - playerThreats[player]["conceded"];
      playerThreats[player]["total"] =
        playerThreats[player]["offensive"] + playerThreats[player]["defensive"];

      for (let threat of this.THREAT_TYPES) {
        playerThreats[player][threat] =
          Math.round(playerThreats[player][threat] * 100) / 100;
      }

      for (let play_pattern of this.PLAY_PATTERNS) {
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 12; x++) {
            this.playerHeatmaps[player][play_pattern]["offensive"][y][x] =
              this.playerHeatmaps[player][play_pattern]["created"][y][x] -
              this.playerHeatmaps[player][play_pattern]["lost"][y][x];

            this.playerHeatmaps[player][play_pattern]["defensive"][y][x] =
              this.playerHeatmaps[player][play_pattern]["prevented"][y][x] -
              this.playerHeatmaps[player][play_pattern]["conceded"][y][x];

            this.playerHeatmaps[player][play_pattern]["total"][y][x] =
              this.playerHeatmaps[player][play_pattern]["offensive"][y][x] +
              this.playerHeatmaps[player][play_pattern]["defensive"][y][x];
          }
        }
      }

      this._playerItems.push({
        player: player,
        created: playerThreats[player]["created"],
        lost: playerThreats[player]["lost"],
        prevented: playerThreats[player]["prevented"],
        conceded: playerThreats[player]["conceded"],
        offensive: playerThreats[player]["offensive"],
        defensive: playerThreats[player]["defensive"],
        total: playerThreats[player]["total"],
      });
    }

    for (let team of this.teams) {
      teamThreats[team]["offensive"] =
        teamThreats[team]["created"] - teamThreats[team]["lost"];
      teamThreats[team]["defensive"] =
        teamThreats[team]["prevented"] - teamThreats[team]["conceded"];
      teamThreats[team]["total"] =
        teamThreats[team]["offensive"] + teamThreats[team]["defensive"];

      for (let threat of this.THREAT_TYPES) {
        teamThreats[team][threat] =
          Math.round(teamThreats[team][threat] * 100) / 100;
      }

      for (let play_pattern of this.PLAY_PATTERNS) {
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 12; x++) {
            this.teamHeatmaps[team][play_pattern]["offensive"][y][x] =
              this.teamHeatmaps[team][play_pattern]["created"][y][x] -
              this.teamHeatmaps[team][play_pattern]["lost"][y][x];

            this.teamHeatmaps[team][play_pattern]["defensive"][y][x] =
              this.teamHeatmaps[team][play_pattern]["prevented"][y][x] -
              this.teamHeatmaps[team][play_pattern]["conceded"][y][x];

            this.teamHeatmaps[team][play_pattern]["total"][y][x] =
              this.teamHeatmaps[team][play_pattern]["offensive"][y][x] +
              this.teamHeatmaps[team][play_pattern]["defensive"][y][x];
          }
        }
      }

      this.teamItems.push({
        team: team,
        created: teamThreats[team]["created"],
        lost: teamThreats[team]["lost"],
        prevented: teamThreats[team]["prevented"],
        conceded: teamThreats[team]["conceded"],
        offensive: teamThreats[team]["offensive"],
        defensive: teamThreats[team]["defensive"],
        total: teamThreats[team]["total"],
      });
    }
  }

  get playerItems() {
    return this._playerItems.filter((item) =>
      this.$store.state.selectedTeam
        ? this.playerTeams[item.player] === this.$store.state.selectedTeam
        : true
    );
  }

  get teamFields() {
    if (!this.teamItems || this.teamItems.length === 0) {
      return [];
    }
    return Object.keys(this.teamItems[0]).map((key) => {
      return { key, sortable: true };
    });
  }

  get playerFields() {
    return Object.keys(this._playerItems[0]).map((key) => {
      return { key, sortable: true };
    });
  }
}
</script>
