<template>
  <section id="quantity-section">
    <div class="is-flex" id="quantity-container">
      <div class="box has-background-black-ter box-spacing">
        <RequirementDelta
          title="Delta (Combined)"
          :delta="currentRequirement.delta + currentRequirement.saftiDelta"
          :finishedPacks="
            currentRequirement.finishedPacks +
              currentRequirement.saftiFinishedPacks
          "
          :requiredPacks="
            currentRequirement.currentRequiredPacks +
              currentRequirement.currentRequiredPacks
          "
        />
      </div>
      <div class="box has-background-black-ter box-spacing columns">
        <RequirementDelta
          title="Delta (PLC)"
          :delta="currentRequirement.delta"
          :finishedPacks="currentRequirement.finishedPacks"
          :requiredPacks="currentRequirement.currentRequiredPacks"
        />
        <RequirementDelta
          title="Delta (SAFTI)"
          :delta="currentRequirement.saftiDelta"
          :finishedPacks="currentRequirement.saftiFinishedPacks"
          :requiredPacks="currentRequirement.currentRequiredPacks"
        />
      </div>

      <div class="box has-background-black-ter box-spacing columns">
        <RawMaterials
          class="column"
          title="Raw Materials (PLC)"
          :masksRemaining="remainingItems.mask"
          :masksTotal="receivedItems.mask"
          :ziplocsRemaining="remainingItems.ziploc"
          :ziplocsTotal="receivedItems.ziploc"
          :targetPacksPerHour="targetPacksPerHour"
        ></RawMaterials>
        <RawMaterials
          class="column"
          title="Raw Materials (SAFTI)"
          :masksRemaining="saftiRemainingItems.mask"
          :masksTotal="saftiReceivedItems.mask"
          :ziplocsRemaining="saftiRemainingItems.ziploc"
          :ziplocsTotal="saftiReceivedItems.ziploc"
          :targetPacksPerHour="targetPacksPerHour"
        ></RawMaterials>
      </div>

      <!-- <div class="box has-background-black-ter box-spacing">
        <CurrentRequirement
          :finishedPacks="currentRequirement.finishedPacks"
          :currentRequiredPacks="currentRequirement.currentRequiredPacks"
        />
      </div> -->
    </div>
  </section>
</template>

<script>
import CurrentRequirement from "@/components/Statistics/CurrentRequirement";
import RequirementDelta from "@/components/Statistics/RequirementDelta";
import RawMaterials from "@/components/Statistics/RawMaterials";
import io from "socket.io-client";

import ky from "ky";

