<template>
  <section id="quantity-section">
    <div class="is-flex" id="quantity-container">
      <div class="box has-background-black-ter box-spacing">
        <RequirementDeltaETA
          title="Delta (Combined)"
          :delta="currentRequirement.totalDelta"
          :finishedPacks="currentRequirement.totalFinishedPacks"
          :requiredPacks="currentRequirement.totalRequiredPacks"
          titletwo="ETA (Combined)"
          :eta="currentRequirement.totalETA"
          :totalTimeString="currentRequirement.totalTimeString"
        />
      </div>

      <div class="box has-background-black-ter box-spacing columns">
        <DeltaDetail
          titlePLC="Delta (PLC)"
          titleSAFTI="Delta (SAFTI)"
          :deltaPLC="currentRequirement.delta"
          :producedPLC="currentRequirement.finishedPacks"
          :targetPLC="currentRequirement.currentRequiredPacks"
          :deltaSAFTI="currentRequirement.saftiDelta"
          :producedSAFTI="currentRequirement.saftiFinishedPacks"
          :targetSAFTI="currentRequirement.currentRequiredPacks"
        />
        <ETADetail
          titlePLC="ETA (PLC)"
          titleSAFTI="ETA (SAFTI)"
          :etaPLC="currentRequirement.plcETA"
          :etaSAFTI="currentRequirement.saftiETA"
          :plcTimeString="currentRequirement.plcTimeString"
          :saftiTimeString="currentRequirement.saftiTimeString"
        />
        <!-- <RequirementDelta
          title="Delta (PLC)"
          :delta="currentRequirement.delta"
          :finishedPacks="currentRequirement.finishedPacks"
          :requiredPacks="currentRequirement.currentRequiredPacks"
          titletwo = "ETA (PLC)"
        />
        <RequirementDelta
          title="Delta (SAFTI)"
          :delta="currentRequirement.saftiDelta"
          :finishedPacks="currentRequirement.saftiFinishedPacks"
          :requiredPacks="currentRequirement.currentRequiredPacks"
          titletwo = "ETA (SAFTI)"
        /> -->
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
import RequirementDeltaETA from "@/components/Statistics/RequirementDeltaETA";
import RawMaterials from "@/components/Statistics/RawMaterials";
import DeltaDetail from "@/components/Statistics/DeltaDetail";
import ETADetail from "@/components/Statistics/ETADetail";
import io from "socket.io-client";

import ky from "ky";

export default {
  components: {
    RequirementDeltaETA,
    RawMaterials,
    DeltaDetail,
    ETADetail
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
      // From: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

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
          } else if (currentHour < 15) {
            numHoursInCompletedHours = currentHour - 8;

            numHoursInCompletedMinutes = currentMinute / 60;
            numHoursInCompletedSeconds = currentSecond / 3600;
          } else if (currentHour == 15) {
            numHoursInCompletedHours = 7;
          } else if (currentHour < 22) {
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


      // ETA CALCULATION
      const totalTarget = 1600000

      let plcHourlyProduction = (783 * 200) / 7;
      let saftiHourlyProduction = (798 * 200) / 7;
      let totalHourlyProduction = plcHourlyProduction + saftiHourlyProduction;

      let plcRemaining = (totalTarget / 2) - finishedPacks;
      let saftiRemaining = (totalTarget / 2) - saftiFinishedPacks;
      let totalRemaining = totalTarget - (finishedPacks + saftiFinishedPacks);

      let plcETA = (plcRemaining / plcHourlyProduction);
      let saftiETA = (saftiRemaining / saftiHourlyProduction);
      let totalETA = (totalRemaining / totalHourlyProduction);

      if (plcETA >= saftiETA) {
        totalETA = plcETA;
      } else {
        totalETA = saftiETA;
      }

      let plcHoursAtFinish = elapsedHours + plcETA;
      let saftiHoursAtFinish = elapsedHours + saftiETA;
      let totalHoursAtFinish = elapsedHours + totalETA;

      console.log(plcHoursAtFinish)
      console.log(elapsedHours)
      console.log(plcETA)
      console.log(plcRemaining)
      console.log(plcHourlyProduction)

      function getTimeStringAtFinish(hoursAtFinish) {
        let daysAtFinish = Math.floor(hoursAtFinish / 13);
        let h = hoursAtFinish % 13
        if ( h < 7 ){
          h += 8;
        } else {
          // Account for the 1 hour break
          h += 1;
          h += 8;
        }
        let m = Math.floor(((h % 1) * 60));

        h = Math.round(h);

        let dayName = "";

        switch(daysAtFinish) {
          case 0:
            dayName = "Monday"
            break;
          case 1:
            dayName = "Tuesday"
            break;
          case 2:
            dayName = "Wednesday"
            break;
          case 3:
            dayName = "Thursday"
            break;
          case 4:
            dayName = "Friday"
            break;
          default:
            dayName = "NA"
        }

        let hString = "";
        if (h < 10) {
          hString = "0" + h.toString();
        } else {
          hString = h.toString();
        }
        let mString = "";
        if (m < 10) {
          mString = "0" + m.toString();
        } else {
          mString = m.toString();
        }

        return dayName + ", " + hString + mString + "hrs";


      }



      // console.log(elapsedHours)
      // console.log(plcHoursAtFinish)
      let plcTimeString = getTimeStringAtFinish(plcHoursAtFinish);
      let saftiTimeString = getTimeStringAtFinish(saftiHoursAtFinish);
      let totalTimeString = getTimeStringAtFinish(totalHoursAtFinish);

      return {
        finishedPacks: numberWithCommas(finishedPacks),
        saftiFinishedPacks: numberWithCommas(saftiFinishedPacks),
        currentRequiredPacks: numberWithCommas(currentRequiredPacks),
        delta: numberWithCommas(delta),
        saftiDelta: numberWithCommas(saftiDelta),
        totalFinishedPacks: numberWithCommas(
          finishedPacks + saftiFinishedPacks
        ),
        totalRequiredPacks: numberWithCommas(currentRequiredPacks * 2),
        totalDelta: numberWithCommas(delta + saftiDelta),
        plcETA: plcETA.toFixed(1),
        saftiETA: saftiETA.toFixed(1),
        totalETA: totalETA.toFixed(1),
        plcTimeString: plcTimeString,
        saftiTimeString: saftiTimeString,
        totalTimeString: totalTimeString
      };
    }
    // currentRawMaterials() {
    //   return {
    //     finishedPacks: numberWithCommas(finishedPacks),
    //     saftiFinishedPacks: numberWithCommas(saftiFinishedPacks),
    //     currentRequiredPacks: numberWithCommas(currentRequiredPacks),
    //     delta: numberWithCommas(delta),
    //     saftiDelta: numberWithCommas(saftiDelta),
    //     totalFinishedPacks: numberWithCommas(finishedPacks + saftiFinishedPacks),
    //     totalRequiredPacks: numberWithCommas(currentRequiredPacks * 2),
    //     totalDelta: numberWithCommas(delta + saftiDelta)
    //   };
    // }
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
