<template>
  <section class="section">
    <div class="container">
      <Progress />
      <Leaderboard :stations="stationList" :currentShift="this.currentShift" />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import Progress from "@/components/Progress";
import Leaderboard from "@/components/Leaderboard/Leaderboard";
import getCurrentShift from "@/plugins/getCurrentShift";
import ky from "ky";

export default {
  name: "finished",
  components: {
    Progress,
    Leaderboard
  },
  sockets: {
    updatedStationQty(val) {
      const stationName = val.id.split("-")[1];
      const station = this.stationList.find(
        ele => ele.stationNo === stationName
      );
      if (station) station.quantity = val.qty;
      else this.stationList.push({ stationNo: stationName, quantity: val.qty });
    }
  },
  data() {
    return {
      stationList: [],
      nextPageTimeout: null,
      currentShift: 1
    };
  },
  async mounted() {
    const res = await ky.get("http://54.254.221.3:8080/getFinished").json();
    const currShift = getCurrentShift();
    this.stationList = this.getCurrShiftList(res, currShift);
    this.currentShift = parseInt(currShift);

    this.nextPageTimeout = setTimeout(() => {
      this.$router.push("/scoreboard");
    }, 60000);
  },
  beforeDestroy() {
    this.nextPageTimeout = null;
  },
  methods: {
    updateStationList(val) {
      for (const station of this.stationList) {
        if (station.stationNo === val.id) {
          station.quantity = val.qty;
        }
      }
    },
    getCurrShiftList(allFinished, currShift) {
      const retList = [];
      for (const shiftItem of allFinished) {
        const stationNameSplit = shiftItem.stationNo.split("-");
        const isCurrShift = stationNameSplit[0] === currShift;
        if (isCurrShift)
          retList.push({
            stationNo: stationNameSplit[1],
            quantity: shiftItem.quantity
          });
      }
      return retList;
    }
  }
};
</script>
<style scoped>
.section {
  background-color: #212121 !important;
}
</style>
