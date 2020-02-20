<template>
  <div class="container columns is-multiline qty-container is-centered">
    <p class="title has-text-centered column is-12" :class="classObject">
      {{ title }}
    </p>
    <div class="box has-background-black-ter column has-text-centered">
      <p class="has-text-weight-bold is-size-3" :class="classObject">Masks</p>
      <p class="is-size-4" :class="classObject">{{ masks }}</p>
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
      <p class="is-size-4" :class="classObject">{{ ziplocs }}</p>
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
    masks: {
      type: Number,
      required: true
    },
    thermometers: {
      type: Number,
      required: true
    },
    sanitisers: {
      type: Number,
      required: true
    },
    ziplocs: {
      type: Number,
      required: true
    }
  },
  computed: {
    classObject() {
      return {
        "has-text-warning": this.title === "Received",
        "has-text-danger": this.title !== "Received"
      };
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
