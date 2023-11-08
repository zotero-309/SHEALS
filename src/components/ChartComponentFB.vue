<template>
  <div>
    <apexchart type="bar" :options="chartOptions" :series="chartData" v-if="dataready" />
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { db } from '../firebase/index.js';
import { getDoc, doc } from "firebase/firestore";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      isSmallViewport: window.innerWidth < 576,
      dataready: false,
      chartData: [],
      chartCat: [],
      chartOptions: {
        chart: {
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "80%",
            endingShape: "rounded",
            dataLabels: {
              enabled: false,
            }
          },
        },
        xaxis: {
          categories: this.chartCat,
        },
        colors: ["#28C76F", "#EA5455"],
        legend: { position: "top", offsetY: 8 },
        fill: { opacity: 1 },
        responsive: [
          {
            breakpoint: 576,
            options: {
              plotOptions: {
                bar: {
                  horizontal: false,
                  endingShape: "rounded",
                }
              },
              dataLabels: {
                enabled: false,
              },
            },

          },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      var salesList = []
      var qtyList = []
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let curryear = new Date().getFullYear()

      const salesDocRef = doc(db, "users", localStorage.getItem("userID"), "data", "sales")
      let salesnap = (await getDoc(salesDocRef)).data()[curryear]


      const salesqtyDocRef = doc(db, "users", localStorage.getItem("userID"), "data", "sales_qty")
      let salesqtysnap = (await getDoc(salesqtyDocRef)).data()[curryear]
      

      for (var month of months) {
        if (salesnap.hasOwnProperty(month)) {
          this.chartCat.push(month)
          salesList.push(salesnap[month])
          qtyList.push(salesqtysnap[month])
        }
      }

      this.chartData = [
        {
          name: "Sales",
          data: salesList,
        },
        {
          name: "Purchase",
          data: qtyList,
        },
      ]
      // Update xaxis categories after populating chartCat
      this.chartOptions.xaxis.categories = this.chartCat;

      this.dataready = "True"
      console.log(this.chartCat);


    },
  },
};
</script>

<style></style>
