<template>
  <div
    id="tracking-container"
    class="container columns is-multiline is-centered"
  >
    <div
      class="column box has-background-black-ter has-text-centered has-text-white"
    >
      <p class="has-text-weight-bold is-size-2">{{title}}</p>
      <p class="has-text-weight-bold is-size-1">{{ delta }}</p>
      <p class="has-text-weight-bold is-size-4">Produced: {{ finishedPacks }} // Current Target: {{requiredPacks}} </p>
    </div>
    <!-- <div
      class="column box has-background-black-ter has-text-centered has-text-success"
    >
      <p class="has-text-weight-bold is-size-3">Delivered</p>
      <p class="is-size-4">{{ delivered }}</p>
    </div> -->
    <!-- <div
      class="column box has-background-black-ter has-text-centered has-text-warning"
    >
      <p class="has-text-weight-bold is-size-3">Current Required Packs</p>
      <p class="is-size-4">{{ currentRequiredPacks }}</p>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    delta: {
      type: Number,
      required: true
    },
    finishedPacks: {
      type: Number,
      required: true
    },
    requiredPacks: {
      type: Number,
      required: true
    }
  },
  sockets: {
    shippedValues(val) {
      this.shipped = val[0].totalBoxes;
    }
  }
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
