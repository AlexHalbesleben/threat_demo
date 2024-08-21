<template>
  <div id="app" class="h-100">
    <b-navbar class="navbar navbar-dark bg-primary">
      <b-navbar-brand>Threat Demo</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item
          to="https://github.com/alexhalbesleben"
          target="_blank"
          class="text-white"
          >Alex Halbesleben</b-nav-item
        >
      </b-navbar-nav>
      <b-navbar-nav>
        <b-button v-b-modal.explanation-modal>?</b-button>
      </b-navbar-nav>
    </b-navbar>

    <CompetitionSelect />

    <TeamDisplay />
    <footer class="bg-secondary text-white text-center p-3">
      Data courtesy of&nbsp;
      <img src="./assets/sb_logo.png" width="100px" />
    </footer>

    <ExplanationModal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Heatmap from "./components/Heatmap.vue";
import PlayerTable from "./components/PlayerTable.vue";
import CompetitionSelect from "./components/CompetitionSelect.vue";
import TeamDisplay from "./components/TeamDisplay.vue";
import ExplanationModal from "./components/ExplanationModal.vue";

@Component({
  components: {
    Heatmap,
    PlayerTable,
    CompetitionSelect,
    TeamDisplay,
    ExplanationModal,
  },
})
export default class App extends Vue {
  mounted() {
    if (!localStorage.explanationModalShown) {
      this.$bvModal.show("explanation-modal");
      localStorage.explanationModalShown = true;
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
