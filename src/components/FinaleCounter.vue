<template>
  <div class="container">
    <div class="box has-background-black-ter">
      <p class="is-size-4 has-text-white has-text-centered is-italic">
        total packed:
      </p>
      <p class="has-text-finale has-text-white has-text-centered">
        {{ total }}
      </p>
      <p class="is-size-4 has-text-success has-text-centered is-italic">
        goal:
      </p>
      <p class="has-text-finale has-text-success has-text-centered">3992</p>
    </div>
  </div>
</template>

<script>
import { confetti } from "@/plugins/confetti.js";
import ky from "ky";
export default {
  sockets: {
    totalFinishedValues(val) {
      this.total = val.totalQuantity;
      if (this.total >= 3992) {
        confetti.start();
      }
    },
  },
  data() {
    return {
      total: 0,
      isStart: false,
    };
  },
  async mounted() {
    const res = await ky.get("PLC_API_ADDRESS/getTotalFinished").json();
    this.total = res.totalQuantity;
    if (this.total >= 3992) {
      confetti.start();
    }
  },
};
</script>

<style>
.has-text-finale {
  line-height: 8rem;
  font-size: 9rem;
}
</style>
