<template>
  <section class="section">
    <h1 class="title">Finished Products</h1>
    <FinishedForm />
  </section>
</template>

<script>
// @ is an alias to /src
import FinishedForm from "@/components/FinishedForm.vue";

export default {
  name: "finished",
  components: {
    FinishedForm
  }
};
</script>
