<template>
  <section class="section">
    <h1 class="title">Received Products</h1>
    <ReceivedForm />
  </section>
</template>

<script>
// @ is an alias to /src
import ReceivedForm from "@/components/ReceivedForm.vue";

export default {
  name: "Received",
  components: {
    ReceivedForm
  }
};
</script>
