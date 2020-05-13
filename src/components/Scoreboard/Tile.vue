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
      required: true,
    },
  },
  computed: {
    classObject() {
      let styling = "";
      if (this.station.isStation) {
        switch (this.station.letter) {
          case "A":
            styling = "wolf";
            break;
          case "B":
            styling = "wolf-alternate";
            break;
          case "C":
            styling = "wolf";
            break;
          case "D":
            styling = "wolf-alternate";
            break;
          case "E":
            styling = "wolf";
            break;
          case "F":
            styling = "bear";
            break;
          case "G":
            styling = "bear-alternate";
            break;
          case "H":
            styling = "bear";
            break;
          case "I":
            styling = "bear-alternate";
            break;
          case "J":
            styling = "bear";
            break;
          default:
            break;
        }
      } else {
        styling = "has-background-grey has-text-white";
      }
      return styling;
    },
  },
};
</script>

<style scoped>
.is-size-1 {
  line-height: 3.5rem !important;
  font-size: 3.5rem !important;
}

.box {
  padding: 0.4rem;
  margin-bottom: 1rem;
}

.wolf {
  background-color: #002f6c !important;
}

.wolf-alternate {
  background-color: #01579b !important;
}

.bear {
  background-color: #b71c1c !important;
}

.bear-alternate {
  background-color: #f05545 !important;
}
</style>
