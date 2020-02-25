<template>
  <div class="container columns is-multiline qty-container is-centered">
    <p class="title has-text-centered column is-12" :class="classObject">
      {{ title }}
    </p>
    <div class="box has-background-black-ter column has-text-centered">
      <p class="has-text-weight-bold is-size-3" :class="classObject">Masks</p>
      <p class="has-text-weight-bold is-size-2" :class="classObject">
        {{ masksTimeRemaining }} HOURS
      </p>
      <p class="is-size-4" :class="classObject">
        {{ rawMaterials.masksRemaining }} / {{ rawMaterials.masksTotal }}
      </p>
    </div>
    <!-- <div class="box has-background-black-ter column has-text-centered">
      <p class="has-text-weight-bold is-size-3" :class="classObject">
        Thermometers
      </p>
      <p class="is-size-4" :class="classObject">{{ thermometers }}</p>
    </div>
    <div class="box has-background-black-ter column has-text-centered">
      <p class="has-text-weight-bold is-size-3" :class="classObject">
        Sanitisers
      </p>
      <p class="is-size-4" :class="classObject">{{ sanitisers }}</p>
    </div> -->
    <div class="box has-background-black-ter column has-text-centered">
      <p class="has-text-weight-bold is-size-3" :class="classObject">
        Ziplocs
      </p>
      <p class="has-text-weight-bold is-size-2" :class="classObject">
        {{ ziplocsTimeRemaining }} HOURS
      </p>
      <p class="is-size-4" :class="classObject">
        {{ rawMaterials.ziplocsRemaining }} / {{ rawMaterials.ziplocsTotal }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    masksRemaining: {
      type: Number,
      required: true
    },
    masksTotal: {
      type: Number,
      required: true
    },
    ziplocsRemaining: {
      type: Number,
      required: true
    },
    ziplocsTotal: {
      type: Number,
      required: true
    },
    targetPacksPerHour: {
      type: Number,
      required: true
    }
  },
  computed: {
    classObject() {
      // return {
      //   // "has-text-warning": this.title === "Raw Materials (PLC)",
      //   // "has-text-danger": this.title !== "Received"
      //   // "has-text-warning"
      // };
      return "has-text-success";
    },
    rawMaterials(){
      // From: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
      function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      return {
        masksRemaining: numberWithCommas(this.masksRemaining),
        masksTotal: numberWithCommas(this.masksTotal),
        ziplocsRemaining: numberWithCommas(this.ziplocsRemaining),
        ziplocsTotal: numberWithCommas(this.ziplocsTotal)
      }
    },
    masksTimeRemaining() {
      return (this.masksRemaining / (this.targetPacksPerHour * 4)).toFixed(1);
    },
    ziplocsTimeRemaining() {
      return (this.ziplocsRemaining / this.targetPacksPerHour).toFixed(1);
    }
  }
};
</script>

<style scoped>
.qty-container {
  margin: 0 !important;
}
.qty-container .box.column {
  margin: 0.75rem !important;
}
.title {
  margin-top: -0.5rem !important;
  margin-bottom: -0.5rem !important;
}
</style>
