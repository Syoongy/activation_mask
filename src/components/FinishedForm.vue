<template>
  <div class="container">
    <div class="field">
      <label class="label">Section No.</label>
      <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isNameCorrect }"
          @input="validateName"
          placeholder="Enter section no. here"
          v-model.number="name"
          maxlength="1"
        />
      </div>
    </div>
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
          min="1"
          max="50"
        />
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button
          class="button is-fullwidth"
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
  name: "FinishedForm",
  computed: {
    canSubmit() {
      return this.name > 0 && this.qty >= 1 && this.qty <= 50;
    }
  },
  data() {
    return {
      name: null,
      qty: 1,
      isNameCorrect: true,
      isQtyCorrect: true
    };
  },
  methods: {
    goToForm() {
      this.$router.push({ path: `/about/${this.name}` });
    },
    async submitForm() {
      //submit to api here
      //Python api
      const res = await ky.get(
        `http://supplypacking.pythonanywhere.com/add_production/${this.name}/${this.qty}/`
      );
      //Node api
      await ky.post("0.0.0.0:8080/addFinished", {
        json: {
          stationNo: this.name,
          quantity: this.qty
        }
      });
      console.dir(res);
      this.$notify({
        group: "submitReq",
        type: "my-success",
        title: "Success!",
        text: "Input has been submitted!",
        duration: 1000,
        max: 1
      });
    },
    validateName() {
      this.isNameCorrect = parseInt(this.name) > 0;
    },
    validateQty() {
      this.isQtyCorrect = this.qty > 0 && this.qty < 51;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
