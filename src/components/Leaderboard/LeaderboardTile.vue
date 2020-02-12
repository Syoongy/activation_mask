<template>
  <div class="leaderboard-tile has-text-white">
    <div class="content columns">
      <p class="column is-3">No. {{ rank }}</p>
      <p class="column is-6">Station {{ name }}</p>
      <p class="column">{{ qty }}/200</p>
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
  width: 60%;
  margin: 0.5rem;
  background-color: #393e46;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.23), 0 6px 6px rgba(0, 0, 0, 0.27);
}

.content p {
  margin-bottom: 0 !important;
}
</style>
