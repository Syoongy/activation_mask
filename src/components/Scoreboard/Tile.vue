<template>
  <div class="box" :class="classObject">
    <p
      class="has-text-weight-bold is-size-1 has-text-centered"
      v-if="!station.isStation"
    >
      {{ station.stationName }}
    </p>
    <p
      class="is-size-1 has-text-centered has-text-weight-bold has-text-white"
      v-else
    >
      {{ station.quantity }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    station: {
      type: Object,
      required: true
    }
  },
  computed: {
    classObject() {
      let styling = "";
      if (this.station.isStation) {
        switch (this.station.letter) {
          case "A":
            styling = "has-background-a";
            break;
          case "B":
            styling = "has-background-b";
            break;
          case "C":
            styling = "has-background-c";
            break;
          case "D":
            styling = "has-background-d";
            break;
          case "E":
            styling = "has-background-danger";
            break;
          case "F":
            styling = "has-background-black has-text-white";
            break;
          case "G":
            styling = "has-background-success";
            break;
          default:
            break;
        }
      } else {
        styling = "has-background-grey has-text-white";
      }
      return styling;
    }
  }
};
</script>

<style scoped>
.is-size-1 {
  line-height: 4.5rem !important;
  font-size: 5rem !important;
}

.box {
  padding: 0.4rem;
  margin-bottom: 1rem;
}

.has-background-a {
  background-color: #12005e !important;
}

.has-background-b {
  background-color: #003d00 !important;
}

.has-background-c {
  background-color: #002171 !important;
}

.has-background-d {
  background-color: #ac1900 !important;
}
</style>
