<template>
  <div>
    <div class="aspect-ratio-box">
      <div
        class="content-box h-100 d-flex flex-column"
        @mouseout="hovered_element = []"
      >
        <b-row
          v-for="[i, row] in Object.entries(data)"
          :key="`row_${i}`"
          class="flex-grow-1 mx-0"
        >
          <b-col
            v-for="[j, item] in Object.entries(row)"
            :key="`row_${i}_col_${j}`"
            :style="{ backgroundColor: color(item) }"
            class="border border-dark px-0"
            @mouseenter="hovered_element = [j, i]"
          >
          </b-col>
        </b-row>
      </div>
    </div>
    <b-row class="mx-0">
      <b-col class="flex-shrink-1 px-0 flex-grow-0">
        {{ round(min, 3) }}
      </b-col>
      <b-col class="col-6 px-0 mx-1 py-1">
        <div
          class="h-100"
          :style="{
            'background-image': `linear-gradient(to left, ${color(
              max
            )}, ${color(min)})`,
          }"
        ></div>
      </b-col>
      <b-col class="flex-shrink-1 px-0 flex-grow-0">
        {{ round(max, 3) }}
      </b-col>
      <b-col class="px-0 flex-shrink-1 text-right">{{ hoverText }}</b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {},
})
export default class Heatmap extends Vue {
  @Prop({ required: true }) data!: number[][];

  @Prop({ required: false, default: 0 }) refreshKey!: number;

  hovered_element = [];

  round(value: number, precision: number) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  get dimensions() {
    return {
      y: this.data.length,
      x: this.data[0].length,
    };
  }

  get max() {
    this.refreshKey;
    return Math.max(...this.data.flat());
  }

  get min() {
    this.refreshKey;
    return Math.min(...this.data.flat());
  }

  get range() {
    return this.max - this.min;
  }

  color(value: number) {
    const ratio = (value - this.min) / this.range;
    const hue = (1 - ratio) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  }

  get hoverText() {
    if (this.hovered_element.length === 0) {
      return "";
    }
    const [x, y] = this.hovered_element;
    const scaled = [x / this.dimensions.x, y / this.dimensions.y];
    const position_text = `(${Math.round(scaled[0] * 120)}, ${Math.round(
      scaled[1] * 120
    )})`;

    return `${position_text}: ${this.data[y][x].toPrecision(3)}`;
  }
}
</script>
<style scoped>
.aspect-ratio-box {
  position: relative;
  width: 100%; /* or any specific width */
  padding-top: 66.66666667%; /* 67% of the width */
}

.content-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
