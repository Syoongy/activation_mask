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
      <label class="label">Delivery Location</label>
      <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isDeliveryCorrect }"
          @input="validateDelivery"
          placeholder="Enter delivery ID here"
          v-model.number="deliveryId"
          step="1"
          min="1"
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
  name: "ShippedForm",
  computed: {
    canSubmit() {
      return this.qty > 0 && this.deliveryId > 0;
    },
  },
  data() {
    return {
      qty: 0,
      deliveryId: 0,
      isQtyCorrect: true,
      isDeliveryCorrect: true,
    };
  },
  methods: {
    async submitForm() {
      //submit to api here
      //Python api
      await ky.get(
        `http://supplypacking.pythonanywhere.com/add/s=${this.qty}/`
      );
      //Node api
      const res = await ky
        .post("PLC_API_ADDRESS/shipped", {
          json: {
            numBoxes: this.qty,
            deliveryLocationId: this.deliveryId,
          },
        })
        .json();
      this.$socket.client.emit("addToShipped");
      this.qty = 0;
      this.deliveryId = 0;
      this.$notify({
        group: "submitReq",
        type: "my-success",
        title: "Success!",
        text: `The ID is ${res[0].uniqueId}`,
        duration: 1000,
        max: 1,
      });
    },
    isGreaterThanZero(value) {
      return value > 0;
    },
    validateQty() {
      this.isQtyCorrect = this.isGreaterThanZero(this.qty);
    },
    validateDelivery() {
      this.isDeliveryCorrect = this.isGreaterThanZero(this.deliveryId);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
