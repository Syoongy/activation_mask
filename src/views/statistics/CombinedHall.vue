<template>
  <section id="quantity-section">
    <div class="is-flex" id="quantity-container">
      <div class="box has-background-black-ter box-spacing">
        <CombinedHall
          title="TOTAL BOXES (PLC)"
          :finishedPacks="this.finishedBoxes"
        />
        <CombinedHall
          title="TOTAL BOXES (SAFTI)"
          :finishedPacks="this.saftiFinishedBoxes"
        />
      </div>
    </div>
  </section>
</template>

<script>
import CombinedHall from "@/components/Statistics/CombinedHall";
import io from "socket.io-client";
import getCurrentShift from "@/plugins/getCurrentShift";

import ky from "ky";

export default {
  components: {
    CombinedHall
  },
  sockets: {
    receivedValues(val) {
      const data = val.Item;
      this.receivedItems.mask = data.mask;
      this.receivedItems.thermometer = data.thermometer;
      this.receivedItems.sanitiser = data.handSanitiser;
      this.receivedItems.ziploc = data.ziploc;
    },
    finishedValues(val) {
      let newFinishedBoxesValues = 0;
      for (const section of val) {
        const stationNameSplit = section.stationNo.split("-");
        const isCurrShift = stationNameSplit[0] === this.currShift;
        if (isCurrShift) newFinishedBoxesValues += section.quantity;
      }
      this.finishedBoxes = newFinishedBoxesValues;
    }
  },
  data() {
    return {
      receivedItems: { mask: 0, thermometer: 0, sanitiser: 0, ziploc: 0 },
      saftiReceivedItems: { mask: 0, thermometer: 0, sanitiser: 0, ziploc: 0 },
      boxMask: 1600,
      boxThermometer: 0,
      boxSanitiser: 0,
      boxZiploc: 400,
      shipped: 0,
      delivered: 0,
      packsPerBox: 200,
      targetPacksPerHour: 21840,
      workHoursPerDay: 13,
      finishedBoxes: 0,
      saftiFinishedBoxes: 0,
      currentDateObj: new Date(),
      nextPageTimeout: null,
      saftiSocket: null,
      currShift: 1
    };
  },
  methods: {
    setSaftiFinishedBoxes(val) {
      let newFinishedBoxesValues = 0;
      for (const section of val) {
        const stationNameSplit = section.stationNo.split("-");
        const isCurrShift = stationNameSplit[0] === this.currShift;
        if (isCurrShift) newFinishedBoxesValues += section.quantity;
      }
      this.saftiFinishedBoxes = newFinishedBoxesValues;
    }
  },
  async mounted() {
    this.currShift = getCurrentShift();
    //Setup safti socket
    this.saftiSocket = io("http://54.254.221.3:8080");
    this.saftiSocket.on("receivedValues", this.setSaftiReceivedItems);
    this.saftiSocket.on("finishedValues", this.setSaftiFinishedBoxes);

    let res = await ky.get("http://54.169.249.3:8080/getFinished").json();
    for (const section of res) {
      const stationNameSplit = section.stationNo.split("-");
      const isCurrShift = stationNameSplit[0] === this.currShift;
      if (isCurrShift) this.finishedBoxes += section.quantity;
    }

    res = await ky.get("http://54.254.221.3:8080/getFinished").json();
    for (const section of res) {
      const stationNameSplit = section.stationNo.split("-");
      const isCurrShift = stationNameSplit[0] === this.currShift;
      if (isCurrShift) this.saftiFinishedBoxes += section.quantity;
    }

    this.nextPageTimeout = setTimeout(() => {
      this.$router.push("/");
    }, 30000);
  },
  beforeDestroy() {
    this.nextPageTimeout = null;
  }
};
</script>

<style scoped>
.box:not(:last-child) {
  margin-bottom: 0;
}

#quantity-section {
  background-color: #212121 !important;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}

#quantity-container {
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.box-spacing {
  margin-bottom: 1rem !important;
  width: 100%;
}
</style>
