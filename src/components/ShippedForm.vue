<template>
  <div class="container">
    <div class="field">
      <label class="label">Quantity</label>
      <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isQtyCorrect }"
          @input="validateQty"
          placeholder="Enter quantity here"
          v-model.number="qty"
          step="1"
          min="0"
        />
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button
          class="button  is-fullwidth"
          :class="{ 'is-success': canSubmit, 'is-danger': !canSubmit }"
          :disabled="!canSubmit"
          @click="submitForm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ky from "ky";
export default {
  name: "ShippedForm",
  computed: {
    canSubmit() {
      return this.qty > 0;
    }
  },
  data() {
    return {
      qty: 0,
      isQtyCorrect: true
    };
  },
  methods: {
    async submitForm() {
      //submit to api here
      const res = await ky.get(
        `http://supplypacking.pythonanywhere.com/add/s-${this.qty}/`
      );
      console.dir(res);
      this.$notify({
        group: "submitReq",
        title: "Success!",
        text: "Input has been submitted!",
        duration: 1500,
        max: 1
      });
    },
    isGreaterThanZero(value) {
      return value > 0;
    },
    validateQty() {
      this.isQtyCorrect = this.isGreaterThanZero(this.qty);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
