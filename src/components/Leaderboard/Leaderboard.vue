<template>
  <div id="leaderboard-container">
    <p class="title has-text-centered has-text-white">LEADERBOARD</p>
    <div id="tile-container" class="is-flex is-centered-flex">
      <LeaderboardTile
        v-for="(station, id) in sortedStations"
        :rank="id + 1"
        :name="station.stationNo"
        :qty="station.quantity"
        :key="id"
      ></LeaderboardTile>
    </div>
  </div>
</template>

<script>
import LeaderboardTile from "./LeaderboardTile";
export default {
  props: {
    stations: {
      type: Array,
      required: true
    }
  },
  components: {
    LeaderboardTile
  },
  computed: {
    sortedStations() {
      const listToSort = this.stations;
      listToSort.sort((a, b) => {
        if (a.quantity > b.quantity) return -1;
        else if (a.quantity < b.quantity) return 1;
        else return 0;
      });
      return listToSort;
    }
  }
};
</script>

<style>
#leaderboard-container {
  margin-top: 1rem;
  background-color: #393e46;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

#tile-container {
  flex-direction: column;
}
</style>
