<template>
  <div >
    <apexchart type="bar" :options="chartOptions" :series="chartData" v-if="dataready"/>
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
      dataready: false,
      chartData: [],
      chartCat: [],
      chartOptions: {
        chart: {
          height: 100,
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "90%",
            endingShape: "rounded",
          },
        },
        xaxis: {
          categories: this.chartCat,
        },
        colors: ["#28C76F", "#EA5455"],
        legend: { position: "right", offsetY: 40 },
        fill: { opacity: 1 },
        responsive: [
          {
            breakpoint: 280,
            options: {
              legend: { position: "bottom", offsetY: 0 },
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
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let curryear = new Date().getFullYear()

        const salesDocRef = doc(db, "users", localStorage.getItem("userID"), "data", "sales")
        let salesnap = (await getDoc(salesDocRef)).data() [curryear]


        const salesqtyDocRef = doc(db, "users", localStorage.getItem("userID"), "data", "sales_qty")
        let salesqtysnap = (await getDoc(salesqtyDocRef)).data() [curryear]

     

        for (var month of months) {
          if (salesnap.hasOwnProperty(month)){
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

      this.dataready="True"
        

    },
  },
};
</script>

<style>

</style>
