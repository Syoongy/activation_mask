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
      .get("http://192.168.43.168:8080/getFinished")
      .json();
  },
  methods: {
    updateStationList(val) {
      this.stationList = val;
    }
  }
};
</script>
<style>
html {
  background-color: #222831;
}
</style>
