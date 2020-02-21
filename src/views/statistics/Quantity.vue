<template>
  <section id="quantity-section">
    <div class="is-flex" id="quantity-container">
      <div class="box has-background-black-ter box-spacing columns">
        <Quantity
          class="column"
          title="Received"
          :masks="receivedItems.mask"
          :thermometers="receivedItems.thermometer"
          :sanitisers="receivedItems.sanitiser"
          :ziplocs="receivedItems.ziploc"
        ></Quantity>
        <Quantity
          class="column"
          title="Remaining"
          :masks="remainingItems.mask"
          :thermometers="remainingItems.thermometer"
          :sanitisers="remainingItems.sanitiser"
          :ziplocs="remainingItems.ziploc"
        ></Quantity>
      </div>
      <div class="box has-background-black-ter box-spacing">
        <ProductTracking
          :shipped="shipped"
          :delivered="delivered"
          :finished="finishedBoxes"
        />
      </div>
    </div>
  </section>
</template>

<script>
import Quantity from "@/components/Statistics/Quantity";
import ProductTracking from "@/components/Statistics/ProductTracking";
import ky from "ky";

export default {
  components: {
    Quantity,
    ProductTracking
  },
  sockets: {
    receivedValues(val) {
      const data = val.Item;
      this.receivedItems.mask = data.mask;
      this.receivedItems.thermometer = data.thermometer;
      this.receivedItems.sanitiser = data.handSanitiser;
      this.receivedItems.ziploc = data.ziploc;
    },
    finishedValues(val) {
      let newFinishedBoxesValues = 0;
      for (const section of val) {
        newFinishedBoxesValues += section.quantity;
      }
      this.finishedBoxes = newFinishedBoxesValues;
    }
  },
  computed: {
    remainingItems() {
      const retObj = { ...this.receivedItems };
      retObj.mask = retObj.mask - this.finishedBoxes * this.boxMask;
      retObj.thermometer =
        retObj.thermometer - this.finishedBoxes * this.boxThermometer;
      retObj.sanitiser =
        retObj.sanitiser - this.finishedBoxes * this.boxSanitiser;
      retObj.ziploc = retObj.ziploc - this.finishedBoxes * this.boxZiploc;
      return retObj;
    }
  },
  data() {
    return {
      receivedItems: { mask: 0, thermometer: 0, sanitiser: 0, ziploc: 0 },
      finishedBoxes: 0,
      boxMask: 1600,
      boxThermometer: 0,
      boxSanitiser: 0,
      boxZiploc: 400,
      shipped: 0,
      delivered: 0
    };
  },
  async mounted() {
    let res = await ky.get("http://54.169.249.3:8080/getAllReceived").json();
    const data = res.Item;
    this.receivedItems.mask = data.mask;
    this.receivedItems.thermometer = data.thermometer;
    this.receivedItems.sanitiser = data.handSanitiser;
    this.receivedItems.ziploc = data.ziploc;
    res = await ky.get("http://54.169.249.3:8080/getFinished").json();
    for (const section of res) {
      this.finishedBoxes += section.quantity;
    }
    res = await ky.get("http://54.169.249.3:8080/totalShipped").json();
    this.shipped = res[0].totalBoxes;
  }
};
</script>

<style scoped>
.box:not(:last-child) {
  margin-bottom: 0;
}

#quantity-section {
  background-color: #212121 !important;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}

#quantity-container {
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.box-spacing {
  margin-bottom: 1rem !important;
  width: 100%;
}
</style>
