<template>
  <div id="board">
    <Tile
      v-for="station in station"
      :key="station.stationNo"
      :station="station"
    />
  </div>
</template>

<script>
import Tile from "./Tile";
export default {
  components: {
    Tile
  },
  props: {
    stations: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped></style>
