<template>
  <div class="leaderboard-tile">
    <div class="content columns">
      <p class="column is-size-4 is-3 has-text-weight-bold">No. {{ rank }}</p>
      <p class="column is-size-4 is-6 has-text-weight-bold">
        Station {{ name }}
      </p>
      <p class="column is-size-4 has-text-weight-bold">{{ qty }}/18</p>
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
