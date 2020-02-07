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
      </div>
    </div>
    <div class="field">
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
      </div>
    </div>
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
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button
          class="button is-success is-fullwidth"
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
  name: "ReceivedForm",
  computed: {
    canSubmit() {
      return (
        this.isMaskCorrect &&
        this.isThermometerCorrect &&
        this.isSanitiserCorrect &&
        this.isZiplocCorrect
      );
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
      isZiplocCorrect: true
    };
  },
  methods: {
    async submitForm() {
      //submit to api here
      const dataString = encodeURI(
        `m=${this.mask}&t=${this.thermometer}&h=${this.sanitiser}&z=${this.ziploc}`
      );
      const res = await ky.get(
        `http://supplypacking.pythonanywhere.com/add/${dataString}/`
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
    isGreaterThanEqualToZero(value) {
      return parseInt(value) >= 0;
    },
    validateThermometer() {
      this.isThermometerCorrect = this.isGreaterThanEqualToZero(
        this.thermometer
      );
      console.log(this.isGreaterThanEqualToZero(this.thermometer));
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
