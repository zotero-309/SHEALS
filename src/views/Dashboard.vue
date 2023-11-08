<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Dashboard</h1>
  </div>

  <!---------------------------------------------------------- Stats Counters --------------------------------------------------------->
  <div class="row my-3">
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
              </div>
              <div class="card-body"><apexchart /><div>
            </div>
          </div>
        </div>
      </div>


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
                          <th>Days</th>
                          <th>Barcode</th>
                          <th>Product</th>
                          <th>Deal</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="data in expireList" :key="data">
                          <td>{{ data.daysToExpiry }}</td>
                          <td>{{ data.barcode }}</td>
                          <td>{{ data.product_name }}</td>
                          <td>{{ data.deal_name }}</td>
                          <td>{{ data.product_category }}</td>
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
                          <th>Instock</th>
                          <th>Barcode</th>
                          <th>Product</th>
                          <th>Deal</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="data in lowstockList" :key="data">
                          <td>{{ data.deal_quantity }}</td>
                          <td>{{ data.barcode }}</td>
                          <td>{{ data.product_name }}</td>
                          <td>{{ data.deal_name }}</td>
                          <td>{{ data.product_category }}</td>
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
import { getDocs, collection, query, where } from "firebase/firestore"
import { db } from '../firebase/index.js'

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
  created() {
    this.populate_expire_lowstock()
  },
  methods: {
    // selectYear(year) {
    //   this.selectedYear = year;
    // },
    async populate_expire_lowstock() {
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


      this.lowstockList = this.lowstockList.sort(function (a, b) {
        return a.deal_quantity - b.deal_quantity
      })

      this.expireList = this.expireList.sort(function (a, b) {
        return a.daysToExpiry - b.daysToExpiry
      })

    }

  },
};
</script>


<style scoped>
.bi {
  width: 25px;
  height: 25px;
}

.datatable {
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
  background: white;
  border-radius: 4px;
}

.scroll-content::-webkit-scrollbar-thumb {
  background: lightgrey;
  border-radius: 4px;
}

/* Styles for tablets (medium devices) */
@media (max-width: 992px) {

  /* Adjust styles for medium devices like tablets here */
  .card-header h5.card-title {
    font-size: 1.2rem;
    /* Example: Reduce font size */
  }

  /* ... other styles for medium devices ... */
}

/* Styles for landscape phones (small devices) */
@media (max-width: 768px) {

  /* Adjust styles for small devices like landscape phones here */
  .card-header h5.card-title {
    font-size: 1rem;
    /* Example: Further reduce font size */
  }

  /* ... other styles for small devices ... */
}

/* Styles for portrait phones (extra small devices) */
@media (max-width: 576px) {

  /* Adjust styles for extra small devices like portrait phones here */
  .card-header h5.card-title {
    font-size: 0.8rem;
    /* Example: Further reduce font size */
  }

  /* Stack elements vertically instead of horizontally */
  .d-flex {
    flex-direction: column;
  }

  /* ... other styles for extra small devices ... */
}

/* You can also add media queries for large screens (large devices) if needed */
@media (min-width: 1200px) {
  /* Adjust styles for large screens here */
  /* ... */
}

/* High-resolution displays */
@media (-webkit-min-device-pixel-ratio: 2),
(min-resolution: 192dpi) {
  /* Adjust styles for high-resolution displays here */
  /* ... */
}

/* Print styles */
@media print {

  /* Adjust styles for printing here */
  /* Hide elements not needed in print */
  .navbar,
  .sidebar,
  .footer {
    display: none;
  }

  /* ... */
}
</style>

<!-- 
  Joelene Notes:

 -->