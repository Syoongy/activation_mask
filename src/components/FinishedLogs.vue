<template>
  <div class="box" id="finishedlogs-container">
    <p class="title is-5">Previous 5 Submissions</p>
    <transition-group name="log-list">
      <div class="box log" v-for="log in logs" :key="log.id">
        <p>Table: {{ log.stationNo }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ky from "ky";
export default {
  sockets: {
    lastFewFinishedValues(val) {
      this.logs = val;
    }
  },
  data() {
    return {
      logs: []
    };
  },
  methods: {
    changeList() {
      this.logs = [];
    }
  },
  async mounted() {
    const res = await ky
      .get("http://54.169.249.3:8080/getLastFewFinished")
      .json();
    this.logs = res;
  }
};
</script>

<style scoped>
#finishedlogs-container {
  margin-top: 2rem;
}
.box {
  margin-bottom: 0.3rem;
}

.log-list-enter,
.log-list-leave-to {
  opacity: 0;
}

.log-list-leave,
.log-list-enter-to {
  opacity: 1;
}

.log-list-enter-active,
.log-list-leave-active {
  transition: opacity 300ms;
}
</style>
