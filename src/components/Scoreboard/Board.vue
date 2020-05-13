<template>
  <div class="columns" id="board">
    <div class="column" v-for="(section, idx) in stations" :key="idx">
      <Tile v-for="(station, ids) in section" :key="ids" :station="station" />
    </div>
  </div>
</template>

<script>
import Tile from "./Tile";
export default {
  components: {
    Tile,
  },
  props: {
    stations: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.column {
  padding: 0.4rem;
}
</style>
