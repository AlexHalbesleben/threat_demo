<template>
  <div>
    <b-form-select
      :options="$store.state.competition_names"
      v-model="$store.state.selectedCompetition"
      @input="compSelected"
    />
    <div class="list-unstyled">
      <b-form-input v-model="searchQuery" placeholder="Filter by games" />
      <li
        v-if="filteredOptions.length > 0 && searchQuery.length > 0"
        class="dropdown-header"
      >
        <b-dropdown-item
          v-for="(option, index) in filteredOptions"
          :key="index"
          @click="selectOption(option)"
        >
          {{ option }}
        </b-dropdown-item>
      </li>

      <b-list-group horizontal="">
        <b-list-group-item
          v-for="(tag, index) in $store.state.filteredGames"
          :key="index"
        >
          <b-badge
            >{{ tag }} <b-button @click="removeTag(tag)">X</b-button></b-badge
          ></b-list-group-item
        >
      </b-list-group>
    </div>
  </div>
</template>
<script lang="ts">
import { Competition } from "@/types/types";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class CompetitionSelect extends Vue {
  searchQuery = "";

  compSelected() {
    for (let tag of this.$store.state.filteredGames) {
      this.removeTag(tag);
    }
    this.load();
  }

  load() {
    if (
      !this.$store.state.loadedCompetitions.includes(
        this.$store.state.selectedCompetition
      )
    ) {
      console.log("loading new");
      this.$store.commit(
        "loadCompetition",
        this.$store.state.selectedCompetition
      );
      console.log("done loading");
    }
  }

  get options(): string[] {
    if (!this.$store.state.selectedCompetition) {
      return [];
    }
    this.load();

    let competition: Competition =
      this.$store.state.competitions[this.$store.state.selectedCompetition];

    let competitionNames = competition.map((game) =>
      Object.keys(game.teams).join(" vs ")
    );

    return competitionNames;
  }

  get filteredOptions() {
    const query = this.searchQuery.toLowerCase();
    return this.options
      .filter(
        (option) =>
          option.toLowerCase().includes(query) &&
          !this.$store.state.filteredGames.includes(option)
      )
      .slice(0, 15);
  }

  get inputAttrs() {
    return {
      disabled: false,
      placeholder: "Type to search...",
    };
  }

  onInput(newTag: string) {
    if (newTag && !this.$store.state.filteredGames.includes(newTag)) {
      this.$store.state.filteredGames.push(newTag);
    }
    this.searchQuery = ""; // Clear search query after adding a tag
  }

  selectOption(option: string) {
    if (!this.$store.state.filteredGames.includes(option)) {
      this.$store.state.filteredGames.push(option);
    }
    this.searchQuery = ""; // Clear search query after selecting an option
  }

  removeTag(tag: string) {
    this.$store.state.filteredGames = this.$store.state.filteredGames.filter(
      (t: string) => t !== tag
    );
  }
}
</script>
<style lang="scss" scoped>
.dropdown-header {
  position: absolute;
  background: white;
  z-index: 999;
}
</style>
