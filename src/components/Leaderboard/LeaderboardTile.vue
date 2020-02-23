<template>
  <div class="leaderboard-tile has-text-white" :class="classObject">
    <div class="content columns">
      <div class="column is-size-1 is-3 has-text-weight-bold">
        <p style="display: inline-block !important;">No. {{ rank }}</p>
      </div>
      <p class="column is-size-1 is-6 has-text-weight-bold">
        Table {{ name }}
      </p>
      <p class="column is-size-1 has-text-weight-bold">{{ qty }}/{{currentShiftBoxTarget}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rank: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
    currentShiftBoxTarget: {
      type: Number,
      required: true
    }
  },
  methods: {
    classObject() {
      // let styling = "";
      // if()
      // return styling;
    }
  }
};
</script>

<style>
.leaderboard-tile {
  margin: 0.75rem;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.23), 0 6px 6px rgba(0, 0, 0, 0.27);
}

.content p {
  margin-bottom: 0 !important;
}
</style>