export default {
  components: {
    RequirementDelta,
    RawMaterials
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
        newFinishedBoxesValues += section.quantity;
      }
      this.finishedBoxes = newFinishedBoxesValues;
    }
  },
  computed: {
    remainingItems() {
      const retObj = { ...this.receivedItems };
      retObj.mask = retObj.mask - this.finishedBoxes * this.boxMask;
      // retObj.thermometer =
      //   retObj.thermometer - this.finishedBoxes * this.boxThermometer;
      // retObj.sanitiser =
      //   retObj.sanitiser - this.finishedBoxes * this.boxSanitiser;
      retObj.ziploc = retObj.ziploc - this.finishedBoxes * this.boxZiploc;
      return retObj;
    },
    saftiRemainingItems() {
      const retObj = { ...this.saftiReceivedItems };
      retObj.mask = retObj.mask - this.saftiFinishedBoxes * this.boxMask;
      // retObj.thermometer =
      //   retObj.thermometer - this.saftiFinishedBoxes * this.boxThermometer;
      // retObj.sanitiser =
      //   retObj.sanitiser - this.saftiFinishedBoxes * this.boxSanitiser;
      retObj.ziploc = retObj.ziploc - this.saftiFinishedBoxes * this.boxZiploc;
      return retObj;
    },
    currentRequirement() {
      const finishedPacks = this.finishedBoxes * this.packsPerBox;
      const saftiFinishedPacks = this.saftiFinishedBoxes * this.packsPerBox;

      let elapsedHours = 0.0,
        numHoursInCompletedDays = 0.0,
        numHoursInCompletedHours = 0.0,
        numHoursInCompletedMinutes = 0.0,
        numHoursInCompletedSeconds = 0.0;
      const opStartDate = 24;
      const opStartHour = 8;
      const opStartMinute = 0;

      const currentDate = this.currentDateObj.getDate();
      const currentHour = this.currentDateObj.getHours();
      const currentMinute = this.currentDateObj.getMinutes();
      const currentSecond = this.currentDateObj.getSeconds();

      if (currentDate >= opStartDate) {
        numHoursInCompletedDays =
          (currentDate - opStartDate) * this.workHoursPerDay;
        if (currentHour >= opStartHour) {
          if (currentHour < 8) {
            numHoursInCompletedHours = 0;
          } else if (currentHour <= 15) {
            numHoursInCompletedHours = currentHour - 8;

            numHoursInCompletedMinutes = currentMinute / 60;
            numHoursInCompletedSeconds = currentSecond / 3600;
          } else if (currentHour <= 22) {
            // Account for the 1 hour break
            numHoursInCompletedHours = currentHour - 8 - 1;

            numHoursInCompletedMinutes = currentMinute / 60;
            numHoursInCompletedSeconds = currentSecond / 3600;
          } else {
            numHoursInCompletedHours = 13;
          }
        }
      }

      elapsedHours =
        numHoursInCompletedDays +
        numHoursInCompletedHours +
        numHoursInCompletedMinutes +
        numHoursInCompletedSeconds;

      const currentRequiredPacks = Math.round(
        elapsedHours * this.targetPacksPerHour
      );

      const delta = finishedPacks - currentRequiredPacks;
      const saftiDelta = saftiFinishedPacks - currentRequiredPacks;

      //
      return {
        finishedPacks: finishedPacks,
        saftiFinishedPacks: saftiFinishedPacks,
        currentRequiredPacks: currentRequiredPacks,
        delta: delta,
        saftiDelta: saftiDelta
      };
    }
  },
  data() {
    return {
      receivedItems: { mask: 0, thermometer: 0, sanitiser: 0, ziploc: 0 },
      saftiReceivedItems: { mask: 0, thermometer: 0, sanitiser: 0, ziploc: 0 },
      boxMask: 800,
      boxThermometer: 0,
      boxSanitiser: 0,
      boxZiploc: 200,
      shipped: 0,
      delivered: 0,
      packsPerBox: 200,
      targetPacksPerHour: 21840,
      workHoursPerDay: 13,
      finishedBoxes: 0,
      saftiFinishedBoxes: 0,
      currentDateObj: new Date(),
      myInterval: null,
      saftiSocket: null
    };
  },
  methods: {
    setSaftiReceivedItems(val) {
      // console.log(val);
      const data = val.Item;
      this.saftiReceivedItems.mask = data.mask;
      this.saftiReceivedItems.thermometer = data.thermometer;
      this.saftiReceivedItems.sanitiser = data.handSanitiser;
      this.saftiReceivedItems.ziploc = data.ziploc;
    },
    setSaftiFinishedBoxes(val) {
      let newFinishedBoxesValues = 0;
      for (const section of val) {
        newFinishedBoxesValues += section.quantity;
      }
      this.saftiFinishedBoxes = newFinishedBoxesValues;
    }
  },
  async mounted() {
    //Setup safti socket
    this.saftiSocket = io("http://54.254.221.3:8080");
    this.saftiSocket.on("receivedValues", this.setSaftiReceivedItems);
    this.saftiSocket.on("finishedValues", this.setSaftiFinishedBoxes);

    //Retrieve data
    let res = await ky.get("http://54.169.249.3:8080/getAllReceived").json();
    let data = res.Item;
    this.receivedItems.mask = data.mask;
    this.receivedItems.thermometer = data.thermometer;
    this.receivedItems.sanitiser = data.handSanitiser;
    this.receivedItems.ziploc = data.ziploc;

    res = await ky.get("http://54.254.221.3:8080/getAllReceived").json();
    data = res.Item;
    this.saftiReceivedItems.mask = data.mask;
    this.saftiReceivedItems.thermometer = data.thermometer;
    this.saftiReceivedItems.sanitiser = data.handSanitiser;
    this.saftiReceivedItems.ziploc = data.ziploc;

    res = await ky.get("http://54.169.249.3:8080/getFinished").json();
    for (const section of res) {
      this.finishedBoxes += section.quantity;
    }

    res = await ky.get("http://54.254.221.3:8080/getFinished").json();
    for (const section of res) {
      this.saftiFinishedBoxes += section.quantity;
    }

    this.myInterval = setInterval(() => {
      this.currentDateObj = new Date();
    }, 900000);
  },
  beforeDestroy() {
    this.myInterval == null;
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
