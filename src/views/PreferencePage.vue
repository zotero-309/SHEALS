<template>
  <div id="app" class="container-fluid body">
    <h1>SHEALS</h1>
    <form class="row" @submit.prevent="addPreference">
      <div class='col-2'></div>
      <div class="col-8 box">
        <h2>Set Your Preferences</h2>

        <label for="address" class="form-label">Address:</label>
        <input type="text" class="form-control w-75" id="address" name="address" 
                placeholder="Enter Your Home Address">

        <div class = 'row'>
          <div class="category col-6">
            <span>Product Category:</span>
            <div v-for="category in food_categories" :key="category" name="category" @change="updateSelectedCategories(category)">
              <input type="checkbox"  :value="category" :id="category" >
              <label :for="category">{{category}}</label>
            </div>
          </div>
  
          <div class="deals col-6">
            <span>Preferred Deals:</span>
              <div v-for="deal_type in deal_types" :key="deal_type">
                <input type="checkbox" :value="deal_type" :id="deal_type" @change="updateSelectedDealTypes(deal_type)"> 
                <label :for="deal_type">{{deal_type}}</label>
              </div>
          </div>
        </div>

        <button type="submit" class="btn btn-dark" >Submit</button>
      </div>

      <div class='col-2'></div>

    </form>

  </div>
</template>

<script>
  import { useStore } from 'vuex';
  import { ref, onMounted } from 'vue';

  export default {
    data() {
      return {
        home_address: "",
        food_categories: ['Bakery' ,'Beer, Wine & Spirits', 'Diary, Chilled & Eggs','Drinks',
                        'Food Cupboard','Frozen','Fruits', 'Meat & Seafood', 'Pet Supplies' ,
                        'Rice, Noodles & Cooking Ingredients', 'Snacks & Confectionery', 'Vegetables'],
        deal_types: ['Percentage discounts (eg "30% off")', 'Price discounts (eg "$2 off")',
                    '1 for 1 deals', '"X for $Y" deals'],
      }
    },
      
    setup() {
      const store = useStore();
      const addressInput  = ref(null);
      const selectedCategories = ref([]);
      const selectedDealTypes = ref([])

      const updateSelectedCategories = (category) => {
        if (!selectedCategories.value.includes(category)) {
          selectedCategories.value.push(category);
        } else {
          selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
        }
      };

      const updateSelectedDealTypes = (dealType) => {
        if (!selectedDealTypes.value.includes(dealType)) {
          selectedDealTypes.value.push(dealType);
        } else {
          selectedDealTypes.value = selectedDealTypes.value.filter((d) => d !== dealType);
        }
      };

      onMounted(() => {
        // Access the DOM element with the id "address"
        var autocomplete = new google.maps.places.Autocomplete(
          document.getElementById("address"),
        );
        autocomplete.setComponentRestrictions({ // restrict the country
          country: ["sg"]
        })
        autocomplete.addListener("place_changed", () => {
          addressInput.value = document.getElementById("address").value;
        });
      });

      const addPreference = () => {
        const data = {
          address: addressInput.value,
          categories: selectedCategories.value,
          dealTypes: selectedDealTypes.value,
        }  
        store.dispatch('addPreference', data);
      }
      console.log(addressInput.value)
      console.log(selectedCategories.value)
      console.log(selectedDealTypes.value)
      return {
        addPreference,
        updateSelectedCategories,
        updateSelectedDealTypes
      };

  },
    
    }

</script>

<style scoped>
      .body {
          background-color: rgba(241, 193, 201, 0.39);
      }

      form {
        padding-bottom: 30px;
        padding-top: 30px;
      }
  
      div {
          font-family: cursive;
          font-size: 18px;
      }
  
      .box {
          background-color: rgb(255, 250, 250);
          border: 2px solid #2e460b;
      }
  
      h1 {
          padding: 10px 50px;
          margin-left: 60px;
          font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
          font-weight: bold;
          font-size: 60px;
          color: rgba(67, 42, 21, 0.984);
      }
  
      h2 {
          text-align: center;
          padding: 15px 0px;
          font-size: 40px;
      }
  
      .category,.deals {
          padding-left: 20px;
          padding-bottom: 20px;
      }
  
      input[type=text],.btn {
          margin-bottom: 20px;
      }
  
      label {
          padding-left: 10px;
      }
  </style>