<template>
  <div class="container columns is-multiline qty-container is-centered">
    <div class="box has-background-black-ter column has-text-centered">
      <p class="has-text-weight-bold is-size-3" :class="classObject">{{titlePLC}}</p>
      <p class="has-text-weight-bold is-size-2" :class="classObject">
        {{ deltaPLC }}
      </p>
      <p class="is-size-4" :class="classObject">
        {{ producedPLC }} // {{ targetPLC }}
      </p>
    </div>
    <div class="box has-background-black-ter column has-text-centered">
      <p class="has-text-weight-bold is-size-3" :class="classObject">
        {{titleSAFTI}}
      </p>
      <p class="has-text-weight-bold is-size-2" :class="classObject">
        {{ deltaSAFTI }}
      </p>
      <p class="is-size-4" :class="classObject">
        {{ producedSAFTI }} / {{ targetSAFTI }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titlePLC: {
      type: String,
      required: true
    },
    titleSAFTI: {
      type: String,
      required: true
    },
    deltaPLC: {
      type: String,
      required: true
    },
    producedPLC: {
      type: String,
      required: true
    },
    targetPLC: {
      type: String,
      required: true
    },
    deltaSAFTI: {
      type: String,
      required: true
    },
    producedSAFTI: {
      type: String,
      required: true
    },
    targetSAFTI: {
      type: String,
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
      return "has-text-white";
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

<style>
.qty-container {
  margin: 1rem !important;
}
.qty-container .box.column {
  margin: 0.75rem !important;
}
</style>
