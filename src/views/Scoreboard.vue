<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-1"></div>
        <div class="box column wolf">
          <p
            class="has-text-centered has-text-weight-bold is-size-1 has-text-white"
          >
            WOLVES ({{ this.sectorTotals.wolvesTotal }})
          </p>
        </div>
        <div class="box column bear">
          <p
            class="has-text-centered has-text-weight-bold is-size-1 has-text-white"
          >
            BEARS ({{ this.sectorTotals.bearsTotal }})
          </p>
        </div>
      </div>
      <div class="columns">
        <div class="box column"></div>
        <div
          class="box column"
          :class="classObject(alpha.letter)"
          v-for="(alpha, idx) in alphaList"
          :key="idx"
        >
          <p
            class="has-text-centered has-text-weight-bold is-size-1 has-text-white"
          >
            {{ alpha.letter }}
          </p>
          <p
            class="has-text-centered has-text-weight-bold is-size-1 has-text-white"
          >
            {{ alpha.total }}
          </p>
        </div>
      </div>
      <Board :stations="stations" />
    </div>
  </div>
</template>

<script>
import Board from "@/components/Scoreboard/Board";
import getCurrentShift from "@/plugins/getCurrentShift";
import ky from "ky";
export default {
  components: {
    Board
  },
  sockets: {
    updatedStationQty(val) {
      for (let i = 1; i < this.stations.length; i++) {
        const stationColumn = this.stations[i];
        for (const station of stationColumn) {
          const name = station.letter + station.num;
          if (name === val.id.split("-")[1]) {
            station.quantity = val.qty;
            const alpha = this.alphaList.find(
              ele => ele.letter === station.letter
            );
            alpha.total += 1;
            break;
          }
        }
      }
    }
  },
  computed: {
    sectorTotals() {
      let wolvesTotal = 0;
      let bearsTotal = 0;
      for (let i = 0; i < 5; i++) {
        wolvesTotal += this.alphaList[i].total;
      }
      for (let i = 5; i < 10; i++) {
        bearsTotal += this.alphaList[i].total;
      }
      return { wolvesTotal: wolvesTotal, bearsTotal: bearsTotal };
    }
  },
  data() {
    return {
      stations: [],
      alphaList: [
        { letter: "A", total: 0 },
        { letter: "B", total: 0 },
        { letter: "C", total: 0 },
        { letter: "D", total: 0 },
        { letter: "E", total: 0 },
        { letter: "F", total: 0 },
        { letter: "G", total: 0 },
        { letter: "H", total: 0 },
        { letter: "I", total: 0 },
        { letter: "J", total: 0 }
      ],
      nextPageTimeout: null
    };
  },
  async mounted() {
    const res = await ky.get("http://54.254.221.3:8080/getFinished").json();
    const currShift = getCurrentShift();
    const currShiftList = this.getCurrShiftList(res, currShift);
    const numList = ["1", "2", "3", "4", "5"];
    const numberList = [];
    numList.forEach(ele =>
      numberList.push({ stationName: ele, isStation: false })
    );
    this.stations.push(numberList);
    for (let i = 0; i < this.alphaList.length; i++) {
      const listToBePushed = [];
      const letter = this.alphaList[i].letter;
      for (let w = 0; w < numList.length; w++) {
        const num = numList[w];
        let qty = 0;
        const foundShift = currShiftList.find(
          ele => ele.stationNo[0] === letter && ele.stationNo[1] === num
        );
        if (foundShift) {
          qty = foundShift.quantity;
        }
        this.alphaList[i].total += qty;
        listToBePushed.push({
          letter: letter,
          num: num,
          quantity: qty,
          isStation: true
        });
      }
      this.stations.push(listToBePushed);
    }
    this.nextPageTimeout = setTimeout(() => {
      window.location.href =
        "http://54.169.249.3:3000/statistics/saftiCombinedHall";
    }, 30000);
  },
  beforeDestroy() {
    this.nextPageTimeout = null;
  },
  methods: {
    updateStationList(val) {
      for (const station of this.stations) {
        if (station.stationNo === val.id) {
          station.quantity = val.qty;
        }
      }
    },
    classObject(letter) {
      let styling = "";
      switch (letter) {
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
      return styling;
    },
    getCurrShiftList(allFinished, currShift) {
      const retList = [];
      for (const shiftItem of allFinished) {
        const stationNameSplit = shiftItem.stationNo.split("-");
        const isCurrShift = stationNameSplit[0] === currShift;
        if (isCurrShift)
          retList.push({
            stationNo: stationNameSplit[1],
            quantity: shiftItem.quantity
          });
      }
      return retList;
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
