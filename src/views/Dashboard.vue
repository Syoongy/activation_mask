<template>
  <section class="section">
    <div class="container">
      <Progress />
    </div>
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
