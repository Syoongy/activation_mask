<template>
  <section class="section">
    <h1>This is {{ id }}'s page</h1>
  </section>
</template>

<script>
export default {
  data() {
    return {
      id: ""
    };
  },
  mounted() {
    this.id = this.$route.params.id;
  }
};
</script>

<style></style>
