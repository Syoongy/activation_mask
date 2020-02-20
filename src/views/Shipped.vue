<template>
  <section class="section">
    <h1 class="title">Storage Products</h1>
    <ShippedForm />
  </section>
</template>

<script>
// @ is an alias to /src
import ShippedForm from "@/components/ShippedForm.vue";

export default {
  name: "shipped",
  components: {
    ShippedForm
  }
};
</script>
