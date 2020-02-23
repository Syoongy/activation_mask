<template>
  <div class="container">
    <div class="field">
      <label class="label">Masks</label>
      <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isMaskCorrect }"
          @input="validateMask"
          placeholder="Enter no. of masks here"
          v-model.number="mask"
          step="1"
          min="0"
        />
        <p class="subtitle">{{ maskInWords }}</p>
      </div>
    </div>
    <!-- <div class="field">
      <label class="label">Thermometers</label>
      <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isThermometerCorrect }"
          @input="validateThermometer"
          placeholder="Enter no. of thermometers here"
          v-model.number="thermometer"
          step="1"
          min="0"
        />
        <p class="subtitle">{{ thermometerInWords }}</p>
      </div>
    </div>
    <div class="field">
      <label class="label">Hand Sanitisers</label>
      <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isSanitiserCorrect }"
          @input="validateSanitiser"
          placeholder="Enter no. of sanitisers here"
          v-model.number="sanitiser"
          step="1"
          min="0"
        />
        <p class="subtitle">{{ sanitiserInWords }}</p>
      </div>
    </div> -->
    <div class="field">
      <label class="label">Ziplocs</label>
      <div class="control">
        <input
          type="number"
          :class="{ input: true, 'is-danger': !isZiplocCorrect }"
          @input="validateZiploc"
          placeholder="Enter quantity here"
          v-model.number="ziploc"
          step="1"
          min="0"
        />
        <p class="subtitle">{{ ziplocInWords }}</p>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button
          class="button is-success is-fullwidth"
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
          <p class="has-text-weight-bold is-size-4">Masks: {{ mask }}</p>
          <p class="has-text-weight-bold is-size-4">Ziplocs: {{ ziploc }}</p>
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
import converter from "number-to-words";
import ky from "ky";
export default {
  name: "ReceivedForm",
  computed: {
    canSubmit() {
      this.validateZiploc();
      return (
        this.isMaskCorrect &&
        this.isThermometerCorrect &&
        this.isSanitiserCorrect &&
        this.isZiplocCorrect
      );
    },
    maskInWords() {
      let retString = "error";
      if (this.mask !== "") retString = converter.toWords(this.mask);
      return retString;
    },
    thermometerInWords() {
      let retString = "error";
      if (this.thermometer !== "")
        retString = converter.toWords(this.thermometer);
      return retString;
    },
    sanitiserInWords() {
      let retString = "error";
      if (this.sanitiser !== "") retString = converter.toWords(this.sanitiser);
      return retString;
    },
    ziplocInWords() {
      let retString = "error";
      if (this.ziploc !== "") retString = converter.toWords(this.ziploc);
      return retString;
    }
  },
  data() {
    return {
      mask: 0,
      thermometer: 0,
      sanitiser: 0,
      ziploc: 0,
      isMaskCorrect: true,
      isThermometerCorrect: true,
      isSanitiserCorrect: true,
      isZiplocCorrect: true,
      modalIsActive: false
    };
  },
  methods: {
    toggleModal() {
      this.modalIsActive = !this.modalIsActive;
    },
    async submitForm() {
      this.toggleModal;
      //submit to api here
      const dataString = encodeURI(
        `m=${this.mask}&t=${this.thermometer}&h=${this.sanitiser}&z=${this.ziploc}`
      );
      //Python api
      await ky.get(
        `http://supplypacking.pythonanywhere.com/add/${dataString}/`
      );
      //Node api
      await ky.post("http://54.254.221.3/:8080/addReceived", {
        json: {
          mask: this.mask,
          thermometer: this.thermometer,
          ziploc: this.ziploc,
          handSanitiser: this.sanitiser
        }
      });
      this.$socket.client.emit("addToReceived");
      this.mask = 0;
      this.thermometer = 0;
      this.sanitiser = 0;
      this.ziploc = 0;
      this.$notify({
        group: "submitReq",
        type: "my-success",
        title: "Success!",
        text: "Input has been submitted!",
        duration: 1000,
        max: 1
      });
    },
    isGreaterThanEqualToZero(value) {
      const parsedValue = parseInt(value);
      return parsedValue >= 0 && parsedValue <= 10000000;
    },
    validateThermometer() {
      this.isThermometerCorrect = this.isGreaterThanEqualToZero(
        this.thermometer
      );
    },
    validateMask() {
      this.isMaskCorrect = this.isGreaterThanEqualToZero(this.mask);
    },
    validateSanitiser() {
      this.isSanitiserCorrect = this.isGreaterThanEqualToZero(this.sanitiser);
    },
    validateZiploc() {
      this.isZiplocCorrect = this.isGreaterThanEqualToZero(this.ziploc);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
