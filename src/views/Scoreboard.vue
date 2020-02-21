<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div
          class="box column"
          :class="classObject(alpha)"
          v-for="(alpha, idx) in alphaList"
          :key="idx"
        >
          <p
            class="has-text-centered has-text-weight-bold is-size-1 has-text-white"
          >
            {{ alpha }}
          </p>
        </div>
      </div>
      <Board :stations="stations" />
    </div>
  </div>
</template>

<script>
import Board from "@/components/Scoreboard/Board";
export default {
  components: {
    Board
  },
  methods: {
    classObject(letter) {
      let styling = "";
      switch (letter) {
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
      return styling;
    }
  },
  data() {
    return {
      stations: [],
      alphaList: ["", "A", "B", "C", "D", "E", "F"]
    };
  },
  mounted() {
    const alphaList = ["A", "B", "C", "D", "E", "F"];
    const numList = ["1", "2", "3", "4", "5", "6", "7"];
    const numberList = [];
    numList.forEach(ele =>
      numberList.push({ stationName: ele, isStation: false })
    );
    this.stations.push(numberList);
    for (let i = 0; i < alphaList.length; i++) {
      const listToBePushed = [];
      const letter = alphaList[i];
      for (let w = 0; w < numList.length; w++) {
        const num = numList[w];
        listToBePushed.push({
          letter: letter,
          num: num,
          quantity: 0,
          isStation: true
        });
      }
      this.stations.push(listToBePushed);
    }
  }
};
</script>

<style scoped>
.is-size-1 {
  line-height: 4.5rem !important;
  font-size: 4rem !important;
}

.box {
  margin: 0 0.2rem 0.75rem;
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
