<template>
  <div class="container">
    <div class="box has-background-black-ter">
      <p class="has-text-finale has-text-success has-text-centered">3992</p>
    </div>
  </div>
</template>

<script>
import { confetti } from "@/plugins/confetti.js";
export default {
  mounted() {
    confetti.start();
  }
};
</script>

<style>
.has-text-finale {
  font-size: 8rem;
}
</style>
