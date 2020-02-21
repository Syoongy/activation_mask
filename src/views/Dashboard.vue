<template>
  <section class="section">
    <div class="container">
      <Progress />
      <Leaderboard :stations="stationList" />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import Progress from "@/components/Progress";
import Leaderboard from "@/components/Leaderboard/Leaderboard";
import ky from "ky";

export default {
  name: "finished",
  components: {
    Progress,
    Leaderboard
  },
  sockets: {
    updatedStationQty(val) {
      this.updateStationList(val);
    }
  },
  data() {
    return {
      stationList: []
    };
  },
  async mounted() {
    this.stationList = await ky
      .get("http://54.169.249.3:8080/getFinished")
      .json();
    // this.stationList = [
    //   { stationNo: "1", quantity: 10 },
    //   { stationNo: "2", quantity: 20 },
    //   { stationNo: "3", quantity: 30 },
    //   { stationNo: "4", quantity: 10 },
    //   { stationNo: "5", quantity: 12 },
    //   { stationNo: "6", quantity: 10 },
    //   { stationNo: "7", quantity: 20 },
    //   { stationNo: "38", quantity: 30 },
    //   { stationNo: "9", quantity: 10 },
    //   { stationNo: "15", quantity: 12 },
    //   { stationNo: "11", quantity: 10 },
    //   { stationNo: "12", quantity: 20 },
    //   { stationNo: "13", quantity: 30 },
    //   { stationNo: "14", quantity: 10 },
    //   { stationNo: "25", quantity: 12 },
    //   { stationNo: "21", quantity: 10 },
    //   { stationNo: "22", quantity: 20 },
    //   { stationNo: "23", quantity: 30 },
    //   { stationNo: "24", quantity: 10 },
    //   { stationNo: "25", quantity: 12 },
    //   { stationNo: "31", quantity: 10 },
    //   { stationNo: "42", quantity: 20 },
    //   { stationNo: "53", quantity: 30 },
    //   { stationNo: "64", quantity: 10 },
    //   { stationNo: "75", quantity: 12 }
    // ];
  },
  methods: {
    updateStationList(val) {
      for (const station of this.stationList) {
        if (station.stationNo === val.id) {
          station.quantity = val.qty;
        }
      }
    }
  }
};
</script>
<style scoped>
.section {
  background-color: #212121 !important;
}
</style>
