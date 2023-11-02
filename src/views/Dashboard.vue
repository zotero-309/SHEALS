<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Dashboard</h1>
  </div>

  <div class="page-wrapper">
    <div class="content">
      <div class="row">
        <!------------------------------------------------------------------ Graph --------------------------------------------------------->
        <div class="row mx-auto">
          <div class="col-lg-7 d-flex ">
            <div class="card flex-fill">
              <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                <h5 class="card-title m-2 mx-auto">Purchase & Sales</h5>
                <div class="graph-sets">

                  <!-- <div class="dropdown">
                    <button class="btn btn-white btn-sm dropdown-toggle" type="button" id="dropdownMenuButton"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      {{ selectedYear }}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li @click="selectYear('2022')">
                        <a href="javascript:void(0)" class="dropdown-item">2022</a>
                      </li>
                      <li @click="selectYear('2021')">
                        <a href="javascript:void(0)" class="dropdown-item">2021</a>
                      </li>
                      <li @click="selectYear('2020')">
                        <a href="javascript:void(0)" class="dropdown-item">2020</a>
                      </li>
                    </ul>
                  </div> -->

                </div>
              </div>
              <div class="card-body">
                <div>
                  <apexchart/>
                </div>
              </div>
            </div>
          </div>


        <!---------------------------------------------------------- Stats Counters --------------------------------------------------------->
        <!-- <div class="row my-3">
          <div class="col-6 ">
            <div class="dash-widget d-flex justify-content-center align-items-center ">
              <div class="dash-widgetimg">
                <svg class="bi">
                  <use xlink:href="#shop" />
                </svg>
              </div>
              <div class="dash-widgetcontent">
                <h5><span class="counters" data-count="43">438</span></h5>
                <h6>Items Sold Today</h6>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="dash-widget dash1 d-flex justify-content-center align-items-center ">
              <div class="dash-widgetimg">
                <svg class="bi">
                  <use xlink:href="#cash-coin" />
                </svg>
              </div>
              <div class="dash-widgetcontent">
                <h5>$<span class="counters" data-count="2380.00">2380.00</span></h5>
                <h6>Today's Sales</h6>
              </div>
            </div>
          </div>
        </div> -->

        <div class="col-lg-5 mt-md-3 mt-lg-0">
          <div class="row mb-3">
            <div class="card flex-fill p-0">
            <div class="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 class="card-title m-2 mx-auto">Days to Expiry</h5>
            </div>
            <div class="card-body scroll-content">
              <div class="table-responsive dataview">
                <table class="table datatable">
                  <thead>
                    <tr>
                      <th>Barcode</th>
                      <th>Product</th>
                      <th>Deal</th>
                      <th>Category</th>
                      <th>Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="data in expireList" :key="data">
                      <td>{{ data.barcode }}</td>
                      <td>{{ data.product_name }}</td>
                      <td>{{ data.deal_name }}</td>
                      <td>{{ data.product_category }}</td>
                      <td>{{ data.daysToExpiry }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>
          <div class="row">
            <div class="card flex-fill p-0">
            <div class="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 class="card-title m-2 mx-auto">Stock Tracking</h5>
            </div>
            <div class="card-body scroll-content">
              <div class="table-responsive dataview">
                <table class="table datatable">
                  <thead>
                    <tr>
                      <th>Barcode</th>
                      <th>Product</th>
                      <th>Deal</th>
                      <th>Category</th>
                      <th>Instock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="data in lowstockList" :key="data">
                      <td>{{ data.barcode }}</td>
                      <td>{{ data.product_name }}</td>
                      <td>{{ data.deal_name }}</td>
                      <td>{{ data.product_category }}</td>
                      <td>{{ data.deal_quantity }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>
        </div>


      </div>

      </div>
    </div>
  </div>
</template>

<script>
import saleschart from "../components/ChartComponentFB.vue"
import {getDocs, collection, query, where} from "firebase/firestore"
import  { db } from '../firebase/index.js'

export default {
  components: {
    apexchart: saleschart,
  },
  data() {
    return {
      //selectedYear: new Date().getFullYear() - 1,
      expireList: [],
      lowstockList: []
    };
  },
  created(){
    this.populate_expire_lowstock()
  },
  methods: {
    // selectYear(year) {
    //   this.selectedYear = year;
    // },
    async populate_expire_lowstock(){
      const dealsRef = collection(db, "deals")
      const q = query(dealsRef, where("uploaded_by.email", "==", localStorage.getItem('userEmail')))
      const querySnap = await getDocs(q)
      // const curryear = new Date().getFullYear()
      // const currmonth = new Date().getMonth()
      const currDate = new Date()

      querySnap.forEach((doc) => {
        let res = doc.data()
        //initialize lowstocklist (sort)
        this.lowstockList.push(res)

        //computing difference in days
        let differenceInDays = Math.abs(
        (currDate - new Date(res.deal_expiry)) / (1000 * 60 * 60 * 24)
      ).toFixed()
      res["daysToExpiry"] = parseInt(differenceInDays)
      this.expireList.push(res)

    })


    this.lowstockList = this.lowstockList.sort(function(a,b){
      return a.deal_quantity - b.deal_quantity
    })

    this.expireList = this.expireList.sort(function(a,b){
      return a.daysToExpiry - b.daysToExpiry
    })

    }

  },
};
</script>


<style>
.bi {
  width: 25px;
  height: 25px;
  margin-right: 2rem;
}

.datatable{
  text-align: center;
  vertical-align: middle;
}

.scroll-content {
    max-height: 225px;
    overflow-y: auto;
  }
.scroll-content::-webkit-scrollbar {
    width: 8px;
}

  .scroll-content::-webkit-scrollbar-track {
    background:white;
    border-radius: 4px;
  }

  .scroll-content::-webkit-scrollbar-thumb {
    background: lightgrey;
    border-radius: 4px;
  }


</style>

<!-- 
  Joelene Notes:

 -->