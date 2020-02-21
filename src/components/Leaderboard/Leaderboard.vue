<template>
  <div id="leaderboard-container">
    <div id="tile-container" class="is-flex is-centered-flex">
      <transition-group id="transition-styling" name="leaderboard-list">
        <LeaderboardTile
          v-for="(station, id) in sortedStations"
          :rank="id + 1"
          :name="station.stationNo"
          :qty="station.quantity"
          :key="station.stationNo"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import LeaderboardTile from "./LeaderboardTile";
// import prevStationValList from "@/assets/prevCount.json";
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
    // computedStations() {
    //   const retStations = this.stations;
    //   for (const station of retStations) {
    //     const prevStationItem = prevStationValList.prevStationList.find(
    //       prevStation => prevStation.stationNo === station.stationNo
    //     );
    //     station.quantity -= prevStationItem.quantity;
    //   }
    //   return retStations;
    // }
  }
};
</script>

<style>
#leaderboard-container {
  background: #424242;
  margin-top: 1rem;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

#tile-container {
  flex-direction: column;
}

#transition-styling {
  width: 80%;
}

.leaderboard-tile {
  transition: all 0.5s;
  margin-right: 10px;
}
.leaderboard-list-enter, .leaderboard-list-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
