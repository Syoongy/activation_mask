<template>
  <section class="section">
    <h1 class="title">Finished Products</h1>
    <Progress />
  </section>
</template>

<script>
// @ is an alias to /src
import Progress from "@/components/Progress.vue";

export default {
  name: "finished",
  components: {
    Progress
  }
};
</script>
