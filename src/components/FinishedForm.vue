<template>
  <div class="container">
    <div class="field">
      <label class="label">Session</label>
      <div class="field">
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select name="session" v-model="session">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <label class="label">Table</label>
    <div class="field is-grouped">
      <div class="control is-expanded">
        <div class="select is-fullwidth">
          <select name="stationAlpha" v-model="sAlpha">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
          </select>
        </div>
      </div>
      <div class="control is-expanded">
        <div class="select is-fullwidth">
          <select name="stationNum" v-model="sNum">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button
          class="button is-fullwidth"
          :class="{ 'is-success': canSubmit, 'is-danger': !canSubmit }"
          :disabled="!canSubmit"
          @click="toggleModal"
        >
          Submit
        </button>
      </div>
    </div>
    <div class="modal" :class="{ 'is-active': modalIsActive }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Submit</p>
        </header>
        <section class="modal-card-body">
          <p class="title">Submission for</p>
          <p class="has-text-weight-bold is-size-4">
            {{ name }}
          </p>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" @click="toggleModal">Cancel</button>
          <button class="button is-success" @click="submitForm">Confirm</button>
        </footer>
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
      const name = `${this.session}-${this.sAlpha}${this.sNum}`;
      return name;
    }
  },
  data() {
    return {
      sAlpha: "A",
      sNum: "1",
      session: "1",
      qty: 1,
      isNameCorrect: true,
      isQtyCorrect: true,
      modalIsActive: false
    };
  },
  methods: {
    toggleModal() {
      this.modalIsActive = !this.modalIsActive;
    },
    async submitForm() {
      this.toggleModal();
      //submit to api here
      //Python api
      await ky.get(
        `http://supplypacking.pythonanywhere.com/add_production/${this.name}/${this.qty}/`
      );
      //Node api
      const res = await ky
        .post("http://54.169.249.3:8080/addFinished", {
          json: {
            stationNo: this.name,
            quantity: this.qty
          }
        })
        .json();
      this.$socket.client.emit("addToStationNo", this.name);
      this.sAlpha = "A";
      this.sNum = "1";
      this.session = "1";
      this.qty = 1;
      this.$notify({
        group: "submitReq",
        type: "my-success",
        title: "Success!",
        text: `The ID is ${res[0].uniqueId}`,
        duration: -1000,
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
