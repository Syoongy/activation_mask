<template>
  <section id="quantity-section">
    <div class="is-flex" id="quantity-container">
      <div class="box has-background-black-ter box-spacing columns">
        <Quantity
          class="column"
          title="Received"
          :masks="receivedItems.mask"
          :thermometers="receivedItems.thermometer"
          :sanitisers="receivedItems.sanitiser"
          :ziplocs="receivedItems.ziploc"
        ></Quantity>
        <Quantity
          class="column"
          title="Remaining"
          :masks="remainingItems.mask"
          :thermometers="remainingItems.thermometer"
          :sanitisers="remainingItems.sanitiser"
          :ziplocs="remainingItems.ziploc"
        ></Quantity>
      </div>
      <div class="box has-background-black-ter box-spacing">
        <ProductTracking
          :shipped="shipped"
          :delivered="delivered"
          :finished="finishedBoxes"
        />
      </div>
      <div class="box has-background-black-ter box-spacing">
        <RequirementDelta
          :delta="currentRequirement.delta"
        />
      </div>
      <div class="box has-background-black-ter box-spacing">
        <CurrentRequirement
          :finishedPacks="currentRequirement.finishedPacks"
          :currentRequiredPacks="currentRequirement.currentRequiredPacks"
        />
      </div>
    </div>
  </section>
</template>

<script>
import Quantity from "@/components/Statistics/Quantity";
import ProductTracking from "@/components/Statistics/ProductTracking";
import CurrentRequirement from "@/components/Statistics/CurrentRequirement";
import RequirementDelta from "@/components/Statistics/RequirementDelta";
import ky from "ky";

export default {
  components: {
    Quantity,
    ProductTracking,
    CurrentRequirement,
    RequirementDelta
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
      retObj.thermometer =
        retObj.thermometer - this.finishedBoxes * this.boxThermometer;
      retObj.sanitiser =
        retObj.sanitiser - this.finishedBoxes * this.boxSanitiser;
      retObj.ziploc = retObj.ziploc - this.finishedBoxes * this.boxZiploc;
      return retObj;
    },
    currentRequirement() {

      let finishedPacks = this.finishedBoxes * this.packsPerBox;

      let elapsedHours = 0.0;

      let opStartDate = 24;
      let opStartHour = 8;
      let opStartMinute = 0;

      // let currentDate = this.currentDateObj.getDate();
      let currentDate = 24;
      let currentHour = this.currentDateObj.getHours() + 8;
      let currentMinute = this.currentDateObj.getMinutes();
      let currentSecond = this.currentDateObj.getSeconds();

      // let currentDate = 24;
      // let currentHour = 9;
      // let currentMinute = 30;
      // let currentSecond = this.currentDateObj.getSeconds();

      let numHoursInCompletedDays = 0.0;
      let numHoursInCompletedHours = 0.0;
      let numHoursInCompletedMinutes = 0.0;
      let numHoursInCompletedSeconds = 0.0;

      if (currentDate >= opStartDate) {
        let numHoursInCompletedDays = (currentDate - opStartDate) * this.workHoursPerDay;
        if (currentHour >= opStartHour) {
          if (currentHour < 8 ) {
            numHoursInCompletedHours = 0;
          }
          else if (currentHour <= 15) {
            numHoursInCompletedHours = currentHour - 8;

            numHoursInCompletedMinutes = currentMinute / 60;
            numHoursInCompletedSeconds = currentSecond / 3600;
          }
          else if (currentHour <= 22) {
            // Account for the 1 hour break
            numHoursInCompletedHours = currentHour - 8 - 1;

            numHoursInCompletedMinutes = currentMinute / 60;
            numHoursInCompletedSeconds = currentSecond / 3600;
          }
          else {
            numHoursInCompletedHours = 13;
          }
        }
      }

      elapsedHours = numHoursInCompletedDays + numHoursInCompletedHours + numHoursInCompletedMinutes + numHoursInCompletedSeconds;

      let currentRequiredPacks = Math.round(elapsedHours * this.targetBoxesPerHour)

      let delta = finishedPacks - currentRequiredPacks;


      //
      return {finishedPacks: finishedPacks, currentRequiredPacks: currentRequiredPacks, delta: delta};
      // return this.currentDateObj.getSeconds();
      // return 0;


    }
  },
  data() {
    return {
      packsPerBox: 200,
      targetBoxesPerHour: 21840,
      workHoursPerDay: 13,
      receivedItems: { mask: 0, thermometer: 0, sanitiser: 0, ziploc: 0 },
      finishedBoxes: 0,
      boxMask: 1600,
      boxThermometer: 0,
      boxSanitiser: 0,
      boxZiploc: 400,
      shipped: 0,
      delivered: 0,
      currentDateObj: new Date(),
      myInterval: null,
    };
  },
  async mounted() {
    let res = await ky.get("http://54.169.249.3:8080/getAllReceived").json();
    const data = res.Item;
    this.receivedItems.mask = data.mask;
    this.receivedItems.thermometer = data.thermometer;
    this.receivedItems.sanitiser = data.handSanitiser;
    this.receivedItems.ziploc = data.ziploc;
    res = await ky.get("http://54.169.249.3:8080/getFinished").json();
    for (const section of res) {
      this.finishedBoxes += section.quantity;
    }
    res = await ky.get("http://54.169.249.3:8080/totalShipped").json();
    this.shipped = res[0].totalBoxes;
    this.shipped = 1000;
    // this.myInterval = setInterval(function(){this.shipped = 2000}, 1000);
    this.myInterval = setInterval(() => {
      this.currentDateObj = new Date();
      console.log(this.currentDateObj)
      // console.dir(this.shipped);
    }, 1000);
    // console.log(this.d);
    // setInterval(function(){
    //     // this.d = new Date();
    //     console.log(this.d)
    //     // this.d += 1;
    // }, 1000);
  },

  // created() {
  //   setInterval(function(){
  //       // this.d = new Date();
  //       console.log(this.d)
  //       this.d += 1;
  //   }, 1000);
  // }

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
