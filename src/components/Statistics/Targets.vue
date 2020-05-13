<template>
  <div
    id="tracking-container"
    class="container columns is-multiline is-centered"
  >
    <div
      class="column box has-background-black-ter has-text-centered has-text-warning"
    >
      <p class="has-text-weight-bold is-size-3">Shipped</p>
      <p class="is-size-4">{{ shipped }}</p>
    </div>
    <!-- <div
      class="column box has-background-black-ter has-text-centered has-text-success"
    >
      <p class="has-text-weight-bold is-size-3">Delivered</p>
      <p class="is-size-4">{{ delivered }}</p>
    </div> -->
    <div
      class="column box has-background-black-ter has-text-centered has-text-success"
    >
      <p class="has-text-weight-bold is-size-3">Finished</p>
      <p class="is-size-4">{{ finished }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    finished: {
      type: Number,
      required: true,
    },
  },
  sockets: {
    shippedValues(val) {
      this.shipped = val[0].totalBoxes;
    },
  },
  data() {
    return {
      targetNoBoxes: 0,
    };
  },
  methods: {
    calculateTargets(targetBoxes, numFinished, numTables) {
      const d = new Date();

      let currentDate = d.getDate();
      let currentHour = d.getHours();
      let currentMinute = d.getMinutes();

      // Start counting from start of operation
      if (currentDate < 24) {
        currentDate = 24;
        currentHour = 8;
        currentMinute = 0;
      }

      const DAILY_WORK_HOURS = 13;
      const COMPLETE_DATE = 26;
      const COMPLETE_HOUR = 22;

      const daysRemaining = COMPLETE_DATE - currentDate;
      let fullHoursRemainingToday, partialHoursRemainingToday;
      if (currentHour >= 22) {
        fullHoursRemainingToday = 0;
        partialHoursRemainingToday = 0.0;
      } else if (currentHour >= 16) {
        fullHoursRemainingToday = COMPLETE_HOUR - currentHour - 1;
        partialHoursRemainingToday = (60 - currentMinute) / 60;
      } else if (currentHour >= 8) {
        // Take into account the 1 hour break from 3pm to 4pm
        fullHoursRemainingToday = COMPLETE_HOUR - currentHour - 2;
        partialHoursRemainingToday = (60 - currentMinute) / 60;
      } else {
        fullHoursRemainingToday = 13;
        partialHoursRemainingToday = 0.0;
      }

      const totalHoursRemaining =
        daysRemaining * DAILY_WORK_HOURS +
        fullHoursRemainingToday +
        partialHoursRemainingToday;

      const boxesToTarget = targetBoxes - numFinished;

      const targetPerHour = boxesToTarget / totalHoursRemaining;

      const targetPerShift = (boxesToTarget / totalHoursRemaining) * 7;

      const targetPerTablePerHour = targetPerHour / numTables;

      const targetPerTablePerShift = targetPerShift / numTables;

      return {
        targetPerHour: targetPerHour,
        targetPerShift: targetPerShift,
        targetPerTablePerHour: targetPerTablePerHour,
        targetPerTablePerShift: targetPerTablePerShift,
      };
    },
  },
};
</script>

<style>
#tracking-container {
  margin: auto;
}
#tracking-container .box.column {
  margin: 0.75rem !important;
}
</style>
