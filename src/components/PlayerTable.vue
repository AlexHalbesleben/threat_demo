<template>
  <div>
    <b-table :items="players" striped hover>
      <template v-slot:cell(player)="data">
        <div @click="$store.state.selectedPlayer = data.item.player">
          {{ data.item.player }}
        </div>
      </template>
    </b-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class PlayerTable extends Vue {
  get players() {
    return [
      { player: "Milinkovic-Savic", id: 1 },
      { player: "Immobile", id: 2 },
    ];
  }
}
</script>
