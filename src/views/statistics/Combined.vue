<template>
  <section id="quantity-section">
    <div class="is-flex" id="quantity-container">
      <div class="box has-background-black-ter box-spacing">
        <RequirementDelta :delta="currentRequirement.delta" />
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
import CurrentRequirement from "@/components/Statistics/CurrentRequirement";
import RequirementDelta from "@/components/Statistics/RequirementDelta";
import ky from "ky";

export default {
  components: {
    CurrentRequirement,
    RequirementDelta
  },
  sockets: {
    finishedValues(val) {
      let newFinishedBoxesValues = 0;
      for (const section of val) {
        newFinishedBoxesValues += section.quantity;
      }
      this.finishedBoxes = newFinishedBoxesValues;
    }
  },
  computed: {
    currentRequirement() {
      const finishedPacks = this.finishedBoxes * this.packsPerBox;

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
        elapsedHours * this.targetBoxesPerHour
      );

      const delta = finishedPacks - currentRequiredPacks;

      //
      return {
        finishedPacks: finishedPacks,
        currentRequiredPacks: currentRequiredPacks,
        delta: delta
      };
    }
  },
  data() {
    return {
      packsPerBox: 200,
      targetBoxesPerHour: 21840,
      workHoursPerDay: 13,
      finishedBoxes: 0,
      currentDateObj: new Date(),
      myInterval: null
    };
  },
  async mounted() {
    const res = await ky.get("http://54.169.249.3:8080/getFinished").json();
    for (const section of res) {
      this.finishedBoxes += section.quantity;
    }
    this.myInterval = setInterval(() => {
      this.currentDateObj = new Date();
    }, 1000);
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
