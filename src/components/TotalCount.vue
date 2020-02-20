<template>
  <div id="count-container">
    <p class="has-text-weight-bold is-size-2">
      {{ boxCompleted }} / {{ boxTarget }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    boxTarget: {
      type: Number,
      required: true
    },
    boxCompleted: {
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
#count-container {
  margin: 2rem;
}
</style>
