<template>
  <div
    id="tracking-container"
    class="container columns is-multiline is-centered"
  >
    <div
      class="column box has-background-black-ter has-text-centered has-text-warning"
    >
      <p class="has-text-weight-bold is-size-3">Storage</p>
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
    shipped: {
      type: Number,
      required: true
    },
    delivered: {
      type: Number,
      required: true
    },
    finished: {
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
  margin: 1rem !important;
}
#tracking-container .box.column {
  margin: 0.75rem !important;
}
</style>
