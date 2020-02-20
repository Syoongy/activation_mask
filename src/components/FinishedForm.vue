<template>
  <div class="container">
    <label class="label">Table</label>
    <div class="field is-grouped">
      <!-- <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isNameCorrect }"
          @input="validateName"
          placeholder="Enter table here"
          v-model.number="name"
          maxlength="1"
        />
      </div> -->
      <div class="control">
        <div class="select">
          <select name="stationAlpha" v-model="sAlpha">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="I">I</option>
            <option value="J">J</option>
            <option value="K">K</option>
          </select>
        </div>
      </div>
      <div class="control">
        <div class="select">
          <select name="stationNum" v-model="sNum">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>
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
      return this.qty >= 1 && this.qty <= 50;
    },
    name() {
      return this.sAlpha + this.sNum;
    }
  },
  data() {
    return {
      sAlpha: "A",
      sNum: "1",
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
      await ky.post("http://54.169.249.3:8080/addFinished", {
        json: {
          stationNo: this.name,
          quantity: this.qty
        }
      });
      this.$socket.client.emit("addToStationNo", this.name);
      this.name = null;
      this.qty = 1;
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
