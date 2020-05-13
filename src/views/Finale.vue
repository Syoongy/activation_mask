<template>
  <div class="section">
    <div class="is-flex" id="finale-container">
      <FinaleCounter />
    </div>
  </div>
</template>

<script>
import FinaleCounter from "@/components/FinaleCounter";
export default {
  components: {
    FinaleCounter,
  },
};
</script>

<style scoped>
.section {
  overflow-x: hidden;
  min-height: 100vh;
  background-color: #212121 !important;
}

#finale-container {
  height: 80vh;
  justify-content: center;
  align-items: center;
}
</style>
